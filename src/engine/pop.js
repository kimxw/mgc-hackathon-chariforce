import { easeOutBack } from './constants.js';

// "pop" animation used when a module is swapped in — scale from 0 with an
// overshoot ease, over ~0.42s.
export const pops = [];

export function pop(g) {
  g.scale.set(0.001, 0.001, 0.001);
  pops.push({ g, t: 0 });
}

export function stepPops(dt) {
  for (let i = pops.length - 1; i >= 0; i--) {
    const p = pops[i];
    p.t = Math.min(1, p.t + dt / 0.42);
    const k = easeOutBack(p.t);
    p.g.scale.set(k, k, k);
    if (p.t >= 1) { p.g.scale.set(1, 1, 1); pops.splice(i, 1); }
  }
}
