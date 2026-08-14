import { el } from '../dom.js';
import { content } from '../../content.js';

const ARROW_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Returns the inner "book your consultation" column only — no <section>
// wrapper of its own, since it's now the right half of one combined
// section with buildSummaryColumn() (ui/sections/summaryPurchase.js). Its
// own id (not the outer section's) so nav.js's '#sec-purchase' link still
// resolves to something real.
export function buildPurchaseColumn() {
  const c = content.purchase;

  const emailInput = el('input', { type: 'email', placeholder: 'you@email.com', required: true });
  const submitBtn = el('button', {
    class: 'btn btn-primary quote-submit', type: 'submit', 'aria-label': 'Book my consultation', html: ARROW_ICON,
  });
  const form = el('form', { class: 'quote-form' }, [emailInput, submitBtn]);
  const confirmMsg = el('p', { class: 'quote-confirm' }, []);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.innerHTML = CHECK_ICON;
    submitBtn.setAttribute('aria-label', 'Booked');
    submitBtn.disabled = true;
    emailInput.disabled = true;
    confirmMsg.textContent = 'Booked: we’ll be in touch to confirm a time.';
  });

  return el('div', { class: 'purchase-col', id: 'sec-purchase' }, [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h2', { style: 'font-size:var(--fs-h2);margin-bottom:14px' }, c.h2),
    el('p', { style: 'color:var(--txt-dim);font-size:15px' }, c.body),
    form,
    confirmMsg,
    el('p', { class: 'fine-print' }, c.formFinePrint),
    el('div', { class: 'partners' }, c.partners.map((p) => el('span', { class: 'partner-pill' }, p))),
  ]);
}

export function buildFooter() {
  const c = content.purchase;
  return [
    el('div', { class: 'footer-brand' }, c.footer),
    el('div', { class: 'footer-note' }, c.footerNote),
  ];
}
