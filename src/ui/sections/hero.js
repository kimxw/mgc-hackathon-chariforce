import { el, section } from '../dom.js';
import { content } from '../../content.js';

// Product-photo landing hero (the reference: bold headline + single CTA on
// the left, the product photo straight on the right, no card/frame around
// it), swapped in for the old fixed-panel-over-live-canvas layout. #sec-hero
// is opaque now (background:var(--bg) in sections.css) so this reads as its
// own flat page, not a panel floating over the 3D chair — the live chair
// still renders for every section below it.
export function buildHero() {
  const c = content.hero;

  const copy = el('div', { class: 'hero-copy' }, [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h1', { class: 'hero-brand' }, [document.createTextNode('Chair '), el('span', {}, 'Force')]),
    el('p', { class: 'hero-tagline' }, c.h1),
    el('p', { class: 'lede' }, c.lede),
    el('div', { class: 'hero-actions' }, [
      el('a', { class: 'btn btn-primary', href: '#sec-phase1' }, c.ctaPrimary),
    ]),
  ]);

  const visual = el('div', { class: 'hero-visual' }, [
    el('img', { class: 'hero-photo', src: '/img/hero/wheelchair.png', alt: 'Photo of the Chair Force wheelchair', loading: 'eager' }),
  ]);

  return section('sec-hero', '', [
    el('div', { class: 'hero-frame' }, [copy, visual]),
  ]);
}
