// Dimensions in millimetres. Scene scale: 1 three.js unit = 1 metre.
// Transfer direction is +X. Ported verbatim from the original index.html.
export const MM = 0.001;
export const D2R = Math.PI / 180;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
export const easeOutBack = (t) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export const P = {
  seatW: 386, seatD: 430, seatT: 62,
  seatMin: 380, seatMax: 820, seatStart: 450,
  travel: 420,
  railLen: 370, railZ: 0, railDepth: 300, railT: 20,
  frameY: 205,
  wheelR: 255, wheelTh: 34, wheelX: 248, wheelZ: -85,
  castR: 92, castTh: 30, castX: 188, castZ: 300,
  bedW: 980, bedD: 1900, bedT: 90,
};

export const PHASES = [
  { name: 'Match the height', dur: 2.3 },
  { name: 'Open the side', dur: 1.5 },
  { name: 'Bridge the divide', dur: 2.4 },
  { name: 'Lock and slide', dur: 2.6 },
  // 5th beat, deliberately NOT in the sidebar step list — it is the closing
  // shot for the video, not one of the four steps in the pitch.
  { name: 'Clear away', dur: 2.8 },
];
export const TOTAL = PHASES.reduce((a, p) => a + p.dur, 0);
