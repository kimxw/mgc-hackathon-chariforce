import { MM, P, clamp } from './constants.js';
import { store } from '../config/store.js';
import { solve } from './solver.js';
import { chair, liftMid, liftInner, LIFT_TOP_FIXED } from './chassis.js';
import { carriage, railMid, seatCar, armPivot, backPivot, seatWidthNow } from './seat.js';
import { patient, torsoGrp, knees, beltPivot } from './patient.js';
import { matBelt, matBuckle } from './materials.js';
import { bed, bedLegs, bedHead, contact } from './surface.js';
import { readout, syncSteps } from './readout.js';
import { fitView } from './cameraRig.js';

export function apply() {
  const s = store.get();
  const R = solve();

  // telescoping lift column: two telescoping stages between the sleeve and the rail deck
  const deckY = R.seatY - P.seatT - 78;
  const travelCol = Math.max(0, deckY - LIFT_TOP_FIXED);
  liftMid.scale.y = Math.max(0.2, (160 + travelCol * 0.5)) / 100;
  liftMid.position.set(0, (300 + travelCol * 0.28) * MM, 30 * MM);
  liftInner.scale.y = Math.max(0.2, (150 + travelCol * 0.5)) / 100;
  liftInner.position.set(0, (355 + travelCol * 0.66) * MM, 30 * MM);

  carriage.position.set(0, R.seatY * MM, 30 * MM);
  chair.position.z = R.chairZ * MM; // chair rolls backward on the closing beat

  // telescoping rails: intermediate stage does half the travel
  railMid.position.x = (R.ext * 0.5) * MM;
  seatCar.position.x = R.ext * MM;

  // armrest swings rearward
  if (armPivot) armPivot.rotation.y = R.armA;
  if (backPivot) backPivot.rotation.x = -s.recA * (Math.PI / 180);
  torsoGrp.rotation.x = -s.recA * (Math.PI / 180); // the occupant lies back with it

  // knees straighten as the seat swings out, so the legs ride onto the surface
  // instead of passing through its edge
  const kneeAng = -84 * (Math.PI / 180) * R.p2;
  knees.forEach((k) => { k.rotation.x = kneeAng; });

  // seatbelt: worn while the seat matches height, unbuckled during the tail
  // of that same phase so it's fully off — not mid-unbuckle — by the time
  // "Open the side" starts and the armrest begins swinging (R.armA below).
  // Fades out in place rather than swinging like the armrest.
  const beltOff = clamp((R.p0 - 0.55) / 0.45, 0, 1);
  const beltOpacity = 1 - beltOff;
  matBelt.opacity = beltOpacity;
  matBuckle.opacity = beltOpacity;
  beltPivot.visible = s.patient && beltOpacity > 0.01;

  // occupant: rides the seat, then slides laterally onto the surface
  patient.visible = s.patient;
  const seatTopWorldY = R.seatY;
  const targetX = s.gap + 340; // where they end up on the surface
  const localSlideX = Math.max(0, targetX - R.ext);
  const localDropY = s.bed - seatTopWorldY;
  patient.position.x = (localSlideX * R.slide) * MM;
  patient.position.y = (localDropY * R.slide) * MM;
  patient.rotation.z = -R.slide * 2.5 * (Math.PI / 180);
  // once they are on the surface these offsets hold them there in world space
  // while the seat retracts and the chair rolls out from under them
  patient.position.z = (-R.chairZ * R.slide) * MM;

  // target surface
  bed.position.set((s.gap + P.bedW / 2) * MM, (s.bed - P.bedT / 2) * MM, 30 * MM);
  bedLegs.forEach(([l, sx, sz]) => {
    const h = Math.max(20, s.bed - P.bedT);
    l.scale.y = h / 100;
    l.position.set(sx * (P.bedW / 2 - 74) * MM, (-P.bedT / 2 - h / 2) * MM, sz * (P.bedD / 2 - 74) * MM);
  });
  bedHead.position.set(0, 215 * MM, (-P.bedD / 2 - 30) * MM);

  // contact patch
  if (R.supported && R.ext > 1) {
    const w = Math.min(R.overlap, seatWidthNow);
    contact.visible = true;
    contact.scale.set(w * MM, (P.seatD - 40) * MM, 1);
    contact.position.set((s.gap + w / 2) * MM, (s.bed + 3) * MM, 30 * MM);
  } else contact.visible = false;

  readout(R);
  syncSteps(R);
  if (s.autoFit) fitView();
}
