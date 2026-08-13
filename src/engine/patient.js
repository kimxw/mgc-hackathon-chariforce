import { box, cyl, sph, at } from './geo.js';
import { matPants, matCloth, matSkin, matGrip } from './materials.js';
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
