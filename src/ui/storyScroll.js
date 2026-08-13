import { store } from '../config/store.js';
import { view } from '../engine/cameraRig.js';

// Per-section establishing camera angle — a soft waypoint layered over the
// manual orbit state, same relationship autoFit already has to manual drag:
// only steers the camera if the user hasn't taken manual control.
const WAYPOINTS = {
  'sec-hero': [-0.42, 1.05],
  'sec-features': [0.25, 1.1],
  'sec-summary': [-0.42, 1.02],
  'sec-purchase': [-0.1, 1.2],
};

// The three phase sections are handled entirely by ui/phaseScroll.js
// (continuous scroll position, not enter/exit events), so they're excluded
// here — observing them too would fight phaseScroll.js over
// body.phases-active on every scroll tick.
export function initStoryScroll() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!entry.isIntersecting) return;
      store.set({ section: id.replace('sec-', '') });
      const wp = WAYPOINTS[id];
      if (wp && store.get().autoFit) view(wp[0], wp[1]);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('#story > section:not(.phase-scroll)').forEach((s) => io.observe(s));
}
