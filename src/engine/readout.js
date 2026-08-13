import { PHASES } from './constants.js';
import { store } from '../config/store.js';
import { phaseAt } from './solver.js';

const $ = (id) => document.getElementById(id);
// Guarded writes: the Phase 1 panel's readout elements are only mounted
// while phase1Transfer.js has built them (they persist once built, but
// apply() runs every frame from boot — this stays safe either way).
const set = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };

export function readout(R) {
  const s = store.get();
  const ph = phaseAt(s.t);
  set('oPhase', s.t <= 0 ? 'Ready' : PHASES[ph.i].name);
  set('oSeat', Math.round(R.seatY));
  set('oBed', Math.round(s.bed));
  const d = Math.round(R.seatY - s.bed);
  set('oDiff', (d > 0 ? '+' : '') + d);
  set('oExt', Math.round(R.ext));
  set('oArm', (R.p1 < 0.02 || R.rollback > 0.6) ? 'closed'
    : (R.p1 > 0.98 && R.rollback < 0.05) ? 'swung back' : 'swinging');
  set('oLap', R.ext < 1 ? '–' : (R.overlap > 0 ? Math.round(R.overlap) + ' mm' : 'no overlap'));

  const m = [];
  if (s.t <= 0) {
    m.push(['wr', 'Chair parked alongside. Seat is ' + Math.abs(d) + ' mm ' + (d < 0 ? 'below' : 'above') + ' the surface.']);
  } else if (R.p2 > 0.98) {
    if (R.overlap <= 0) m.push(['bd', 'Seat stops ' + Math.round(-R.overlap) + ' mm short of the surface edge. Roll the chair closer.']);
    else if (R.under > 12) m.push(['wr', 'Seat sits ' + Math.round(R.under) + ' mm proud of the surface; it is cantilevered, not resting. Lower the seat to land it.']);
    else if (R.under < -140) m.push(['bd', 'Seat is ' + Math.round(-R.under) + ' mm below the surface top. It will foul the edge on the way out.']);
    else if (R.overlap < 90) m.push(['wr', 'Only ' + Math.round(R.overlap) + ' mm bearing on the surface. Aim for 150 mm+.']);
    else m.push(['ok', Math.round(R.overlap) + ' mm of the seat is over the surface, resting on it. Slide path is clear and level to ' + (Math.abs(d) <= 15 ? 'within 15 mm' : Math.abs(d) + ' mm') + '.']);
  } else if (R.p4 > 0.02) {
    m.push(['ok', R.rollback > 0.5
      ? 'Transfer complete. Rails retracted, armrest closed, chair rolled clear: the patient is on the surface with no one lifting them.'
      : 'Slide finished. Rails retracting under the seat.']);
  } else if (R.p1 > 0.98) {
    m.push(['ok', 'Transfer side is open. Nothing above the seat plane on the way out.']);
  } else if (R.p0 > 0.98) {
    m.push([Math.abs(d) <= 25 ? 'ok' : 'wr', 'Seat at ' + Math.round(R.seatY) + ' mm, ' + (d === 0 ? 'level with' : (Math.abs(d) + ' mm ' + (d > 0 ? 'above' : 'below'))) + ' the surface.']);
  } else {
    m.push(['wr', 'Lifting…']);
  }
  const msgsEl = $('msgs');
  if (msgsEl) msgsEl.innerHTML = m.map(([c, x]) => '<div class="cf-msg ' + c + '">' + x + '</div>').join('');
}

// Queried live (not cached at module-load time) since the Phase 1 step rows
// are created dynamically by ui/sections/phases/phase1Transfer.js, which may
// load after this module. 4 small elements, called ~60x/sec — negligible.
export function syncSteps(R) {
  const stepEls = [...document.querySelectorAll('.cf-step')];
  if (!stepEls.length) return;
  const ps = [R.p0, R.p1, R.p2, R.p3];
  const cur = phaseAt(store.get().t).i;
  stepEls.forEach((el, i) => {
    el.classList.toggle('act', store.get().t > 0 && i === cur);
    el.classList.toggle('done', ps[i] >= 0.999);
  });
}
