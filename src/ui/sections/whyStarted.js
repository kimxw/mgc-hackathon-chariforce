import { el, section } from '../dom.js';
import { content } from '../../content.js';

// Split hero: video on the left, mission + stats on the right — the same
// layout formerly on its own story.html page, now folded into the main
// scroll (right before Purchase) instead of a separate page.
export function buildWhyStarted() {
  const w = content.why;

  // autoplay requires muted (browser policy) — controls stay on so anyone
  // who wants sound can unmute manually. Attributes alone don't reliably
  // autoplay a video built via createElement, so .play() is called
  // explicitly too (same pattern as the bento videos elsewhere).
  const video = el('video', { src: w.video, controls: '', autoplay: '', muted: '', loop: '', playsinline: '', preload: 'auto' });
  video.muted = true;
  video.play().catch(() => {});
  const videoWrap = el('div', { class: 'why-video-wrap' }, [video]);

  const whyCol = el('div', { class: 'why-col' }, [
    el('span', { class: 'eyebrow reveal' }, w.eyebrow),
    el('h2', { class: 'why-h1 reveal' }, w.h1),

    el('div', { class: 'why-stats reveal' }, content.problem.stats.filter((s, i) => i === 0 || i === 2).map((s) => el('div', { class: 'why-stat' }, [
      el('span', { class: 'why-stat-big' }, s.big),
      el('span', { class: 'why-stat-label' }, s.label),
    ]))),
  ]);

  // Match the video card's height to the text column's actual rendered
  // height (font sizes are fluid, so this can't be a fixed CSS value),
  // then let aspect-ratio (sections.css) drive the video's width from
  // there — this is what keeps both columns the same height WITHOUT
  // stretching the video (stretch + object-fit:cover is what crops it).
  const syncVideoHeight = () => { videoWrap.style.height = `${whyCol.offsetHeight}px`; };
  new ResizeObserver(syncVideoHeight).observe(whyCol);
  syncVideoHeight();

  return section('sec-why', 'why-hero', [videoWrap, whyCol]);
}
