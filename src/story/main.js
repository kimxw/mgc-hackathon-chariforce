import { el, section } from '../ui/dom.js';
import { buildNav } from '../ui/chrome/nav.js';
import { story } from './content.js';

function buildWhy() {
  const w = story.why;
  const personaNames = w.personas.map((p) => p.name).join(', ').replace(/, ([^,]*)$/, ' and $1');

  return section('sec-why', 'story-why', [
    el('span', { class: 'eyebrow reveal' }, w.eyebrow),
    el('h1', { class: 'story-h1 reveal' }, w.h1),

    el('div', { class: 'story-personas reveal' }, [
      ...w.personas.map((p) => el('div', { class: 'story-persona' }, [
        el('span', { class: 'story-persona-initial' }, p.initial),
        el('span', {}, [el('strong', {}, p.name), `: ${p.desc}`]),
      ])),
    ]),
    el('p', { class: 'story-lede reveal' }, [
      el('strong', {}, personaNames), ` ${w.personaLede}`,
    ]),

    el('p', { class: 'story-p story-stat-line reveal' }, [
      el('strong', { class: 'story-num' }, w.statLine.num1), w.statLine.mid,
      el('strong', { class: 'story-num' }, w.statLine.num2), w.statLine.after,
    ]),

    el('div', { class: 'story-fallshort reveal' }, w.fallShort.map((f) => el('div', { class: 'story-fallshort-item' }, [
      el('strong', {}, f.name), el('span', {}, f.desc),
    ]))),

    el('p', { class: 'story-closing reveal' }, w.closing),
  ]);
}

function mediaPlaceholder(item) {
  return el('div', { class: 'tl-media' }, [
    item.media === 'video'
      ? el('span', { class: 'tl-media-icon', html: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7Z" fill="currentColor"/></svg>' })
      : el('span', { class: 'tl-media-icon', html: '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/><path d="M4 16.5l5-4.5 4 3 3-2.5 4 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' }),
    el('span', { class: 'tl-media-alt' }, item.mediaAlt),
  ]);
}

function buildTimeline() {
  const t = story.timeline;
  return section('sec-timeline', 'story-timeline', [
    el('span', { class: 'eyebrow reveal' }, t.eyebrow),
    el('h2', { class: 'story-h2 reveal' }, t.h2),
    el('p', { class: 'story-lede2 reveal' }, t.lede),

    el('div', { class: 'tl-rail' }, t.milestones.map((m) => el('div', { class: 'tl-row reveal' }, [
      el('div', { class: 'tl-spine' }, [el('span', { class: 'tl-dot' })]),
      el('div', { class: 'tl-card' }, [
        mediaPlaceholder(m),
        el('div', { class: 'tl-body' }, [
          el('div', { class: 'tl-meta' }, [
            el('span', { class: 'tl-date' }, m.date),
            el('span', { class: 'tl-tag' }, m.tag),
          ]),
          el('h3', {}, m.title),
          el('p', { class: m.desc ? '' : 'tl-desc-placeholder' }, m.desc || 'Add the real story behind this one.'),
        ]),
      ]),
    ]))),
  ]);
}

function buildTestimonials() {
  const s = story.testimonials;
  return section('sec-testimonials', 'story-testimonials', [
    el('div', { class: 'testi-layout' }, [
      el('div', { class: 'testi-intro' }, [
        el('span', { class: 'eyebrow reveal' }, s.eyebrow),
        el('h2', { class: 'story-h2 reveal' }, s.h2),
        el('p', { class: 'story-lede2 reveal' }, s.lede),
      ]),

      el('div', { class: 'testi-list' }, s.cards.map((c) => el('div', { class: 'testi-card reveal' }, [
        el('div', { class: 'testi-photo', title: c.photoAlt }, [
          el('span', { class: 'testi-photo-icon', html: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" stroke="currentColor" stroke-width="1.6"/><path d="M4.8 19.2c1.4-3.4 4.1-5.1 7.2-5.1s5.8 1.7 7.2 5.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' }),
        ]),
        el('div', { class: 'testi-body' }, [
          el('div', { class: 'testi-who' }, [
            el('strong', {}, c.name || 'Add name'),
            c.role ? el('span', {}, c.role) : null,
          ]),
          el('p', { class: c.quote ? 'testi-quote' : 'testi-quote testi-quote-placeholder' }, c.quote || 'Add their testimonial here.'),
        ]),
      ]))),
    ]),
  ]);
}

const app = document.getElementById('app');
app.appendChild(buildNav());
app.appendChild(el('main', { id: 'story-main' }, [
  buildWhy(),
  buildTimeline(),
  buildTestimonials(),
]));

// Scroll reveal: fade + rise + unblur, same enter-once treatment for both
// the narrative paragraphs and the timeline rows so the two sections read
// as one language rather than two different techniques bolted together.
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    io.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach((elm) => io.observe(elm));
