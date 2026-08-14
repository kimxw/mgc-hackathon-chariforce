// Copy for story.html. Every figure/persona in `why` is pulled straight
// from the main site's content.js — nothing re-typed, nothing invented.
// The `timeline` below is built ONLY from this project's actual file
// history (names/dates/versions on disk) — no claims about what any
// recording shows or why a version changed, since that isn't something
// this file can actually know. Fill in `desc` per milestone with the real
// story once you're writing it; until then it shows an honest placeholder.
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

  timeline: {
    eyebrow: 'How we built it',
    h2: 'The R&D process, in order.',
    lede: "Every stage below is a real file in this project's history, dated as it actually happened. Photos, video, and the real story behind each one go in as we add them.",
    milestones: [
      {
        date: '19 Jul',
        tag: 'Earliest file',
        title: 'Screen recording',
        desc: '',
        media: 'video',
        mediaAlt: 'Screen recording from 19 Jul',
      },
      {
        date: '7 Aug',
        tag: 'Reference model',
        title: 'Baseline wheelchair model',
        desc: '',
        media: 'photo',
        mediaAlt: 'Reference wheelchair model, exported 7 Aug',
      },
      {
        date: '9 Aug',
        tag: 'v2',
        title: 'wheelchair_v2',
        desc: '',
        media: 'video',
        mediaAlt: 'wheelchair_v2',
      },
      {
        date: '9 Aug',
        tag: 'v3',
        title: 'wheelchair_v3',
        desc: '',
        media: 'photo',
        mediaAlt: 'wheelchair_v3',
      },
      {
        date: '9 Aug',
        tag: 'Demo',
        title: 'Human transfer demonstration',
        desc: '',
        media: 'video',
        mediaAlt: 'Human transfer demonstration file',
      },
      {
        date: '9–13 Aug',
        tag: 'v4',
        title: 'wheelchair_v4, final chassis',
        desc: '',
        media: 'photo',
        mediaAlt: 'wheelchair_v4, the chassis this site runs on',
      },
    ],
  },

  // Real people, real photos to come — nothing here is a stand-in name or
  // an invented quote. Fill in name/role/quote per card once you have them;
  // until then each renders as an honest, clearly-marked placeholder.
  testimonials: {
    eyebrow: 'Tried and tested',
    h2: 'From the people who tried it.',
    lede: "Real feedback from the people who've actually sat in the chair, added here as we collect it.",
    cards: [
      { name: '', role: '', quote: '', photoAlt: 'Photo of tester 1, to add' },
      { name: '', role: '', quote: '', photoAlt: 'Photo of tester 2, to add' },
      { name: '', role: '', quote: '', photoAlt: 'Photo of tester 3, to add' },
    ],
  },
};
