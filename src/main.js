// Boot orchestration. Importing these engine modules runs their top-level
// scene-graph construction as a side effect, in dependency order: scene ->
// chassis -> wheels/seat (depend on chassis) -> patient/surface (depend on
// seat) -> cameraRig (registers pointer/wheel listeners) -> apply/loop.
import './engine/scene.js';
import './engine/chassis.js';
import { wheelsGrp, buildWheels } from './engine/wheels.js';
import { seatParts, buildSeatParts } from './engine/seat.js';
import './engine/patient.js';
import './engine/surface.js';
import { pops } from './engine/pop.js';
import { apply } from './engine/apply.js';
import { store } from './config/store.js';
import { bed, contact } from './engine/surface.js';
import { resize } from './engine/cameraRig.js';
import { tick } from './engine/loop.js';

import { el } from './ui/dom.js';
import { buildNav } from './ui/chrome/nav.js';
import { buildHeroCover } from './ui/sections/heroCover.js';
import { buildPartners } from './ui/sections/partners.js';
import { buildHero } from './ui/sections/hero.js';
import { buildFeatures } from './ui/sections/features.js';
import { buildPhasesSection } from './ui/sections/phases/index.js';
import { buildSummary } from './ui/sections/summary.js';
import { buildPurchase } from './ui/sections/purchase.js';
import { initStoryScroll } from './ui/storyScroll.js';
import { initPhaseScroll } from './ui/phaseScroll.js';

const app = document.getElementById('app');
const phases = buildPhasesSection();

app.appendChild(buildNav());
app.appendChild(el('main', { id: 'story' }, [
  buildHeroCover(),
  buildPartners(),
  buildHero(),
  buildFeatures(),
  ...phases.sectionEls,
  buildSummary(),
  buildPurchase(),
]));

buildWheels();
buildSeatParts();
pops.length = 0; // no pop animation on first load
wheelsGrp.scale.set(1, 1, 1);
seatParts.scale.set(1, 1, 1);
phases.setPhase(1); // populates phase 1's DOM content — but it also forces the
// occupant AND the target bed/surface visible (correct once you're
// actually there), which we don't want yet: boot view is the hero, a bare
// chair with nothing next to it, not phase 1's transfer scene
store.set({ patient: false });
bed.visible = contact.visible = false;
resize();
apply();
initStoryScroll();
initPhaseScroll(phases.setPhase);
requestAnimationFrame(tick);
