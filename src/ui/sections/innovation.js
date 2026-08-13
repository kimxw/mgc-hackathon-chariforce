import { el, section } from '../dom.js';
import { content } from '../../content.js';

export function buildInnovation() {
  const c = content.innovation;
  return section('sec-innovation', 'section-tight', [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h2', {}, c.h2),
    el('p', {}, c.body),
  ]);
}
