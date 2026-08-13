import { P, MM } from './constants.js';
import { cyl, box, torus, at, clear } from './geo.js';
import { matTire, matHub, matSpoke, matAcc, matFrame } from './materials.js';
import { base } from './chassis.js';
import { pop } from './pop.js';
import { store } from '../config/store.js';

const THREE = window.THREE;

// wheels (configurable)
export const wheelsGrp = new THREE.Group(); base.add(wheelsGrp);

export function buildWheels() {
  clear(wheelsGrp);
  const type = store.get().cfg.wheel;
  const R = type === 'terrain' ? 290 : P.wheelR;
  const TH = type === 'terrain' ? 64 : (type === 'powered' ? 48 : P.wheelTh);
  const cR = type === 'terrain' ? 118 : P.castR;

  [-1, 1].forEach((s) => {
    const x = s * (P.wheelX + (type === 'terrain' ? 20 : 0));
    const tire = cyl(R, TH, matTire, 40); tire.rotation.z = Math.PI / 2;
    wheelsGrp.add(at(tire, x, R, P.wheelZ));

    if (type === 'terrain') {
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        const k = box(30, 24, TH + 8, matTire);
        k.position.set(x * MM, (R + Math.cos(a) * (R - 6)) * MM, (P.wheelZ + Math.sin(a) * (R - 6)) * MM);
        k.rotation.x = -a;
        wheelsGrp.add(k);
      }
    }
    if (type === 'powered') {
      const drum = cyl(R * 0.5, TH + 30, matHub, 26); drum.rotation.z = Math.PI / 2;
      wheelsGrp.add(at(drum, x, R, P.wheelZ));
      const cap = cyl(R * 0.22, TH + 44, matAcc, 20); cap.rotation.z = Math.PI / 2;
      wheelsGrp.add(at(cap, x, R, P.wheelZ));
    } else {
      // an OPEN ring, not a filled disc — a solid disc here would just bury
      // the spokes behind it regardless of how they're oriented
      const rim = torus(R * 0.62, 13, matSpoke, 10, 36); rim.rotation.y = Math.PI / 2;
      wheelsGrp.add(at(rim, x, R, P.wheelZ));
      const hub = cyl(R * 0.15, TH + 26, matHub, 16); hub.rotation.z = Math.PI / 2;
      wheelsGrp.add(at(hub, x, R, P.wheelZ));
      for (let i = 0; i < 6; i++) {
        // long axis on Y (the disc-plane direction), THEN fan it around the
        // wheel's own rotation axis (X) — building it long-on-X and rotating
        // about X (as this used to) spins a box around its own long axis,
        // so all 6 "spokes" silently overlapped into one invisible sliver
        const sp = box(7, R * 1.35, 7, matSpoke);
        sp.rotation.x = i * (Math.PI / 6);
        wheelsGrp.add(at(sp, x, R, P.wheelZ));
      }
      // push-rim: also an open ring (a solid disc would read as a floating
      // plate, not a grip ring), offset outward past the tire face
      const hr = torus(R * 0.86, 6, matSpoke, 8, 40); hr.rotation.y = Math.PI / 2;
      wheelsGrp.add(at(hr, x + s * (TH / 2 + 22), R, P.wheelZ));
    }

    // front caster
    const c = cyl(cR, 28, matTire, 24); c.rotation.z = Math.PI / 2;
    wheelsGrp.add(at(c, s * P.castX, cR, P.castZ));
    wheelsGrp.add(at(box(20, 150, 18, matFrame), s * P.castX, cR + 76, P.castZ));
  });
  pop(wheelsGrp);
}
