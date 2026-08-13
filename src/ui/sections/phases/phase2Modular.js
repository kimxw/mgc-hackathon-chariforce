import { el } from '../../dom.js';
import { content } from '../../../content.js';
import { store } from '../../../config/store.js';
import { CFG } from '../../../config/options.js';
import { buildSeatParts } from '../../../engine/seat.js';
import { apply } from '../../../engine/apply.js';
import { renderOptionList, renderComingSoonList } from './optionList.js';
import { moduleCount } from '../../../config/pricing.js';

export function buildPhase2() {
  const c = content.phase2;

  const list = renderOptionList({
    list: CFG.acc,
    isSelected: (id) => store.get().cfg.acc[id],
    onSelect: (id) => {
      store.get().cfg.acc[id] = !store.get().cfg.acc[id];
      buildSeatParts(); apply(); syncCount();
    },
  });

  const countEl = el('b', {}, '0');
  function syncCount() { countEl.textContent = String(moduleCount(store.get().cfg)); }
  syncCount();

  const leftContent = el('div', {}, [
    el('div', { class: 'cf-grp first' }, [el('h2', {}, 'Attachments'), list]),
    el('div', { class: 'cf-grp' }, [
      el('h2', {}, 'Modules coming soon'),
      renderComingSoonList(c.comingSoon),
    ]),
  ]);

  const rightContent = el('div', {}, [
    el('h2', {}, 'Modules'),
    el('div', { class: 'cf-fitted', style: 'margin-top:0;padding-top:0;border-top:0' }, [
      'Modules fitted beyond base: ', countEl,
    ]),
    el('p', { class: 'cf-note' }, 'Chassis, lift column and transfer rails are identical in every configuration. Nothing here requires a new wheelchair.'),
  ]);

  return { leftContent, rightContent, refresh: syncCount };
}
