// Copy for story.html. Every figure in `why` is pulled straight from the
// main site's content.js — nothing re-typed, nothing invented.
import { content as siteContent } from '../content.js';

export const story = {
  why: {
    eyebrow: 'Why we started',
    h1: "A transfer shouldn't be the most dangerous part of someone's day.",
    stats: [
      { big: siteContent.problem.stats[0].big, label: 'transfers a day, by someone untrained to do it safely' },
      { big: siteContent.problem.stats[2].big, label: 'of family caregivers are among them' },
    ],
  },

  testimonials: {
    video: '/video/testimonials.mp4',
  },
};
