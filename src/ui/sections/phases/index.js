import { el } from '../../dom.js';
import { store } from '../../../config/store.js';
import { bed } from '../../../engine/surface.js';
import { contact } from '../../../engine/surface.js';
import { apply } from '../../../engine/apply.js';
import { view, fitView } from '../../../engine/cameraRig.js';
import { registerPad, unregisterPad } from '../../../engine/panelRegistry.js';
import { buildPhase1 } from './phase1Transfer.js';
import { buildPhase2 } from './phase2Modular.js';
import { buildPhase3 } from './phase3Configure.js';

// Stages 2 and 3 swapped: chassis configuration now comes before modules.
const PHASE_META = [
  { id: 1, key: 'phase1', title: 'The transfer mechanism' },
  { id: 2, key: 'phase3', title: 'Configure the chassis' },
  { id: 3, key: 'phase2', title: 'Modular growth' },
];

export function buildPhasesSection() {
  const p1 = buildPhase1();
  const p2 = buildPhase2();
  const p3 = buildPhase3();
  const byPhase = { 1: p1, 2: p3, 3: p2 };

  // Vertical collapsible timeline, in the left panel itself rather than
  // floating at the top of the screen — one numbered section per phase,
  // only the active one expanded, connected by a rail line. Headers are
  // the click-to-jump control (scrolls to that phase's section; the scroll
  // handler in phaseScroll.js is what actually drives setPhase()).
  const tlSteps = PHASE_META.map((m, i) => {
    const badge = el('span', { class: 'cf-tl-badge' }, String(m.id));
    const rail = el('div', { class: 'cf-acc-rail' }, i < PHASE_META.length - 1 ? [badge, el('span', { class: 'cf-acc-vline' })] : [badge]);
    const header = el('button', { class: 'cf-acc-header' }, m.title);
    const body = el('div', { class: 'cf-acc-body' }, []);
    const main = el('div', { class: 'cf-acc-main' }, [header, body]);
    const section = el('div', { class: 'cf-acc-section' }, [rail, main]);
    header.onclick = () => document.getElementById(`sec-phase${m.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return { id: m.id, section, badge, body };
  });
  const timeline = el('div', { class: 'cf-acc' }, tlSteps.map((s) => s.section));

  function syncTimeline(n) {
    tlSteps.forEach((s) => {
      const done = s.id < n, current = s.id === n;
      s.section.classList.toggle('done', done);
      s.section.classList.toggle('current', current);
      s.badge.textContent = done ? '✓' : String(s.id);
    });
  }

  // ---- View controls — a compact top-right toolbar, not sidebar clutter ----
  const btnIso = el('button', { class: 'cf-btn' }, 'Iso');
  const btnFront = el('button', { class: 'cf-btn' }, 'Front');
  const btnTop = el('button', { class: 'cf-btn' }, 'Top');
  btnIso.onclick = () => view(-0.42, 1.02);
  btnFront.onclick = () => view(0.0001, 1.5708);
  btnTop.onclick = () => view(0.0001, 0.12);

  const btnFit = el('button', { class: 'cf-btn', title: 'Auto-fit the view' }, 'Fit');
  btnFit.onclick = () => { store.set({ autoFit: true }); fitView(); };
  const btnPat = el('button', { class: 'cf-btn', title: 'Toggle the occupant' }, 'Rider');
  btnPat.onclick = () => { store.set({ patient: !store.get().patient }); apply(); };
  const btnSpin = el('button', { class: 'cf-btn', title: 'Toggle auto-rotate' }, 'Spin');
  btnSpin.onclick = () => store.set({ spin: !store.get().spin });
  addEventListener('keydown', (e) => {
    // don't hijack space/F while the user is typing (e.g. the quote-request
    // email field)
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';
    if (typing) return;
    if (e.key === 'f' || e.key === 'F') btnFit.onclick();
    if (e.key === ' ' && store.get().phase === 1) { e.preventDefault(); document.getElementById('bPlay')?.click(); }
  });

  const viewBar = el('div', { class: 'cf-panel cf-viewbar cf-chrome' }, [
    el('div', { class: 'cf-vb-row' }, [btnIso, btnFront, btnTop]),
    el('div', { class: 'cf-vb-row' }, [btnFit, btnPat, btnSpin]),
  ]);

  function syncViewButtons() {
    const s = store.get();
    btnFit.classList.toggle('on', s.autoFit);
    btnPat.classList.toggle('on', s.patient);
    btnSpin.classList.toggle('on', s.spin);
  }
  syncViewButtons();
  store.subscribe(syncViewButtons);

  const leftPanel = el('div', { class: 'cf-panel cf-panel-l cf-chrome' }, [
    el('div', { class: 'cf-brand' }, [el('h1', {}, 'Chair Force')]),
    timeline,
  ]);
  const rightPanel = el('div', { class: 'cf-panel cf-panel-r cf-chrome' }, []);
  const barSlot = el('div', {});

  // ---- Mobile bottom sheet ----------------------------------------------
  // Desktop keeps the two corner panels exactly as they were (this wrapper
  // has no box of its own there — leftPanel/rightPanel are position:fixed,
  // so a plain div around them collapses to zero size and never touches
  // desktop layout). Below 760px it becomes a real collapsible sheet
  // instead of a shrunk copy of the desktop corners: stacking both panels
  // at fixed 29vh caps left the 3D model a sliver at the top of a phone
  // screen — exactly the "hidden behind controls" failure a configurator
  // can't ship with. Both breakpoints render the SAME leftPanel/rightPanel
  // content/state; only the container around them differs.
  const CHEV = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const sheetBadge = el('span', { class: 'sheet-badge' }, '1');
  const sheetTitle = el('span', { class: 'sheet-title' }, PHASE_META[0].title);
  const sheetHandle = el('button', {
    class: 'sheet-handle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'sheet-body',
  }, [sheetBadge, sheetTitle, el('span', { class: 'sheet-chev', html: CHEV })]);
  const sheetBody = el('div', { class: 'sheet-body', id: 'sheet-body' }, [leftPanel, rightPanel]);
  const mobileSheet = el('div', { class: 'mobile-sheet cf-chrome' }, [sheetHandle, sheetBody]);
  const setSheetOpen = (open) => {
    mobileSheet.classList.toggle('open', open);
    sheetHandle.setAttribute('aria-expanded', String(open));
  };
  sheetHandle.onclick = () => setSheetOpen(!mobileSheet.classList.contains('open'));
  // Re-fit once the sheet's own height transition (panels.css, .sheet-body
  // max-height) actually finishes — refitting mid-transition would measure
  // a still-animating (wrong) height. Phase 1's bounds include the bed
  // (computeBounds() in cameraRig.js), so it sits lower in frame than
  // phases 2/3's chair-only bounds; without this it was the one that
  // actually got clipped behind the sheet on open, not just less centered.
  sheetBody.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'max-height' && store.get().autoFit) fitView();
  });
  // tapping the model (or anywhere else) tucks the sheet away again, same
  // as the nav dropdown — it shouldn't have to be manually collapsed
  // before the user can see/orbit what it was covering
  document.addEventListener('pointerdown', (e) => {
    if (mobileSheet.classList.contains('open') && !e.target.closest('.mobile-sheet')) setSheetOpen(false);
  });

  // Which elements represent "the panel corner" for the camera's auto-fit
  // padding (engine/panelRegistry.js) differs by breakpoint too: on mobile,
  // leftPanel/rightPanel report their full (uncollapsed) content size
  // regardless of the sheet being visually collapsed — getBoundingClientRect
  // isn't clipped by an ancestor's overflow — so the camera would keep
  // reserving space for an expanded sheet even while it's collapsed to a
  // handle. Registering mobileSheet instead (its OWN height really is just
  // the handle when collapsed) fixes that; desktop keeps the precise
  // per-panel registration it already had.
  const panelMQ = matchMedia('(max-width:760px)');
  function syncPanelPads() {
    if (panelMQ.matches) {
      unregisterPad(leftPanel); unregisterPad(rightPanel);
      registerPad(mobileSheet);
    } else {
      unregisterPad(mobileSheet);
      registerPad(leftPanel); registerPad(rightPanel);
    }
  }
  syncPanelPads();
  panelMQ.addEventListener('change', syncPanelPads);
  // Mobile-only "next phase" advance — scroll drives orbit there instead
  // (cameraRig.js), so it can't reliably double as the phase-to-phase
  // scrub/advance gesture the way it does with a mouse+wheel on desktop.
  // This gives touch a guaranteed way to move on regardless of how that
  // gesture-disambiguation behaves on any given device.
  const NEXT_TARGET = { 1: 'sec-phase2', 2: 'sec-phase3', 3: 'sec-summary' };
  const PREV_TARGET = { 1: 'sec-features', 2: 'sec-phase1', 3: 'sec-phase2' };
  const DOWN_CHEV = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const UP_CHEV = '<svg viewBox="0 0 24 24" fill="none"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nextBtn = el('button', {
    class: 'cf-panel cf-next-btn cf-chrome', type: 'button', 'aria-label': 'Next', title: 'Next',
  }, ['Next', el('span', { class: 'cf-next-btn-icon', html: DOWN_CHEV })]);
  nextBtn.onclick = () => {
    document.getElementById(NEXT_TARGET[store.get().phase])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  // Mirrors nextBtn — same reasoning, opposite corner and direction. Phase
  // 1's target (sec-features) steps back out of the configurator entirely,
  // same as phase 3's "next" (sec-summary) steps forward out of it.
  const prevBtn = el('button', {
    class: 'cf-panel cf-prev-btn cf-chrome', type: 'button', 'aria-label': 'Previous', title: 'Previous',
  }, [el('span', { class: 'cf-next-btn-icon', html: UP_CHEV }), 'Previous']);
  prevBtn.onclick = () => {
    document.getElementById(PREV_TARGET[store.get().phase])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hint = el('div', { class: 'cf-hint cf-chrome' }, [
    'scroll to play it out · drag orbit · shift-drag pan · ',
    el('b', {}, 'space'),
    ' play/pause · ',
    el('b', {}, 'F'),
    ' refit',
  ]);

  function setPhase(n) {
    store.set({ phase: n });
    // NOTE: body.phases-active is NOT set here — that's owned exclusively by
    // ui/phaseScroll.js, which tracks scroll position across all three
    // phase sections. Setting it here too would make the fixed panels
    // appear over whichever section is actually in view.
    syncTimeline(n);
    tlSteps.forEach((s) => { s.body.innerHTML = ''; }); // only the active section's body holds content
    tlSteps[n - 1].body.appendChild(byPhase[n].leftContent);
    rightPanel.innerHTML = ''; rightPanel.appendChild(byPhase[n].rightContent);
    barSlot.innerHTML = '';
    if (n === 1) barSlot.appendChild(p1.barContent);
    document.body.classList.toggle('mobile-has-bar', n === 1); // mobile CSS lifts the sheet clear of the bar
    sheetBadge.textContent = String(n);
    sheetTitle.textContent = PHASE_META[n - 1].title;
    setSheetOpen(false); // start collapsed on every phase change — the model, not the sheet, should greet a new phase

    const cam = store.get().camera;
    if (n === 1) {
      store.set({ spin: false, patient: true });
      cam.theta = -0.42; cam.phi = 1.02; // the transfer sequence's own establishing angle
    } else {
      store.set({ t: 0, playing: false, spin: true, patient: false }); // modules are the subject here
      cam.theta = 0.7; cam.phi = 1.12; // 3/4 front, start of the spin
    }
    apply();
    store.set({ autoFit: true });
    // bed/contact visibility waits for the SAME rAF as fitView, rather than
    // flipping on immediately — otherwise there's a frame (or several, on a
    // slow scroll) where the bed is already visible but the camera hasn't
    // reframed to phase 1's establishing angle yet, i.e. the bed briefly
    // renders wherever it sits under the *previous* section's camera angle,
    // reading as a stray model flashing on screen.
    requestAnimationFrame(() => {
      fitView();
      bed.visible = contact.visible = (n === 1);
    });
    byPhase[n].refresh?.();
  }

  // The overlay (panels/bar/hint) is fixed-position chrome, shown or hidden
  // by phaseScroll.js via body.phases-active — it doesn't need to live
  // "inside" any one phase section, so it's just parked in phase 1's.
  const overlay = el('div', { class: 'phases-overlay' }, [mobileSheet, viewBar, barSlot, hint, prevBtn, nextBtn]);

  // Three separate scroll-length sections, IKEA-configurator style: phase 1
  // is tall enough that scrolling through it scrubs the transfer animation
  // start to finish; phases 2/3 are shorter "hold and browse" slides. See
  // ui/phaseScroll.js for the scroll -> progress/phase mapping.
  const phase1El = el('section', { id: 'sec-phase1', class: 'phase-scroll phase-scroll-1' }, [overlay]);
  const phase2El = el('section', { id: 'sec-phase2', class: 'phase-scroll phase-scroll-2' }, []);
  const phase3El = el('section', { id: 'sec-phase3', class: 'phase-scroll phase-scroll-3' }, []);

  registerPad(viewBar);
  registerPad(p1.barContent); // the actual fixed-position bar, not its (zero-size) wrapper
  // nextBtn deliberately NOT registered: it's a small mobile-only pill
  // anchored to the right edge with nothing matching it on the left, so
  // reserving space for it skewed computePad()'s l/r symmetry and pushed
  // the whole model off-center to the left on every mobile phase — a much
  // worse trade than the pill occasionally floating over a corner of it.

  return { sectionEls: [phase1El, phase2El, phase3El], setPhase };
}
