import { el } from '../../dom.js';

// Renders a list of [id, name, desc] options as visual swatch cards —
// single-select (radio-like, `group` in store.cfg) or multi-select
// (checkbox-like, store.cfg.acc). Shared by Phase 2 (attachments) and
// Phase 3 (wheel/seat/backrest).
export function renderOptionList({ list, isSelected, onSelect }) {
  const host = el('div', {});
  function render() {
    host.innerHTML = '';
    list.forEach(([id, name, desc]) => {
      const on = isSelected(id);
      const opt = el('div', { class: 'cf-opt' + (on ? ' on' : '') }, [
        el('div', { class: 'cf-dot' }),
        el('div', {}, [el('div', { class: 'n' }, name), el('div', { class: 's' }, desc)]),
      ]);
      opt.onclick = () => { onSelect(id); render(); };
      host.appendChild(opt);
    });
  }
  render();
  return host;
}

// Coming-soon (unmodeled) items — visually distinct, inert.
export function renderComingSoonList(items) {
  return el('div', {}, items.map((it) => el('div', { class: 'cf-opt disabled' }, [
    el('div', { class: 'cf-dot' }),
    el('div', {}, [
      el('div', { class: 'n' }, [it.name, ' ', el('span', { class: 'cf-badge' }, 'Coming soon')]),
      el('div', { class: 's' }, it.desc),
    ]),
  ])));
}
