import { TOTAL } from './constants.js';
import { store } from '../config/store.js';

const $ = (id) => document.getElementById(id);

// Guarded like readout.js — the Play button / scrub bar only exist once
// ui/sections/phases/phase1Transfer.js has built them, but this module (via
// engine/loop.js) needs to drive them from boot onward regardless.
export function setPlay(on) {
  store.set({ playing: on });
  const btn = $('bPlay');
  if (btn) { btn.textContent = on ? '❚❚ Pause' : '▶ Play'; btn.classList.toggle('on', on); }
}

export function syncScrub() {
  const scrub = $('scrub'), tlbl = $('tlbl');
  if (scrub) scrub.value = Math.round((store.get().t / TOTAL) * 1000);
  if (tlbl) tlbl.textContent = store.get().t.toFixed(1) + 's';
}
