import { el } from '../dom.js';
import { content } from '../../content.js';
import { store } from '../../config/store.js';
import { priceLineItems, totalPrice, BASE_PRICE, SUBSIDY_RATE } from '../../config/pricing.js';
import { CFG } from '../../config/options.js';

function labelFor(axis, id) {
  const row = CFG[axis].find(([rid]) => rid === id);
  return row ? row[1] : id;
}

// Returns the inner "chair you designed" column only — no <section>
// wrapper of its own, since it's now the left half of one combined
// section with buildPurchaseColumn() (ui/sections/summaryPurchase.js).
export function buildSummaryColumn() {
  const c = content.summary;
  const list = el('div', { class: 'summary-list' });
  const total = el('div', { class: 'summary-total' });

  function render() {
    const cfg = store.get().cfg;
    list.innerHTML = '';
    list.appendChild(el('div', { class: 'summary-row' }, [
      el('span', { class: 'label' }, 'Base chassis (incl. transfer mechanism)'),
      el('span', { class: 'price' }, `S$${BASE_PRICE.toLocaleString()}`),
    ]));
    list.appendChild(el('div', { class: 'summary-row' }, [
      el('span', { class: 'label' }, 'Wheels'),
      el('span', {}, labelFor('wheel', cfg.wheel)),
    ]));
    list.appendChild(el('div', { class: 'summary-row' }, [
      el('span', { class: 'label' }, 'Seat'),
      el('span', {}, labelFor('seat', cfg.seat)),
    ]));
    list.appendChild(el('div', { class: 'summary-row' }, [
      el('span', { class: 'label' }, 'Backrest'),
      el('span', {}, labelFor('back', cfg.back)),
    ]));
    const items = priceLineItems(cfg);
    items.forEach((it) => {
      list.appendChild(el('div', { class: 'summary-row' }, [
        el('span', { class: 'label' }, it.label),
        el('span', { class: 'price' }, it.price === null ? 'Included' : `+S$${it.price}`),
      ]));
    });
    total.innerHTML = '';
    total.appendChild(el('span', {}, 'Estimated total'));
    total.appendChild(el('span', {}, `S$${totalPrice(cfg).toLocaleString()}`));
  }
  render();
  store.subscribe(render);

  // subsidy estimate — sits above the CTA here rather than further down on
  // the Purchase page, so the discounted price is visible right where the
  // person is already looking at their configured total
  const cs = content.purchase.subsidy;
  const subsidyAmount = el('div', { class: 'subsidy-amount' });
  const subsidyList = el('span', { class: 'subsidy-list' });
  function renderSubsidy() {
    const total = totalPrice(store.get().cfg);
    subsidyAmount.textContent = `S$${Math.round(total * (1 - SUBSIDY_RATE)).toLocaleString()}`;
    subsidyList.textContent = `S$${total.toLocaleString()}`;
  }
  renderSubsidy();
  store.subscribe(renderSubsidy);
  const subsidyBox = el('div', { class: 'subsidy-box' }, [
    el('div', { class: 'subsidy-label' }, cs.label),
    el('div', {}, [subsidyAmount, subsidyList]),
    el('div', { class: 'subsidy-sub' }, cs.note),
    el('div', { class: 'subsidy-fine' }, [
      el('p', { style: 'margin-bottom:8px' }, [el('strong', {}, 'Who qualifies: '), cs.eligibility]),
      el('p', {}, cs.caveat),
    ]),
  ]);

  // Stacked (price list, then subsidy box), not the old side-by-side
  // summary-grid — that split was sized for a full-width section; this
  // column is now only half that width, next to buildPurchaseColumn().
  return el('div', { class: 'summary-col' }, [
    el('span', { class: 'eyebrow' }, c.eyebrow),
    el('h2', { style: 'font-size:var(--fs-h2);margin-bottom:32px' }, c.h2),
    list,
    total,
    subsidyBox,
  ]);
}
