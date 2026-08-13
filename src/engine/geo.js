import { MM } from './constants.js';

const THREE = window.THREE;

export function box(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w * MM, h * MM, d * MM), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}
export function cyl(r, h, mat, seg = 22, r2) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r * MM, (r2 === undefined ? r : r2) * MM, h * MM, seg), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}
export function sph(r, mat, seg = 20) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r * MM, seg, seg), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}
// an open ring, not a filled disc — for wheel rims / push-rims, where a
// solid disc (built from cyl() with no inner radius) would just bury
// anything behind it, like the wheel's own spokes
export function torus(r, tube, mat, radialSeg = 12, tubularSeg = 32) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r * MM, tube * MM, radialSeg, tubularSeg), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}
export function at(o, x, y, z) {
  o.position.set(x * MM, y * MM, z * MM);
  return o;
}
// a thin cylinder spanning two mm-space points — for ribs/struts/braces
// that run at an angle, rather than everything being axis-aligned boxes
export function strut(p1, p2, mat, thickness = 4, seg = 6) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y, dz = p2.z - p1.z;
  const len = Math.hypot(dx, dy, dz);
  const m = cyl(thickness, len, mat, seg);
  at(m, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
  const dir = new THREE.Vector3(dx, dy, dz).normalize();
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return m;
}
// like strut() but a flat strap instead of a round rod — for webbing
// (seatbelts) that needs a rectangular cross-section, not a rope.
export function flatStrut(p1, p2, mat, width = 26, thickness = 14) {
  const dx = p2.x - p1.x, dy = p2.y - p1.y, dz = p2.z - p1.z;
  const len = Math.hypot(dx, dy, dz);
  const m = box(width, len, thickness, mat);
  at(m, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
  const dir = new THREE.Vector3(dx, dy, dz).normalize();
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return m;
}

export function clear(g) {
  while (g.children.length) {
    const c = g.children.pop();
    c.traverse && c.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }
}
