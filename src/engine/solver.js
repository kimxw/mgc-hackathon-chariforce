import { PHASES, P, ease, clamp, lerp } from './constants.js';
import { store } from '../config/store.js';
import { seatWidthNow } from './seat.js';

export function phaseAt(t) {
  let acc = 0;
  for (let i = 0; i < PHASES.length; i++) {
    // epsilon: cumulative float sums land a hair under the nominal boundary,
    // so an exact "end of step" time must still resolve to that step
    if (t <= acc + PHASES[i].dur + 1e-6 || i === PHASES.length - 1) return { i, p: clamp((t - acc) / PHASES[i].dur, 0, 1) };
    acc += PHASES[i].dur;
  }
  return { i: 3, p: 1 };
}

export function progressOf(i, t) { // 0..1 completion of phase i at time t
  let acc = 0;
  for (let k = 0; k < i; k++) acc += PHASES[k].dur;
  return clamp((t - acc) / PHASES[i].dur, 0, 1);
}

export function solve() {
  const s = store.get();
  const t = s.t;
  const p0 = ease(progressOf(0, t));
  const p1 = ease(progressOf(1, t));
  const p2 = ease(progressOf(2, t));
  const p3 = ease(progressOf(3, t));
  const p4 = progressOf(4, t);

  // closing beat: rails pull back in, then the chair rolls clear
  const retract = ease(clamp(p4 / 0.45, 0, 1));
  const rollback = ease(clamp((p4 - 0.4) / 0.6, 0, 1));

  const seatY = lerp(P.seatStart, s.seatTarget, p0) - 90 * rollback; // settles back down
  const armA = p1 * 145 * (Math.PI / 180) * (1 - rollback); // armrest closes again
  const ext = p2 * P.travel * (1 - retract);
  const slide = p3;
  const chairZ = -560 * rollback; // rolls backward, clear

  const halfW = seatWidthNow / 2;
  const overlap = (ext + halfW) - s.gap; // mm of seat over the surface
  const under = (seatY - P.seatT) - s.bed; // seat underside vs surface top
  const supported = overlap > 0 && under <= 12 && under >= -140;

  return { t, p0, p1, p2, p3, p4, retract, rollback, seatY, armA, ext, slide, chairZ, overlap, under, supported, halfW };
}
