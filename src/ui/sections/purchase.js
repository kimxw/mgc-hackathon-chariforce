import { el, section } from '../dom.js';
import { content } from '../../content.js';
import { LEADS_ENDPOINT } from '../../config/leads.js';
import posthog from '../../posthog.js';

const ARROW_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function buildPurchase() {
  const c = content.purchase;

  const emailInput = el('input', { type: 'email', placeholder: 'you@email.com', required: true });
  const submitBtn = el('button', {
    class: 'btn btn-primary quote-submit', type: 'submit', 'aria-label': 'Book my consultation', html: ARROW_ICON,
  });
  const form = el('form', { class: 'quote-form' }, [emailInput, submitBtn]);
  const confirmMsg = el('p', { class: 'quote-confirm' }, []);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    emailInput.disabled = true;
    try {
      if (!LEADS_ENDPOINT) {
        // config/leads.js hasn't been given a deployed Apps Script URL yet
        // — don't POST to '' (silently fetches this same page), just warn.
        console.warn('LEADS_ENDPOINT is not set (src/config/leads.js) — booking was not recorded.');
      } else {
        // mode:'no-cors' — the Apps Script web app doesn't send CORS headers
        // back, and we don't need to read the response, just fire it.
        // Content-Type text/plain (not application/json) keeps this a CORS
        // "simple request" — application/json would trigger a preflight
        // OPTIONS request Apps Script web apps don't handle, and the POST
        // would silently never arrive.
        await fetch(LEADS_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ email: emailInput.value, ts: new Date().toISOString() }),
        });
      }
      // email is captured here deliberately: this is a lead form the
      // visitor submitted specifically to be contacted, not incidental
      // behavioral tracking, so it belongs on the event even though it
      // isn't wired through posthog.identify() (no auth/account system to
      // identify against).
      posthog.capture('consultation_requested', { email: emailInput.value });
      submitBtn.innerHTML = CHECK_ICON;
      submitBtn.setAttribute('aria-label', 'Booked');
      confirmMsg.textContent = 'Booked: we’ll be in touch to confirm a time.';
    } catch {
      // network-level failure only — mode:'no-cors' makes the response
      // opaque, so a bad/misconfigured endpoint can't be distinguished from
      // success here; only being offline etc. lands in this branch.
      submitBtn.disabled = false;
      emailInput.disabled = false;
      confirmMsg.textContent = 'Something went wrong — please try again.';
    }
  });

  return section('sec-purchase', '', [
    el('div', { class: 'purchase-grid' }, [
      el('div', {}, [
        el('span', { class: 'eyebrow' }, c.eyebrow),
        el('h2', { style: 'font-size:var(--fs-h2);margin-bottom:14px' }, c.h2),
        el('p', { style: 'color:var(--txt-dim);font-size:15px;max-width:48ch' }, c.body),
        form,
        confirmMsg,
        el('p', { class: 'fine-print' }, c.formFinePrint),
        el('div', { class: 'partners' }, c.partners.map((p) => el('span', { class: 'partner-pill' }, p))),
      ]),
    ]),
    el('div', { class: 'footer-brand' }, c.footer),
    el('div', { class: 'footer-note' }, c.footerNote),
  ]);
}
