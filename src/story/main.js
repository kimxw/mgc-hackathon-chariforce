import { el, section } from '../ui/dom.js';
import { buildNav } from '../ui/chrome/nav.js';
import { story } from './content.js';

function buildVideo() {
  const s = story.testimonials;
  // autoplay requires muted (browser policy) — controls stay on so anyone
  // who wants sound can unmute manually. Attributes alone don't reliably
  // autoplay a video built via createElement, so .play() is called
  // explicitly too (same pattern as the homepage bento videos).
  const video = el('video', { src: s.video, controls: '', autoplay: '', muted: '', loop: '', playsinline: '', preload: 'auto' });
  video.muted = true;
  video.play().catch(() => {});
  return el('div', { class: 'testi-video-wrap' }, [video]);
}

function buildWhy() {
  const w = story.why;
  return el('div', { class: 'story-why-col' }, [
    el('span', { class: 'eyebrow reveal' }, w.eyebrow),
    el('h1', { class: 'story-h1 reveal' }, w.h1),

    el('div', { class: 'story-stats reveal' }, w.stats.map((s) => el('div', { class: 'story-stat' }, [
      el('span', { class: 'story-stat-big' }, s.big),
      el('span', { class: 'story-stat-label' }, s.label),
    ]))),
  ]);
}

const videoWrap = buildVideo();
const whyCol = buildWhy();

const app = document.getElementById('app');
app.appendChild(buildNav());
app.appendChild(el('main', { id: 'story-main' }, [
  section('sec-story-hero', 'story-hero', [videoWrap, whyCol]),
]));

// Match the video card's height to the text column's actual rendered
// height (font sizes are fluid, so this can't be a fixed CSS value), then
// let aspect-ratio (story.css) drive the video's width from there. The
// column itself is now wide enough (story.css: .container is edge-to-edge,
// matching the header's own margins, not capped at the page's normal
// content width) that hitting the matched height rarely needs the
// max-width safety cap to kick in and narrow it.
const syncVideoHeight = () => { videoWrap.style.height = `${whyCol.offsetHeight}px`; };
new ResizeObserver(syncVideoHeight).observe(whyCol);
syncVideoHeight();

// Scroll reveal: fade + rise + unblur, once, on first entry.
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    io.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((elm) => io.observe(elm));
