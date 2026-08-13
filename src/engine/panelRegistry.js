// Replaces the old panelPad()'s hardcoded #ui/#out/#cfg/#bar lookups. Any
// overlay element that should reserve viewport space from the camera's
// auto-fit framing registers itself here. Contribution per edge is derived
// from the element's ACTUAL current bounding rect (is it touching the left
// edge? the bottom edge?) rather than a label fixed at registration time —
// so the same registration keeps working correctly when a mobile breakpoint
// repositions a panel from a side column to a bottom-stacked sheet, with no
// JS-side breakpoint awareness needed.
const pads = new Set();
// px — how close to a viewport edge counts as "touching" it. Must clear the
// widest side margin any registered panel actually sits at: panels align to
// --gutter (styles/tokens.css), which clamps up to 64px on desktop — a panel
// sitting exactly at that margin must still register as a real side panel,
// or it silently falls through to being treated as a bottom/top bar instead
// (see the sideOnly comment below for what that breaks).
const EDGE_THRESHOLD = 80;

export function registerPad(el) {
  pads.add(el);
}
export function unregisterPad(el) {
  pads.delete(el);
}

function visibleRect(el) {
  if (!el.isConnected) return null;
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return null;
  const r = el.getBoundingClientRect();
  return r.width > 2 && r.height > 2 ? r : null;
}

export function computePad() {
  let l = 16, r = 16, b = 40, t = 16;
  for (const el of pads) {
    const rect = visibleRect(el);
    if (!rect) continue;
    const touchesLeft = rect.left <= EDGE_THRESHOLD;
    const touchesRight = rect.right >= innerWidth - EDGE_THRESHOLD;
    // a panel touching BOTH left and right (a full-width bottom sheet, e.g.
    // on the mobile breakpoint) reserves bottom space only — it doesn't
    // block the sides the way a narrow side column does
    if (touchesLeft && !touchesRight) l = Math.max(l, rect.right + 18);
    if (touchesRight && !touchesLeft) r = Math.max(r, innerWidth - rect.left + 18);
    // a panel that's ALSO claimed as a side column (touches exactly one of
    // left/right) must not additionally reserve top/bottom space just
    // because it happens to be tall enough to reach near that edge — the
    // pad model is a single rectangle, so a narrow-but-tall side panel
    // reading "touches bottom" would otherwise blow up `b` to nearly the
    // full viewport height and squeeze the fit box into a sliver up top.
    // Real bottom/top bars are the ones that DON'T also own a side.
    const sideOnly = touchesLeft !== touchesRight;
    if (!sideOnly && rect.bottom >= innerHeight - EDGE_THRESHOLD) b = Math.max(b, innerHeight - rect.top + 16);
    if (!sideOnly && rect.top <= EDGE_THRESHOLD) t = Math.max(t, rect.bottom + 16);
  }
  const cap = innerWidth * 0.62;
  if (l + r > cap) { const k = cap / (l + r); l *= k; r *= k; }
  return { l, r, b, t };
}
