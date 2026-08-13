import { el } from '../../dom.js';
import { content } from '../../../content.js';
import { store } from '../../../config/store.js';
import { TOTAL, PHASES } from '../../../engine/constants.js';
import { apply } from '../../../engine/apply.js';
import { setPlay, syncScrub } from '../../../engine/playback.js';

export function buildPhase1() {
  const c = content.phase1;

  const stepsList = el('div', { class: 'cf-grp first' }, [
    el('h2', {}, 'The four steps'),
    ...c.steps.map((s, i) => {
      const row = el('div', { class: 'cf-step', 'data-s': String(i) }, [
        el('div', { class: 'cf-num' }, String(s.n)),
        el('div', {}, [el('div', { class: 't' }, s.title), el('div', { class: 'd' }, s.desc)]),
      ]);
      row.onclick = () => {
        let acc = 0; for (let k = 0; k < i; k++) acc += PHASES[k].dur;
        store.set({ t: acc + PHASES[i].dur }); // jump to the END of that step
        setPlay(false); syncScrub(); apply();
      };
      return row;
    }),
  ]);

  const leftContent = el('div', {}, [stepsList]);

  // ---- right panel: live readout ----
  const oPhase = el('div', { class: 'cf-phase', id: 'oPhase' }, 'Ready');
  const row = (label, id, suffix = '') => el('div', { class: 'cf-row' }, [
    el('span', {}, label),
    el('b', {}, [el('span', { id }, '–'), suffix ? document.createTextNode(' ' + suffix) : null]),
  ]);
  const rightContent = el('div', {}, [
    el('h2', {}, 'Current step'),
    oPhase,
    row('Seat height', 'oSeat', 'mm'),
    row('Surface height', 'oBed', 'mm'),
    row('Height difference', 'oDiff', 'mm'),
    row('Lateral travel', 'oExt', '/ 420 mm'),
    row('Armrest', 'oArm'),
    row('Seat over surface', 'oLap'),
    el('div', { id: 'msgs' }),
  ]);

  // ---- bottom bar: play/reset/scrub ----
  const playBtn = el('button', { class: 'cf-btn', id: 'bPlay' }, '▶ Play');
  playBtn.onclick = () => { if (store.get().t >= TOTAL - 0.01) store.set({ t: 0 }); setPlay(!store.get().playing); };
  const resetBtn = el('button', { class: 'cf-btn', id: 'bReset', style: 'min-width:62px' }, 'Reset');
  resetBtn.onclick = () => { store.set({ t: 0 }); setPlay(false); syncScrub(); apply(); };
  const scrub = el('input', { type: 'range', class: 'cf-scrub', id: 'scrub', min: '0', max: '1000', value: '0' });
  scrub.oninput = () => { store.set({ t: (+scrub.value / 1000) * TOTAL }); setPlay(false); apply(); syncScrub(); };
  const tlbl = el('div', { class: 'cf-tlbl', id: 'tlbl' }, '0.0s');

  const barContent = el('div', { class: 'cf-panel cf-bar cf-chrome' }, [playBtn, resetBtn, scrub, tlbl]);

  return { leftContent, rightContent, barContent };
}
