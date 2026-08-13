// Price deltas, in SGD, from Downloads/index.html's own pricing table —
// mapped only where a mechanism-demo option has a defensible correspondence
// to one of Downloads' priced axes (see the plan's content-mapping table).
// Options with NO Downloads analog (cup, tray) are shown as "Included"
// rather than assigned an invented number. Carries Downloads' own
// disclaimer forward rather than presenting these as final costs.
export const BASE_PRICE = 1000; // Downloads' BASE_PRICE — chassis incl. the transfer mechanism
export const SUBSIDY_RATE = 0.9; // Downloads' SUBSIDY_RATE — SMF funds up to 90%

const PRICE_TABLE = {
  wheel: { standard: 0, terrain: 80, powered: 950 },
  seat: { standard: 0, wide: 150, contour: 80 },
  back: { standard: 0, high: 85, recline: 180 },
  acc: { cup: null, umbrella: 60, storage: 35, tray: null, ivpole: null },
};

export function priceOf(axis, id) {
  const v = PRICE_TABLE[axis]?.[id];
  return v === undefined ? 0 : v;
}

export function priceLineItems(cfg) {
  const items = [];
  const add = (axis, id, label) => {
    if (id === 'standard') return;
    const price = priceOf(axis, id);
    items.push({ label, price }); // price === null means "Included, not separately costed"
  };
  add('wheel', cfg.wheel, cfg.wheel === 'terrain' ? 'All-terrain wheels' : 'Powered hub wheels');
  add('seat', cfg.seat, cfg.seat === 'wide' ? 'Wide seat' : 'Contoured seat');
  add('back', cfg.back, cfg.back === 'high' ? 'High back + headrest' : 'Reclining backrest');
  Object.entries(cfg.acc).forEach(([id, on]) => {
    if (!on) return;
    const labels = {
      cup: 'Cup holder', umbrella: 'Umbrella mount', storage: 'Rear storage bag', tray: 'Tray table',
      ivpole: 'IV pole & oxygen holder',
    };
    items.push({ label: labels[id], price: priceOf('acc', id) });
  });
  return items;
}

export function totalPrice(cfg) {
  const items = priceLineItems(cfg);
  return BASE_PRICE + items.reduce((sum, i) => sum + (i.price || 0), 0);
}

export function moduleCount(cfg) {
  let n = 0;
  if (cfg.wheel !== 'standard') n++;
  if (cfg.seat !== 'standard') n++;
  if (cfg.back !== 'standard') n++;
  n += Object.values(cfg.acc).filter(Boolean).length;
  return n;
}
