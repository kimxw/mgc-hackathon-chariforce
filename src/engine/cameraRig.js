import { clamp } from './constants.js';
import { store } from '../config/store.js';
import { scene, camera, renderer } from './scene.js';
import { chair } from './chassis.js';
import { bed } from './surface.js';
import { computePad } from './panelRegistry.js';

const THREE = window.THREE;

export const tgt = new THREE.Vector3(0.4, 0.6, 0.03);
const _box = new THREE.Box3(), _bb = new THREE.Box3(), _p = new THREE.Vector3();
let _corners = [], _radius = 1;

export function panelPad() {
  if (document.body.classList.contains('cine')) return { l: 20, r: 20, b: 20 };
  return computePad();
}

function computeBounds() {
  scene.updateMatrixWorld(true);
  _box.makeEmpty();
  const roots = store.get().phase === 1 ? [chair, bed] : [chair];
  roots.forEach((root) => root.traverseVisible((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    _bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);
    _box.union(_bb);
  }));
  if (_box.isEmpty()) _box.set(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 1, 1));
  const mi = _box.min, ma = _box.max;
  _box.getCenter(tgt);
  _radius = 0.5 * Math.hypot(ma.x - mi.x, ma.y - mi.y, ma.z - mi.z);
  _corners = [];
  for (const x of [mi.x, ma.x]) for (const y of [mi.y, ma.y]) for (const z of [mi.z, ma.z]) _corners.push(new THREE.Vector3(x, y, z));
}

function measure() {
  camera.updateMatrixWorld(true);
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  camera.updateProjectionMatrix();
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const c of _corners) {
    _p.copy(c).project(camera);
    if (!isFinite(_p.x) || !isFinite(_p.y)) continue;
    x0 = Math.min(x0, _p.x); x1 = Math.max(x1, _p.x);
    y0 = Math.min(y0, _p.y); y1 = Math.max(y1, _p.y);
  }
  if (x0 > x1) return null;
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, hx: (x1 - x0) / 2, hy: (y1 - y0) / 2 };
}

export function fitView() {
  computeBounds();
  const pad = panelPad();
  const wantX = (pad.l - pad.r) / innerWidth;
  const wantY = (pad.b - pad.t) / innerHeight;
  const limX = Math.max(0.25, (1 - (pad.l + pad.r) / innerWidth) * 0.92);
  const limY = Math.max(0.25, (1 - (pad.b + pad.t) / innerHeight) * 0.92);
  const tanV = Math.tan((camera.fov * Math.PI) / 360), tanH = tanV * camera.aspect;
  const cam = store.get().camera;
  cam.panX = 0; cam.panY = 0;
  cam.radius = Math.max(_radius * 1.3, _radius / Math.min(tanV, tanH));
  updCam();
  for (let i = 0; i < 14; i++) {
    const m = measure(); if (!m) break;
    const k = Math.max(m.hx / limX, m.hy / limY);
    const ox = m.cx - wantX, oy = m.cy - wantY;
    if (Math.abs(k - 1) < 0.005 && Math.abs(ox) < 0.005 && Math.abs(oy) < 0.005) break;
    cam.panX += ox * cam.radius * tanH; cam.panY += oy * cam.radius * tanV;
    cam.radius = Math.max(_radius * 1.22, Math.min(40, cam.radius * k));
    updCam();
  }
}

export function updCam() {
  const cam = store.get().camera;
  cam.phi = clamp(cam.phi, 0.1, Math.PI - 0.1);
  camera.position.set(
    tgt.x + cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta),
    tgt.y + cam.radius * Math.cos(cam.phi),
    tgt.z + cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta),
  );
  camera.up.set(0, 1, 0);
  camera.lookAt(tgt);
  camera.updateMatrixWorld(true);
  if (cam.panX) camera.translateX(cam.panX);
  if (cam.panY) camera.translateY(cam.panY);
  camera.updateMatrixWorld(true);
}

export function manual() {
  if (store.get().autoFit) store.set({ autoFit: false });
}

let dragging = false, panning = false, lx = 0, ly = 0;
const cv = document.getElementById('cv');
cv.addEventListener('contextmenu', (e) => e.preventDefault());
cv.addEventListener('pointerdown', (e) => {
  dragging = true; panning = (e.button === 2 || e.button === 1 || e.shiftKey);
  lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId);
  if (store.get().spin) store.set({ spin: false });
});
cv.addEventListener('pointerup', () => { dragging = false; });
cv.addEventListener('pointercancel', () => { dragging = false; });
cv.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
  const cam = store.get().camera;
  if (panning) {
    manual();
    const per = (2 * cam.radius * Math.tan((camera.fov * Math.PI) / 360)) / innerHeight;
    cam.panX -= dx * per; cam.panY += dy * per; updCam();
  } else {
    cam.theta -= dx * 0.007; cam.phi -= dy * 0.007;
    if (store.get().autoFit) fitView(); else updCam();
  }
});
cv.addEventListener('wheel', (e) => {
  e.preventDefault(); manual();
  const cam = store.get().camera;
  cam.radius = clamp(cam.radius * (1 + Math.sign(e.deltaY) * 0.1), 0.4, 40); updCam();
}, { passive: false });

export function view(th, ph) {
  const cam = store.get().camera;
  cam.theta = th; cam.phi = ph;
  store.set({ autoFit: true });
  fitView();
}

export function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  if (store.get().autoFit) fitView(); else updCam();
}
addEventListener('resize', resize);
