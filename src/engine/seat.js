import { P } from './constants.js';
import { box, cyl, torus, strut, at, clear } from './geo.js';
import {
  matRail, matRail2, matSeat, matSeatB, matGrip, matFrame, matAcc,
  matBag, matCanopy, matTray, matHub,
} from './materials.js';
import { chair } from './chassis.js';
import { pop } from './pop.js';
import { store } from '../config/store.js';

const THREE = window.THREE;

// CARRIAGE — rides the lift. Local y = 0 is the TOP OF THE SEAT CUSHION.
export const carriage = new THREE.Group(); chair.add(carriage);

// rail deck: fixed stage on the lift, one intermediate stage, one moving stage
const railY = -1; // rails sit just under the seat pan
export const railFixed = new THREE.Group(); carriage.add(railFixed);
export const railMid = new THREE.Group(); carriage.add(railMid);
export const seatCar = new THREE.Group(); carriage.add(seatCar); // <-- carries seat + patient

[[-1], [1]].forEach(([s]) => {
  const z = s * (P.railDepth / 2 - 30);
  railFixed.add(at(box(P.railLen, P.railT + 8, 44, matRail2), 0, -P.seatT - 58, z));
  railMid.add(at(box(P.railLen - 30, P.railT + 2, 36, matRail), 0, -P.seatT - 40, z));
  seatCar.add(at(box(P.railLen - 60, P.railT - 4, 28, matRail), 0, -P.seatT - 24, z));
});
// rail cross-tie on the fixed stage
railFixed.add(at(box(150, 26, P.railDepth - 40, matFrame), 0, -P.seatT - 58, 0));
// detent / lock indicator on the moving stage
const lockPin = cyl(13, 30, matAcc, 14); lockPin.rotation.x = Math.PI / 2;
seatCar.add(at(lockPin, P.railLen / 2 - 70, -P.seatT - 24, P.railDepth / 2 - 4));

// seat assembly (configurable) — child of seatCar
export const seatParts = new THREE.Group(); seatCar.add(seatParts);
export let armPivot = null; // transfer-side armrest, swings about its own rear post
export let backPivot = null; // backrest hinge, used by the reclining module
export let seatWidthNow = P.seatW;

export function buildSeatParts() {
  clear(seatParts);
  armPivot = null; backPivot = null;
  const cf = store.get().cfg;
  const W = cf.seat === 'wide' ? 460 : (cf.seat === 'contour' ? 400 : P.seatW);
  const D = cf.seat === 'wide' ? 460 : P.seatD;
  seatWidthNow = W;

  // --- seat pan + cushion ---
  seatParts.add(at(box(W, 26, D, matFrame), 0, -P.seatT + 13, 0)); // pan
  if (cf.seat === 'contour') {
    seatParts.add(at(box(W - 70, 40, D, matSeat), 0, -20, 0)); // centre well
    [-1, 1].forEach((s) => seatParts.add(at(box(38, 58, D, matSeat), s * (W / 2 - 19), -10, 0))); // bolsters
    [-1, 1].forEach((s) => seatParts.add(at(box(30, 26, D - 60, matGrip), s * (W / 2 - 19), 14, 0)));
  } else {
    seatParts.add(at(box(W, 44, D, matSeat), 0, -22, 0));
    seatParts.add(at(box(W - 40, 10, D - 40, matSeatB), 0, 2, 0));
  }

  // --- backrest. Lives in backPivot so a reclining module can actually recline. ---
  const backH = cf.back === 'high' ? 620 : (cf.back === 'recline' ? 520 : 470);
  const bz = -D / 2 + 22;
  backPivot = new THREE.Group();
  at(backPivot, 0, 8, bz); // hinge at the seat/back joint
  seatParts.add(backPivot);
  // helper: place in backPivot using the same seat-origin coordinates
  const B = (o, x, y, z) => { backPivot.add(at(o, x, y - 8, z - bz)); return o; };

  B(box(W, backH, 44, matSeat), 0, backH / 2, bz);
  B(box(W - 40, backH - 50, 14, matSeatB), 0, backH / 2, bz + 26);
  B(box(W + 24, 26, 26, matFrame), 0, backH + 16, bz);
  if (cf.back === 'high') {
    B(box(240, 150, 52, matSeat), 0, backH + 96, bz + 6); // headrest
    B(box(26, 90, 26, matFrame), 0, backH + 30, bz);
  }
  if (cf.back === 'recline') {
    [-1, 1].forEach((s) => { // hinge bosses, on the axis
      const g = cyl(30, 20, matAcc, 18); g.rotation.x = Math.PI / 2;
      seatParts.add(at(g, s * (W / 2 - 14), 8, bz));
    });
    B(box(26, 170, 26, matRail2), -(W / 2 + 30), backH * 0.4, bz - 46); // gas strut, rides the back
  }
  // push handles travel with the backrest
  [-1, 1].forEach((s) => {
    const x = s * (W / 2 - 32);
    B(box(26, 88, 26, matFrame), x, backH + 62, bz);
    B(box(26, 26, 92, matFrame), x, backH + 102, bz - 38);
    const g = cyl(14, 145, matGrip, 16); g.rotation.x = Math.PI / 2;
    B(g, x, backH + 102, bz - 146);
  });

  // --- armrests. -X side is fixed; +X (transfer side) swings rearward
  //     about its OWN rear post, so it never sweeps across the occupant. ---
  const ax = W / 2 + 26, pz = bz + 52;
  seatParts.add((function () { // fixed left armrest
    const g = new THREE.Group();
    g.add(at(box(24, 205, 24, matFrame), -ax, 100, pz));
    g.add(at(box(70, 20, 24, matFrame), -ax + 30, -8, pz));
    g.add(at(box(24, 24, 290, matFrame), -ax, 196, -20));
    g.add(at(box(58, 24, 282, matGrip), -ax, 220, -20));
    return g;
  })());

  armPivot = new THREE.Group();
  at(armPivot, ax, 0, pz); // pivot ON the rear post axis
  armPivot.add(at(box(24, 205, 24, matFrame), 0, 100, 0)); // upright (on the axis)
  armPivot.add(at(box(70, 20, 24, matFrame), -30, -8, 0)); // bracket into the seat frame
  armPivot.add(at(box(24, 24, 290, matFrame), 0, 196, -20 - pz)); // rail, extends forward
  armPivot.add(at(box(58, 24, 282, matGrip), 0, 220, -20 - pz)); // pad
  seatParts.add(armPivot);

  // --- attachments ---
  const A = cf.acc;
  if (A.cup) {
    const cx = -(W / 2 + 26);
    seatParts.add(at(box(26, 60, 26, matAcc), cx, 250, 100));
    const holder = cyl(48, 90, matAcc, 20, 44);
    seatParts.add(at(holder, cx - 46, 300, 100));
    const inner = cyl(40, 80, matGrip, 20);
    seatParts.add(at(inner, cx - 46, 308, 100));
  }
  if (A.umbrella) {
    const ux = -(W / 2 + 18), px = ux - 30, pz = bz - 6;
    seatParts.add(at(box(30, 84, 30, matAcc), ux, backH * 0.5, pz));
    seatParts.add(at(cyl(12, 760, matRail2, 14), px, backH * 0.5 + 400, pz));
    // 8-panel canopy — a LOW segment count facets the cone into flat panels
    // (like real umbrella fabric between the ribs) instead of a smooth cone
    const canY = backH * 0.5 + 790, canR = 480, canH = 175, panels = 8;
    const can = cyl(26, canH, matCanopy, panels, canR);
    seatParts.add(at(can, px, canY, pz));
    // ribs: apex-to-rim struts along each panel seam, the actual detail
    // that reads as "umbrella" rather than "cone"
    const apex = { x: px, y: canY + canH / 2, z: pz };
    for (let i = 0; i < panels; i++) {
      const a = (i / panels) * Math.PI * 2;
      const rim = { x: px + canR * Math.cos(a), y: canY - canH / 2, z: pz + canR * Math.sin(a) };
      seatParts.add(strut(apex, rim, matRail2, 4));
    }
    // pointed finial, not a ball — sits right on the apex
    seatParts.add(at(cyl(0, 60, matAcc, panels, 5), px, canY + canH / 2 + 30, pz));
  }
  if (A.storage) {
    seatParts.add(at(box(W - 70, 240, 150, matBag), 0, backH * 0.44, bz - 96)); // rear pannier
    seatParts.add(at(box(W - 130, 16, 26, matGrip), 0, backH * 0.44 + 96, bz - 172)); // grab strap
    seatParts.add(at(box(40, 90, 20, matAcc), -(W / 2 - 70), backH * 0.44 + 30, bz - 172));
  }
  if (A.tray) {
    seatParts.add(at(box(W + 70, 20, 260, matTray), 0, 232, D / 2 + 38));
    seatParts.add(at(box(W + 40, 8, 220, matGrip), 0, 243, D / 2 + 38));
    [-1, 1].forEach((s) => seatParts.add(at(box(22, 52, 22, matAcc), s * (W / 2 - 12), 200, D / 2 - 46)));
  }
  if (A.ivpole) {
    // pole mounted opposite the umbrella, a 3-hook top for a drip bag, and
    // a ring bracket partway down holding an oxygen canister
    const ix = W / 2 + 20, iz = bz + 10, poleH = 900, baseY = backH * 0.4;
    seatParts.add(at(box(26, 60, 26, matAcc), ix - 8, baseY, iz)); // mount bracket
    seatParts.add(at(cyl(9, poleH, matRail2, 12), ix, baseY + poleH / 2 + 30, iz)); // pole
    const topY = baseY + poleH + 30;
    seatParts.add(at(cyl(14, 22, matHub, 10), ix, topY, iz)); // hub
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      const hookEnd = { x: ix + 44 * Math.cos(a), y: topY + 12, z: iz + 44 * Math.sin(a) };
      seatParts.add(strut({ x: ix, y: topY, z: iz }, hookEnd, matRail2, 5));
    }
    const ringY = baseY + poleH * 0.4;
    const ring = torus(48, 6, matAcc, 8, 24); ring.rotation.x = Math.PI / 2;
    seatParts.add(at(ring, ix, ringY, iz));
    seatParts.add(at(cyl(36, 190, matHub, 20), ix, ringY - 85, iz)); // canister sitting in the ring
  }

  pop(seatParts);
}
