import { TOTAL } from './constants.js';
import { store } from '../config/store.js';
import { scene, camera, renderer } from './scene.js';
import { apply } from './apply.js';
import { pops, stepPops } from './pop.js';
import { fitView, updCam } from './cameraRig.js';
import { setPlay, syncScrub } from './playback.js';

let last = performance.now();
export function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const s = store.get();

  if (s.playing) {
    let t = s.t + dt;
    if (t >= TOTAL) { t = TOTAL; store.set({ t }); setPlay(false); } else { store.set({ t }); }
    syncScrub(); apply();
  }
  // ease the backrest to its target so fitting the recliner shows it reclining
  if (Math.abs(s.recTarget - s.recA) > 0.05) {
    store.set({ recA: s.recA + (s.recTarget - s.recA) * Math.min(1, dt * 4.5) });
    apply();
  }
  if (s.spin) { store.get().camera.theta += dt * 0.28; if (s.autoFit) fitView(); else updCam(); }
  // refit while modules pop in — bounds change as they grow
  if (pops.length) { stepPops(dt); if (s.autoFit && !s.spin) fitView(); }

  renderer.render(scene, camera);
}
