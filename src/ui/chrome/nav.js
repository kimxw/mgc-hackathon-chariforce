import { el } from '../dom.js';
import { registerPad } from '../../engine/panelRegistry.js';

const LINKS = [
  ['Explore', '#sec-features'],
  ['Build', '#sec-phase1'],
  ['Purchase', '#sec-purchase'],
];

export function buildNav() {
  const nav = el('nav', { id: 'site-nav', class: 'cf-chrome' }, [
    el('a', { class: 'nav-logo', href: '#sec-hero' }, 'AxionCare'),
    el('div', { class: 'nav-links' }, LINKS.map(([label, href]) => el('a', { href }, label))),
    el('a', { class: 'nav-cta', href: '#sec-phase1' }, 'Build your chair'),
  ]);
  registerPad(nav);
  return nav;
}
