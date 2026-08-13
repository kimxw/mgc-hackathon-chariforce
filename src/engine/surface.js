import { P } from './constants.js';
import { box, at } from './geo.js';
import { matBed, matBedFr } from './materials.js';
import { scene } from './scene.js';

const THREE = window.THREE;

// target surface
export const bed = new THREE.Group(); scene.add(bed);
export const bedTop = box(P.bedW, P.bedT, P.bedD, matBed); bed.add(bedTop);
export const bedLegs = [];
[[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => {
  const l = box(74, 100, 74, matBedFr); bed.add(l); bedLegs.push([l, sx, sz]);
});
export const bedHead = box(P.bedW + 40, 430, 60, matBedFr); bed.add(bedHead);
export const pillow = box(560, 110, 300, new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.95, metalness: 0.02 }));
at(pillow, 0, 100, -P.bedD / 2 + 240); bed.add(pillow);

// contact highlight where the seat lands on the surface
export const contact = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ color: 0x63d69a, transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
);
contact.rotation.x = -Math.PI / 2; scene.add(contact);
