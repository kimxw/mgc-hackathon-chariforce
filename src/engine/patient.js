import { box, cyl, sph, at, flatStrut } from './geo.js';
import { matPants, matCloth, matSkin, matGrip, matBelt, matBuckle } from './materials.js';
import { seatCar } from './seat.js';

const THREE = window.THREE;

// occupant, rides the seat then slides off it
export const patient = new THREE.Group(); seatCar.add(patient);
export const knees = [];
export const torsoGrp = new THREE.Group(); // reclines with the backrest

(function buildPatient() {
  patient.add(at(box(316, 150, 318, matPants), 0, 72, 10)); // pelvis

  // upper body hangs off a lumbar hinge so it lies back with the backrest
  at(torsoGrp, 0, 100, -60); patient.add(torsoGrp);
  const T = (o, x, y, z) => { torsoGrp.add(at(o, x, y - 100, z + 60)); return o; };
  T(box(322, 330, 224, matCloth), 0, 312, -30); // torso
  T(box(300, 110, 206, matCloth), 0, 500, -28); // shoulders
  [-1, 1].forEach((s) => T(sph(64, matCloth, 18), s * 150, 496, -28));
  T(cyl(50, 96, matSkin, 16), 0, 566, -22); // neck
  const head = sph(90, matSkin, 26); head.scale.set(0.86, 1.14, 1.0);
  T(head, 0, 672, -16);
  const hair = sph(92, new THREE.MeshStandardMaterial({ color: 0x2a2320, roughness: 0.9, metalness: 0.03 }), 26);
  hair.scale.set(0.87, 1.02, 1.0);
  T(hair, 0, 706, -30);
  [-1, 1].forEach((s) => {
    const arm = box(82, 290, 86, matCloth); arm.rotation.z = s * (6 * Math.PI / 180);
    T(arm, s * 186, 330, -14); // upper arm
    T(box(76, 80, 236, matSkin), s * 196, 182, 86); // forearm
    T(sph(46, matSkin, 14), s * 196, 178, 206); // hand
  });

  [-1, 1].forEach((s) => {
    patient.add(at(box(118, 112, 344, matPants), s * 82, 44, 186)); // thigh
    // shin + foot hang from a knee joint so they can straighten onto the bed
    const knee = new THREE.Group();
    at(knee, s * 82, 10, 330); patient.add(knee); knees.push(knee);
    knee.add(at(box(96, 300, 104, matPants), 0, -152, 12)); // shin
    knee.add(at(box(106, 62, 158, matGrip), 0, -308, 74)); // foot
  });
})();

// 3-point belt — a sibling of `patient` on the seatCar, NOT a child of it, so
// it stays with the chair (unbuckled and left behind) once the occupant
// slides off; if it lived under `patient` it would slide off with them.
// Routed in three legs, staying clear of the arm and thigh boxes at every
// step (a straight anchor-to-buckle line cuts straight through both):
//   P0 -> M1  forward at a constant height above the arm's shoulder height,
//             so this leg never enters the arm's Y-range at all
//   M1 -> M2  drops to chest height, but Z is already well in front of the
//             arm's front face, so it can't clip it on the way down
//   M2 -> P1  the visible diagonal, to a buckle held above the thigh's top
//             surface (not through it) at the hip
const beltP0 = { x: -165, y: 570, z: -165 }; // fixed anchor, top-left of the backrest
const beltM1 = { x: -165, y: 570, z: 85 }; // clears the shoulder/arm/hand going forward
const beltM2 = { x: -172, y: 430, z: 100 }; // drops to chest height, already in front
const beltP1 = { x: 168, y: 110, z: 115 }; // buckle, above the thigh, at the hip
export const beltPivot = new THREE.Group();
at(beltPivot, beltP0.x, beltP0.y, beltP0.z); // hinge at the fixed backrest-top mount
seatCar.add(beltPivot);
const beltLocal = (p) => ({ x: p.x - beltP0.x, y: p.y - beltP0.y, z: p.z - beltP0.z });
const localM1 = beltLocal(beltM1);
const localM2 = beltLocal(beltM2);
const localP1 = beltLocal(beltP1);
beltPivot.add(flatStrut({ x: 0, y: 0, z: 0 }, localM1, matBelt, 26, 14));
beltPivot.add(flatStrut(localM1, localM2, matBelt, 26, 14));
beltPivot.add(flatStrut(localM2, localP1, matBelt, 26, 14)); // the visible chest-to-hip diagonal
beltPivot.add(at(box(44, 40, 20, matBuckle), localP1.x, localP1.y, localP1.z)); // buckle clip, at the hip end
