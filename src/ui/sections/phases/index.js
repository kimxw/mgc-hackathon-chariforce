import { el } from '../../dom.js';
import { store } from '../../../config/store.js';
import { bed } from '../../../engine/surface.js';
import { contact } from '../../../engine/surface.js';
import { apply } from '../../../engine/apply.js';
import { setXray } from '../../../engine/xray.js';
import { view, fitView } from '../../../engine/cameraRig.js';
import { registerPad } from '../../../engine/panelRegistry.js';
import { setPlay } from '../../../engine/playback.js';
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
  const btnMech = el('button', { class: 'cf-btn', title: 'X-ray the mechanism' }, 'X-ray');
  btnMech.onclick = () => { store.set({ xray: !store.get().xray }); setXray(store.get().xray); apply(); };
  const btnCine = el('button', { class: 'cf-btn', title: 'Cinematic mode, for filming' }, 'Cinematic');
  const cineExit = el('div', { class: 'cf-cine-exit' }, 'Esc to exit cinematic');
  function exitCine() {
    document.body.classList.remove('cine');
    setTimeout(() => { if (store.get().autoFit) fitView(); }, 330);
  }
  btnCine.onclick = () => {
    document.body.classList.add('cine');
    setTimeout(() => { if (store.get().autoFit) fitView(); }, 330);
    store.set({ t: 0 });
    setPlay(true);
  };
  cineExit.onclick = exitCine;
  addEventListener('keydown', (e) => {
    // don't hijack space/F while the user is typing (e.g. the quote-request
    // email field) — Escape still works everywhere, matching browser norms
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';
    if (e.key === 'Escape') exitCine();
    if (typing) return;
    if (e.key === 'f' || e.key === 'F') btnFit.onclick();
    if (e.key === ' ' && store.get().phase === 1) { e.preventDefault(); document.getElementById('bPlay')?.click(); }
  });

  const viewBar = el('div', { class: 'cf-panel cf-viewbar cf-chrome' }, [
    el('div', { class: 'cf-vb-row' }, [btnIso, btnFront, btnTop]),
    el('div', { class: 'cf-vb-row' }, [btnFit, btnPat, btnSpin]),
    el('div', { class: 'cf-vb-row' }, [btnMech, btnCine]),
  ]);

  function syncViewButtons() {
    const s = store.get();
    btnFit.classList.toggle('on', s.autoFit);
    btnPat.classList.toggle('on', s.patient);
    btnSpin.classList.toggle('on', s.spin);
    btnMech.classList.toggle('on', s.xray);
  }
  syncViewButtons();
  store.subscribe(syncViewButtons);

  const leftPanel = el('div', { class: 'cf-panel cf-panel-l cf-chrome' }, [
    el('div', { class: 'cf-brand' }, [el('h1', {}, 'Chair Force')]),
    timeline,
  ]);
  const rightPanel = el('div', { class: 'cf-panel cf-panel-r cf-chrome' }, []);
  const barSlot = el('div', {});
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
    document.body.classList.toggle('mobile-has-bar', n === 1); // mobile CSS lifts the stacked panels clear of the bar

    bed.visible = contact.visible = (n === 1);
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
    requestAnimationFrame(fitView);
    byPhase[n].refresh?.();
  }

  // The overlay (panels/bar/hint) is fixed-position chrome, shown or hidden
  // by phaseScroll.js via body.phases-active — it doesn't need to live
  // "inside" any one phase section, so it's just parked in phase 1's.
  const overlay = el('div', { class: 'phases-overlay' }, [leftPanel, rightPanel, viewBar, barSlot, hint, cineExit]);

  // Three separate scroll-length sections, IKEA-configurator style: phase 1
  // is tall enough that scrolling through it scrubs the transfer animation
  // start to finish; phases 2/3 are shorter "hold and browse" slides. See
  // ui/phaseScroll.js for the scroll -> progress/phase mapping.
  const phase1El = el('section', { id: 'sec-phase1', class: 'phase-scroll phase-scroll-1' }, [overlay]);
  const phase2El = el('section', { id: 'sec-phase2', class: 'phase-scroll phase-scroll-2' }, []);
  const phase3El = el('section', { id: 'sec-phase3', class: 'phase-scroll phase-scroll-3' }, []);

  registerPad(leftPanel);
  registerPad(rightPanel);
  registerPad(viewBar);
  registerPad(p1.barContent); // the actual fixed-position bar, not its (zero-size) wrapper

  return { sectionEls: [phase1El, phase2El, phase3El], setPhase };
}
