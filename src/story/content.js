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
    personas: siteContent.hero.personas,
    personaLede: "don't have much in common medically: cerebral palsy, spinal muscular atrophy, a cancer diagnosis. What they share is the same daily risk: getting from the chair to the bed, and back, without a fall.",
    // split around the two figures so main.js can render them large/bold
    // inline, instead of them getting lost in a run of body-size prose
    statLine: {
      num1: siteContent.problem.stats[0].big,
      mid: ' times a day, someone is lifted, slid, or hoisted by another person who was never trained to do it safely;',
      num2: siteContent.problem.stats[2].big,
      after: " of family caregivers haven't been.",
    },
    fallShort: siteContent.problem.fallShort,
    closing: siteContent.innovation.body,
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
