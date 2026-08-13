// three.js r128 is loaded as a classic (non-module) script — see
// src/vendor/three.r128.js — so it sets the global `THREE` rather than
// being an npm import. Every engine module reads it off `window`.
import { fabricBump, treadBump, brushedBump } from './textures.js';

const THREE = window.THREE;

export const M = (c, r = 0.45, m = 0.8) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
// attaches a bump map post-construction — kept as a separate step so the
// plain M() signature above stays simple for the (majority) unbumped materials
const bump = (mat, map, scale) => { mat.bumpMap = map; mat.bumpScale = scale; return mat; };

// Painted/powder-coated steel — classic wheelchair-black, matte-to-satin
// (paint is a dielectric even over a metal substrate, so metalness stays low
// — color + roughness alone sell "painted", not a metallic tint on black).
export const matFrame = bump(M(0x1c1d1f, 0.42, 0.08), brushedBump, 0.00035);
// Cast-aluminum footplates — a distinct lighter, semi-gloss metal that
// stands out from the black frame tubing, the way real footplates do.
export const matFootplate = bump(M(0x9a9ea3, 0.4, 0.65), brushedBump, 0.0003);
// Bare/polished metal — telescoping rails and lift tubes read as brushed
// aluminum; kept high-metalness, neutral silver, reflections do the work.
export const matRail = bump(M(0xc9cdd1, 0.22, 0.95), brushedBump, 0.0004);
export const matRail2 = bump(M(0x9fa3a8, 0.26, 0.94), brushedBump, 0.0004);
// Glossy black vinyl/leather upholstery, not woven fabric — lower roughness,
// a much lighter bump than a fabric weave (leather grain, not cloth).
export const matSeat = bump(M(0x1c1d1f, 0.35, 0), fabricBump, 0.0002);
export const matSeatB = bump(M(0x1f2023, 0.32, 0), fabricBump, 0.00015);
export const matGrip = bump(M(0x17181a, 0.92, 0), treadBump, 0.0004); // grippy rubberized handle
export const matTire = bump(M(0x121314, 0.93, 0), treadBump, 0.0012);
// Chrome — bright, near-mirror spokes/rim, the way real wheelchair wheels
// actually finish (vs. the frame's matte black).
export const matSpoke = bump(M(0xdadcdd, 0.14, 0.97), brushedBump, 0.00025);
export const matHub = bump(M(0x8c8f92, 0.2, 0.92), brushedBump, 0.0002);
export const matBed = M(0xd9d1c2, 0.92, 0.03);
export const matBedFr = M(0x6d5843, 0.85, 0.05);
export const matSkin = M(0xc7a184, 0.82, 0.04);
export const matCloth = bump(M(0x4478b8, 0.9, 0.04), fabricBump, 0.0006);
export const matPants = bump(M(0x39424f, 0.92, 0.04), fabricBump, 0.0006);
// Small anodized hardware fittings (hinge pins, mount brackets) — natural
// anodized-metal tones rather than flat UI-accent colors.
export const matAcc = M(0xb8552b, 0.42, 0.55);
export const matAcc2 = M(0x2f7a5c, 0.42, 0.55);
export const matTray = bump(M(0x53565c, 0.5, 0.04), brushedBump, 0.0003); // molded plastic, not metal
export const matBag = bump(M(0x24272c, 0.88, 0), fabricBump, 0.0006);
export const matCanopy = M(0x3a5f86, 0.62, 0.03); // waxed-canvas sheen, not a UI blue
// Postural seatbelt — red nylon webbing with a plated-steel buckle, the way
// wheelchair lap belts actually contrast against black upholstery.
export const matBelt = bump(M(0xa33326, 0.75, 0.05), fabricBump, 0.0004);
export const matBuckle = bump(M(0x8c8f92, 0.28, 0.85), brushedBump, 0.0002);
