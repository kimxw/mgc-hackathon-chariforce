import { el } from '../../dom.js';
import { store } from '../../../config/store.js';
import { CFG } from '../../../config/options.js';
import { buildWheels } from '../../../engine/wheels.js';
import { buildSeatParts } from '../../../engine/seat.js';
import { apply } from '../../../engine/apply.js';
import { renderOptionList } from './optionList.js';
import { moduleCount } from '../../../config/pricing.js';

export function buildPhase3() {

  const wheelList = renderOptionList({
    list: CFG.wheel,
    isSelected: (id) => store.get().cfg.wheel === id,
    onSelect: (id) => { store.get().cfg.wheel = id; buildWheels(); apply(); syncCount(); },
  });
  const seatList = renderOptionList({
    list: CFG.seat,
    isSelected: (id) => store.get().cfg.seat === id,
    onSelect: (id) => { store.get().cfg.seat = id; buildSeatParts(); apply(); syncCount(); },
  });

  const recWrap = el('div', { style: 'display:none;margin-top:9px' });
  const recVal = el('b', {}, '22°');
  const recSlider = el('input', { type: 'range', min: '0', max: '32', value: '22' });
  recSlider.oninput = () => {
    const v = +recSlider.value;
    recVal.textContent = v + '°';
    store.set({ recTarget: v, recA: v });
    apply();
  };
  recWrap.appendChild(el('div', { class: 'cf-lbl' }, [document.createTextNode('Recline angle '), recVal]));
  recWrap.appendChild(recSlider);

  const backList = renderOptionList({
    list: CFG.back,
    isSelected: (id) => store.get().cfg.back === id,
    onSelect: (id) => {
      store.get().cfg.back = id;
      store.set({ recTarget: id === 'recline' ? +recSlider.value : 0 });
      if (id !== 'recline') store.set({ recA: 0 });
      recWrap.style.display = id === 'recline' ? 'block' : 'none';
      buildSeatParts(); apply(); syncCount();
    },
  });
  recWrap.style.display = store.get().cfg.back === 'recline' ? 'block' : 'none';

  const countEl = el('b', {}, '0');
  function syncCount() { countEl.textContent = String(moduleCount(store.get().cfg)); }
  syncCount();

  const leftContent = el('div', {}, [
    el('div', { class: 'cf-grp first' }, [el('h2', {}, 'Wheels'), wheelList]),
    el('div', { class: 'cf-grp' }, [el('h2', {}, 'Seat'), seatList]),
    el('div', { class: 'cf-grp' }, [el('h2', {}, 'Backrest'), backList, recWrap]),
  ]);

  const rightContent = el('div', {}, [
    el('h2', {}, 'Build your own wheelchair'),
    el('p', { class: 'cf-sub' }, 'Same chassis. Swap only what the user needs.'),
    el('div', { class: 'cf-fitted', style: 'margin-top:0;padding-top:0;border-top:0' }, [
      'Modules fitted beyond base: ', countEl,
    ]),
  ]);

  return { leftContent, rightContent, refresh: syncCount };
}
