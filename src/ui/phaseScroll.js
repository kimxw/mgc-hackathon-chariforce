// Drives the phases experience purely off scroll position — the IKEA-
// configurator feel the site is going for: scrolling through phase 1's
// (tall) section scrubs the transfer animation start to finish, and running
// out of that scroll range naturally lands you in phase 2's section next,
// no separate "next" affordance needed. Phases 2/3 don't have a timeline to
// scrub, so they're just shorter sections that hold the pin briefly.
import { store } from '../config/store.js';
import { TOTAL } from '../engine/constants.js';
import { apply } from '../engine/apply.js';
import { setPlay, syncScrub } from '../engine/playback.js';

export function initPhaseScroll(setPhase) {
  const sections = [1, 2, 3].map((n) => document.getElementById(`sec-phase${n}`));
  if (sections.some((s) => !s)) return;
  const [s1, , s3] = sections;

  let ticking = false;
  let entered = false; // have we actually been inside the phases zone yet this "visit"?
  function update() {
    ticking = false;
    const vh = innerHeight;
    const start = s1.offsetTop, end = s3.offsetTop + s3.offsetHeight;
    const ref = scrollY + vh * 0.5; // viewport midpoint decides which phase is "active"
    // the fixed overlay's on/off boundary requires the WHOLE viewport (top
    // AND bottom) to sit inside [start, end], not just the top — checking
    // only the top fixed the entry side (previous section lingering above
    // the panels) but left the exit side open: with `scrollY < end` alone,
    // phases-active stays true right up until the viewport's TOP reaches
    // `end`, by which point its BOTTOM has already been showing up to a
    // full viewport-height of the next section (Summary) peeking in
    // underneath the still-visible panels. Requiring the bottom edge
    // (scrollY + vh) to also clear `end` closes that gap on both sides.
    const within = scrollY >= start && (scrollY + vh) <= end;
    document.body.classList.toggle('phases-active', within);
    if (!within) { entered = false; return; }

    let active = 1;
    if (ref >= sections[1].offsetTop) active = 2;
    if (ref >= sections[2].offsetTop) active = 3;
    // `store.phase` starts at 1 from boot (set before the user has ever
    // scrolled, just to populate phase 1's DOM content) — so on the very
    // first scroll-in, `active === store.phase` even though setPhase's
    // side effects (occupant visible, establishing camera angle) have
    // never actually run for a real visit. `entered` forces that first call.
    if (!entered || store.get().phase !== active) setPhase(active);
    entered = true;
    store.set({ section: 'phases' });

    if (active === 1) {
      const span = s1.offsetHeight - vh;
      const progress = span > 0 ? Math.min(1, Math.max(0, (scrollY - start) / span)) : 0;
      store.set({ t: progress * TOTAL });
      setPlay(false); apply(); syncScrub();
    }
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(update));
  update();
}
