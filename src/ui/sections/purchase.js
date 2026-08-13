import { el, section } from '../dom.js';
import { content } from '../../content.js';

export function buildPurchase() {
  const c = content.purchase;

  const emailInput = el('input', { type: 'email', placeholder: 'you@email.com', required: true });
  const submitBtn = el('button', { class: 'btn btn-primary', type: 'submit' }, 'Book my consultation');
  const form = el('form', { class: 'quote-form' }, [emailInput, submitBtn]);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Booked: we’ll be in touch to confirm a time';
    submitBtn.disabled = true;
  });

  return section('sec-purchase', '', [
    el('div', { class: 'purchase-grid' }, [
      el('div', {}, [
        el('span', { class: 'eyebrow' }, c.eyebrow),
        el('h2', { style: 'font-size:var(--fs-h2);margin-bottom:14px' }, c.h2),
        el('p', { style: 'color:var(--txt-dim);font-size:15px;max-width:48ch' }, c.body),
        form,
        el('p', { class: 'fine-print' }, c.formFinePrint),
        el('div', { class: 'partners' }, c.partners.map((p) => el('span', { class: 'partner-pill' }, p))),
      ]),
    ]),
    el('div', { class: 'footer-brand' }, c.footer),
    el('div', { class: 'footer-note' }, c.footerNote),
  ]);
}
