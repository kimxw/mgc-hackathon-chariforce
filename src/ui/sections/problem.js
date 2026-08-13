import { el, section } from '../dom.js';
import { content } from '../../content.js';

export function buildProblem() {
  const c = content.problem;
  return section('sec-problem', '', [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h2', { style: 'font-size:var(--fs-h2);max-width:20ch;margin-bottom:18px' }, c.h2),
    el('p', { style: 'font-size:var(--fs-lede);color:var(--txt-dim);max-width:60ch' }, c.lede),
    el('div', { class: 'stat-grid' }, c.stats.map((s) => el('div', { class: 'stat-card' }, [
      el('div', { class: 'big' }, s.big),
      el('p', {}, s.label),
    ]))),
    el('div', { class: 'fall-short' }, [
      el('h3', {}, 'What families usually try first'),
      el('div', { class: 'options-grid' }, c.fallShort.map((o, i) => el('div', { class: 'option-card' }, [
        el('span', { class: 'option-num' }, String(i + 1).padStart(2, '0')),
        el('h4', {}, o.name),
        el('p', {}, o.desc),
      ]))),
    ]),
  ]);
}
