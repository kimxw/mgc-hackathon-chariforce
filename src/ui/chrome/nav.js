import { el } from '../dom.js';
import { registerPad } from '../../engine/panelRegistry.js';

const LINKS = [
  ['Explore', '#sec-features'],
  ['Build', '#sec-phase1'],
  ['Why we started', '#sec-why'],
  ['Purchase', '#sec-purchase'],
];

const MENU_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

export function buildNav() {
  const links = el('div', { class: 'nav-links', id: 'nav-links' }, LINKS.map(([label, href]) => el('a', { href }, label)));

  // Below 760px (nav.css) the link row is replaced by this toggle, which
  // reveals the SAME links as a dropdown rather than just hiding them with
  // no replacement — hidden-with-no-alternative was the actual mobile bug.
  const toggle = el('button', {
    class: 'nav-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav-links', 'aria-label': 'Menu', html: MENU_ICON,
  });
  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? CLOSE_ICON : MENU_ICON;
  };
  toggle.onclick = () => setOpen(!links.classList.contains('open'));
  // clicking a link, clicking outside, or Escape all close it — otherwise
  // it's left open over the page after navigating, or trapped open forever
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !e.target.closest('#site-nav')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  const nav = el('nav', { id: 'site-nav', class: 'cf-chrome' }, [
    el('a', { class: 'nav-logo', href: '/' }, 'AxionCare'),
    links,
    toggle,
  ]);
  registerPad(nav);
  return nav;
}
