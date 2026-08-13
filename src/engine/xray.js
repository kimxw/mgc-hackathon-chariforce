import { matSeat, matSeatB, matCloth, matPants, matSkin, matRail, matRail2, matFrame } from './materials.js';

const THREE = window.THREE;

// X-ray: fade the soft parts, light up the rails and lift column
export function setXray(on) {
  [matSeat, matSeatB, matCloth, matPants, matSkin].forEach((m) => {
    m.transparent = on; m.opacity = on ? 0.14 : 1; m.depthWrite = !on; m.needsUpdate = true;
  });
  [matRail, matRail2].forEach((m) => {
    m.emissive = new THREE.Color(on ? 0x1d5fa8 : 0x000000);
    m.emissiveIntensity = on ? 0.85 : 0; m.needsUpdate = true;
  });
  matFrame.emissive = new THREE.Color(on ? 0x0e2740 : 0x000000);
  matFrame.emissiveIntensity = on ? 0.6 : 0; matFrame.needsUpdate = true;
}
