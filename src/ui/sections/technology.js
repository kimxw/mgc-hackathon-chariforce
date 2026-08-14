import { el, section } from '../dom.js';
import { content } from '../../content.js';
import { store } from '../../config/store.js';
import { setXray } from '../../engine/xray.js';
import { apply } from '../../engine/apply.js';
import posthog from '../../posthog.js';

export function buildTechnology() {
  const c = content.technology;
  const xrayBtn = el('button', { class: 'btn btn-outline xray-cta' }, 'Toggle X-ray view');
  const syncXrayLabel = () => {
    xrayBtn.textContent = store.get().xray ? 'Exit X-ray view' : 'Toggle X-ray view';
  };
  xrayBtn.addEventListener('click', () => {
    store.set({ xray: !store.get().xray });
    posthog.capture('xray_view_toggled', { enabled: store.get().xray });
    setXray(store.get().xray);
    apply();
    syncXrayLabel();
  });

  return section('sec-technology', '', [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h2', {}, c.h2),
    el('p', {}, c.body),
    el('div', { class: 'movements' }, c.movements.map((m, i) => el('div', { class: 'movement' }, [
      el('div', { class: 'idx' }, String(i + 1).padStart(2, '0')),
      el('div', {}, [el('h4', {}, m.title), el('p', {}, m.desc)]),
    ]))),
    xrayBtn,
  ]);
}
