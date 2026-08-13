export const $ = (id) => document.getElementById(id);

export function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null) e.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === undefined || c === null) return;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return e;
}

export function section(id, className, children) {
  return el('section', { id, class: `section ${className || ''}`.trim() }, [
    el('div', { class: 'scrim' }),
    el('div', { class: 'container' }, children),
  ]);
}
