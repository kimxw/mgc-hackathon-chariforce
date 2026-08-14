import { el, section } from '../dom.js';
import { buildSummaryColumn } from './summary.js';
import { buildPurchaseColumn, buildFooter } from './purchase.js';

// "This is the chair you designed" and "Book your consultation" as one
// combined section — the designed chair on the left, consultation form on
// the right, instead of two separate stacked sections — with the site
// footer full-width underneath both.
export function buildSummaryPurchase() {
  return section('sec-summary', 'summary-purchase', [
    el('div', { class: 'summary-purchase-grid' }, [
      buildSummaryColumn(),
      buildPurchaseColumn(),
    ]),
    ...buildFooter(),
  ]);
}
