import { el, section } from '../dom.js';

// Splash card shown before the hero — a real in-flow section (not fixed
// chrome) so scrolling just naturally carries it up off-screen to reveal
// the hero underneath, the same way scrolling past any other section
// works. A JS-driven opacity crossfade was tried first and didn't read
// right; a plain scroll-past is simpler and actually behaves as expected.
const CHEVRON = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function buildHeroCover() {
  return section('sec-hero-cover', '', [
    el('div', { class: 'hero-cover' }, [
      el('img', { src: '/img/hero/cover.jpg', alt: 'Chair Force wheelchair displayed with its modular accessories — umbrella mount, cup holder, all-terrain wheels, storage case' }),
      el('div', { class: 'hero-cover-cue' }, [
        el('span', { class: 'hero-cover-cue-chev', html: CHEVRON }),
        el('span', {}, 'Explore more'),
      ]),
    ]),
  ]);
}
