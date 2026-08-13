// Single source of truth for app state. Engine code reads it imperatively
// (store.get() inside the render loop — a plain property read, same cost as
// the old module-level `S` global) so scroll/frame updates never trigger a
// re-render. DOM chrome subscribes once and re-renders its own slice on change.
const state = {
  // navigation (unused until milestone 2, present now so the shape is stable)
  section: 'hero',
  phase: 1,

  // transfer-sequence sim — 1:1 with the old `S` object
  t: 0,
  playing: false,
  bed: 560,
  seatTarget: 585,
  gap: 330,
  patient: false, // no occupant until scrolled into phase 1 — the landing page shows an empty chair
  spin: false,
  xray: false,
  cine: false,
  recA: 0,
  recTarget: 0,

  // configuration — shape unchanged from the old S.cfg
  cfg: {
    wheel: 'standard',
    seat: 'standard',
    back: 'standard',
    acc: { cup: false, umbrella: false, storage: false, tray: false, ivpole: false },
  },

  // camera — was module-level cTh/cPh/cR/panX/panY/autoFit. `autoFit` is a
  // discrete toggle (needs to notify subscribers so UI can react) so it
  // lives at the top level; theta/phi/radius/panX/panY mutate every drag
  // frame and are read directly via store.get().camera, never notified —
  // notifying 60x/sec during a drag would be pure waste.
  autoFit: true,
  camera: { theta: -0.42, phi: 1.02, radius: 4.4, panX: 0, panY: 0 },
};

const listeners = new Set();

export const store = {
  get: () => state,
  set(patch) {
    Object.assign(state, patch);
    listeners.forEach((fn) => fn(state));
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
