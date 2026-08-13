// Procedurally generated (canvas) surface-detail maps — no external image
// assets, so nothing to fetch/vendor. Used as bumpMap so the existing
// box/cylinder geometry catches light like real fabric/rubber/brushed metal
// instead of reading as flat-shaded blocks.
const THREE = window.THREE;

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}
function repeatTex(c, repeat) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

// Woven upholstery: two crossing diagonal ridge sets (basket weave).
export const fabricBump = (() => {
  const c = canvas(64), ctx = c.getContext('2d');
  ctx.fillStyle = '#888'; ctx.fillRect(0, 0, 64, 64);
  ctx.lineWidth = 2;
  for (let i = -64; i < 128; i += 6) {
    ctx.strokeStyle = '#aaa';
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 64, 64); ctx.stroke();
    ctx.strokeStyle = '#555';
    ctx.beginPath(); ctx.moveTo(i, 64); ctx.lineTo(i + 64, 0); ctx.stroke();
  }
  return repeatTex(c, 14);
})();

// Rubber: fine speckle grain + coarse diagonal tread grooves.
export const treadBump = (() => {
  const c = canvas(64), ctx = c.getContext('2d');
  ctx.fillStyle = '#333'; ctx.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 900; i++) {
    const v = Math.round(30 + Math.random() * 50);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(Math.random() * 64, Math.random() * 64, 1.5, 1.5);
  }
  ctx.strokeStyle = '#111'; ctx.lineWidth = 4;
  for (let i = -64; i < 128; i += 12) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 64, 64); ctx.stroke(); }
  return repeatTex(c, 6);
})();

// Brushed metal: fine horizontal noise streaks.
export const brushedBump = (() => {
  const c = canvas(64), ctx = c.getContext('2d');
  ctx.fillStyle = '#999'; ctx.fillRect(0, 0, 64, 64);
  for (let y = 0; y < 64; y++) {
    const v = Math.round(130 + Math.random() * 60);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, 64, 1);
  }
  return repeatTex(c, 8);
})();

// Fine graph-paper grid used as the 3D scene's own background (scene.js),
// not a DOM overlay — a DOM grid painted over the canvas would draw its
// lines across the chair itself (DOM sits above the canvas, z-index-wise),
// where this composites correctly behind the mesh via the normal depth
// buffer. It also doesn't pan with the orbit camera or the page scroll:
// three.js draws a plain (non-equirect) Texture background as a static
// full-screen image, unlike scene.environment's direction-sampled sphere.
export function buildGridTexture() {
  const c = canvas(256), ctx = c.getContext('2d');
  ctx.fillStyle = '#f7f7f5'; ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#e2e0da'; ctx.lineWidth = 1;
  for (let i = 0; i <= 256; i += 32) {
    ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i + 0.5); ctx.lineTo(256, i + 0.5); ctx.stroke();
  }
  return repeatTex(c, 6);
}

// Equirectangular "studio" gradient used to seed a PMREM environment — gives
// metal/glossy parts a believable reflection without a real HDRI file.
// Kept DARK overall (close to the scene background): scene.environment feeds
// every material's diffuse ambient too, not just specular, so a bright/pale
// map here washes out flat-color materials like the black frame — the studio
// look should come from a couple of small, modestly-bright softbox patches
// for chrome to catch, not from lighting the whole sphere.
export function buildEnvEquirect() {
  const c = canvas(1); c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.00, '#0c0e12');
  g.addColorStop(0.30, '#14171d');
  g.addColorStop(0.48, '#282d36');
  g.addColorStop(0.52, '#20242b');
  g.addColorStop(0.75, '#12141a');
  g.addColorStop(1.00, '#08090b');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = 'rgba(196,206,222,.5)';
  ctx.fillRect(66, 100, 56, 26);
  ctx.fillRect(366, 104, 56, 22);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}
