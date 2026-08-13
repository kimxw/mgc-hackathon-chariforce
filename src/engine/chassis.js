import { D2R, P } from './constants.js';
import { box, at } from './geo.js';
import { matFrame, matFootplate } from './materials.js';
import { brushedBump } from './textures.js';
import { scene } from './scene.js';

const THREE = window.THREE;

// CHASSIS — fixed, does not move
export const chair = new THREE.Group(); scene.add(chair);
export const base = new THREE.Group(); chair.add(base);

[-1, 1].forEach((s) => {
  base.add(at(box(30, 32, 540, matFrame), s * 228, P.frameY, 70));            // side rail
  base.add(at(box(24, 150, 24, matFrame), s * 228, P.frameY - 88, P.castZ - 30)); // caster drop
  base.add(at(box(24, 190, 24, matFrame), s * 228, P.frameY - 62, P.wheelZ + 40)); // rear post
  base.add(at(box(28, 210, 28, matFootplate), s * 142, 116, P.castZ + 92));   // footplate arm
  const fp = box(150, 16, 190, matFootplate); fp.rotation.x = -6 * D2R;
  base.add(at(fp, s * 120, 20, P.castZ + 162));                              // footplate
});
base.add(at(box(490, 30, 30, matFrame), 0, P.frameY, 190));
base.add(at(box(490, 26, 26, matFrame), 0, P.frameY, -40));
[-1, 1].forEach((s) => {
  const b = box(440, 20, 20, matFrame); b.rotation.z = s * 24 * D2R;
  base.add(at(b, 0, 148, 58));
});

// LIFT COLUMN — the "Chair Force" bit
export const LIFT_TOP_FIXED = 400;
export const liftOuter = box(158, 190, 158, matFrame);
at(liftOuter, 0, 300, 30); chair.add(liftOuter);
export const liftMid = box(126, 100, 126, new THREE.MeshStandardMaterial({
  color: 0x9a9ea3, roughness: 0.26, metalness: 0.93, bumpMap: brushedBump, bumpScale: 0.0004,
}));
chair.add(liftMid);
export const liftInner = box(96, 100, 96, new THREE.MeshStandardMaterial({
  color: 0xd2d4d6, roughness: 0.16, metalness: 0.96, bumpMap: brushedBump, bumpScale: 0.0004,
}));
chair.add(liftInner);
