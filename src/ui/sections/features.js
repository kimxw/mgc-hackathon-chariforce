import { el, section } from '../dom.js';
import { content } from '../../content.js';

export function buildFeatures() {
  const c = content.features;
  // Image is a placeholder path — nothing exists at /img/features/*.jpg yet
  // for items without a real photo. Until a real photo lands there, the alt
  // text is what actually renders in the broken-image box, so it doubles
  // as the content brief for that shot. `video: true` items instead play a
  // looping, muted, autoplaying clip from /img/features/{id}.mp4.
  const cards = c.items.map((it) => {
    const media = it.video
      ? el('video', { src: `/img/features/${it.id}.mp4`, autoplay: '', muted: '', loop: '', playsinline: '', 'aria-label': it.imgAlt })
      : el('img', { src: `/img/features/${it.id}.jpg`, alt: it.imgAlt, loading: 'lazy' });
    // Attributes alone don't reliably autoplay elements built via createElement,
    // so kick playback explicitly too (muted required or the browser rejects it).
    if (it.video) {
      media.muted = true;
      media.play().catch(() => {});
    }
    return el('div', { class: `bento-card bento-${it.id}` }, [
      el('div', { class: 'bento-media' }, [media]),
      el('div', { class: 'bento-body' }, [
        el('h4', {}, it.title),
        el('p', {}, it.desc),
      ]),
    ]);
  });

  return section('sec-features', '', [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h2', { style: 'font-size:var(--fs-h2);margin-bottom:36px' }, c.h2),
    el('div', { class: 'bento-grid' }, [
      el('div', { class: 'bento-row bento-row-top' }, cards.slice(0, 2)),
      el('div', { class: 'bento-row bento-row-bottom' }, cards.slice(2)),
    ]),
  ]);
}
