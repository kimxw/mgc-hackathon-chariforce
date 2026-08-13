import { buildEnvEquirect, buildGridTexture } from './textures.js';

const THREE = window.THREE;

// Perf tier: a phone-class screen or a low core-count device gets a capped
// pixel ratio and no shadow map. This canvas now renders continuously
// behind an entire scrolling site rather than one standalone demo page, so
// the desktop-tuned defaults (up to 2x DPR, 2048x2048 soft shadows) are the
// single biggest mobile-perf risk in the app if left untiered.
const LOW_TIER = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;

const cv = document.getElementById('cv');
export const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: !LOW_TIER });
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW_TIER ? 1.5 : 2));
renderer.shadowMap.enabled = !LOW_TIER;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
// filmic highlight rolloff so metal/glossy parts don't just clip to white —
// the single biggest lever for "real" vs "flat CG" on this scene's lighting
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

export const scene = new THREE.Scene();
scene.background = buildGridTexture();
scene.fog = new THREE.Fog(0xf7f7f5, 7, 20);

// procedural studio-gradient environment (no HDRI file needed) — gives every
// MeshStandardMaterial real reflections via IBL, which is what actually
// separates "brushed metal" from "grey plastic block" at these roughness/
// metalness values. LOW_TIER skips it: PMREM is a one-time cost but a real
// one, and phones already have the most to lose from it.
if (!LOW_TIER) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTex = buildEnvEquirect();
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  envTex.dispose();
  pmrem.dispose();
}

export const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80);

// neutral (not blue-tinted) sky/ground bounce, brighter than the old dark-
// room value — safe to raise since the dark frame/tire materials are
// low-albedo (near-black), so they stay dark regardless of ambient level;
// only true light-colored surfaces (chrome, cush­ion trim) pick up the lift
scene.add(new THREE.HemisphereLight(0xf5f5f2, 0xd8d5cb, 0.55));
const kl = new THREE.DirectionalLight(0xffffff, 1.05);
kl.position.set(2.6, 4.4, 2.8);
kl.castShadow = !LOW_TIER;
kl.shadow.mapSize.set(LOW_TIER ? 512 : 2048, LOW_TIER ? 512 : 2048);
kl.shadow.bias = -0.0007;
kl.shadow.camera.left = -4; kl.shadow.camera.right = 4;
kl.shadow.camera.top = 3.4; kl.shadow.camera.bottom = -3.4;
kl.shadow.camera.near = 0.5; kl.shadow.camera.far = 16;
scene.add(kl);
const fl = new THREE.DirectionalLight(0x86a4cf, 0.34); fl.position.set(-3.2, 2.2, -2.4); scene.add(fl);
const rl = new THREE.DirectionalLight(0xbcd4ff, 0.28); rl.position.set(-1, 1.4, -3.4); scene.add(rl);

export const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 0xeae7e0, roughness: 0.95, metalness: 0 }),
);
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
export const grid = new THREE.GridHelper(14, 28, 0xcfccc3, 0xdedbd3);
grid.position.y = 0.002; grid.material.transparent = true; grid.material.opacity = 0.5; scene.add(grid);
