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
      el('picture', {}, [
        // the desktop crop is a wide landscape composition (wordmark
        // spanning full width, chair off to the side) — object-fit:cover
        // would crop it awkwardly on a narrower frame, so up through
        // tablet width (1024px covers iPad landscape too) this swaps to a
        // shot composed for a tighter frame instead (wordmark centered
        // above the chair). Only one of the two ever downloads — the
        // browser picks before fetching, not after.
        el('source', { media: '(max-width:1024px)', srcset: '/img/hero/cover-mobile.png' }),
        el('img', { src: '/img/hero/cover.png', alt: 'Chair Force wordmark behind a photo of the wheelchair, with the Axion Care sub-brand' }),
      ]),
      el('div', { class: 'hero-cover-cue' }, [
        el('span', { class: 'hero-cover-cue-chev', html: CHEVRON }),
        el('span', {}, 'Explore more'),
      ]),
    ]),
  ]);
}
