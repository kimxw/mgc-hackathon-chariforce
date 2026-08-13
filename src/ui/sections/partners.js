import { el, section } from '../dom.js';

// Static partner-logo row, sandwiched between the cover splash and the
// real hero (a scrolling marquee version was tried first, but with only 3
// distinct logos it didn't earn the motion — static reads cleaner). Real
// logo files (fetched from each org's own site, see public/img/partners/)
// for SingHealth and Enabling Village. SG Enable's own site only serves an
// "ENABLE" wordmark image with no "SG" in it (verified by pixel-inspecting
// the fetched PNG — the "SG" isn't a missing-alt-text placeholder, it's
// genuinely not drawn), so that one's a styled text wordmark in their
// brand green instead of a broken-looking logo.
const LOGOS = [
  { name: 'SingHealth', img: '/img/partners/singhealth.png' },
  { name: 'SG Enable', text: 'SG Enable' },
  { name: 'Enabling Village', img: '/img/partners/enabling-village.png' },
];

function buildLogo({ name, img, text }) {
  return el('div', { class: 'partner-logo' }, [
    img
      ? el('img', { src: img, alt: name, loading: 'lazy' })
      : el('span', { class: 'partner-logo-text' }, text),
  ]);
}

export function buildPartners() {
  return section('sec-partners', '', [
    el('span', { class: 'eyebrow partner-label' }, 'Our partners'),
    el('div', { class: 'partner-row' }, LOGOS.map(buildLogo)),
  ]);
}
