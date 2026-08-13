// All narrative copy for the site. Sourced from two places, both cited
// inline so nothing here reads as fabricated:
//  - Downloads/index.html: an existing Chair Force marketing page (hero,
//    problem stats, phase framing, subsidy/purchase copy) — reused verbatim
//    or near-verbatim, including its own honesty disclaimers.
//  - mechanism-demo's own engine (PHASES / CFG in config/options.js): the
//    only source of truth for what the 3D model actually does.
export const content = {
  hero: {
    eyebrow: 'For families managing care at home',
    h1: 'One wheelchair that carries you through every stage of care.',
    lede: 'Chair Force turns wheelchair transfers into a one-person, no-lift routine, then grows with modular add-ons as needs change, so one chair meets a lifetime of needs.',
    stat: { num: '~100,000', label: 'wheelchair users in Singapore rely on safe, dignified transfers every single day.' },
    personas: [
      { initial: 'B', name: 'Brenda', desc: 'Living with cerebral palsy' },
      { initial: 'S', name: 'Sherry', desc: 'Living with spinal muscular atrophy' },
      { initial: 'W', name: 'Wendy', desc: 'Cancer survivor' },
    ],
    ctaPrimary: 'Start building',
  },

  // Bento feature grid — every entry maps to a real, modeled mechanism
  // (engine/chassis.js's lift column, engine/seat.js's armPivot/rails/acc
  // attachments, engine/wheels.js's wheel types), not marketing claims.
  features: {
    eyebrow: 'Under the hood',
    h2: 'Everything the chair actually does.',
    items: [
      { id: 'lift', title: 'Ease of transfer', desc: 'A telescoping column raises or lowers the entire seat to match the bed, sofa, or toilet, to the millimetre.', video: true, imgAlt: 'Video of the powered height-lift column raising the seat to meet a bed' },
      { id: 'armrest', title: 'Transfer mechanism works with various surfaces', desc: 'Standard, all-terrain, or powered hub: the same chassis, fitted for how someone actually gets around.', video: true, imgAlt: 'Video of the transfer mechanism working across different surfaces' },
      { id: 'rails', title: 'Powered height, adjusted', desc: 'The seat rises and lowers to meet the bed, sofa, or toilet exactly.', imgAlt: 'Photo of the seat and backrest extended out on telescoping transfer rails' },
      { id: 'modular', title: 'Telescoping transfer rails', desc: 'The seat and backrest ride out on their own rails, bridging the gap to the target surface.', imgAlt: 'Photo of the telescoping rail assembly with quick-release clamps and a clip-on cup holder module' },
      { id: 'wheels', title: 'Grows with the person', desc: 'Cup holder, canopy, storage, tray table, IV pole: clip a new module onto the same universal rail as needs change.', img: '/img/features/attachments.png', imgAlt: 'Photo of clip-on modules — cup holder, umbrella arm, all-terrain wheels, and a storage case — that mount on the universal rail' },
    ],
  },

  problem: {
    eyebrow: 'Every day',
    h2: 'Transfers are physically and emotionally exhausting.',
    lede: 'Every bed-to-chair, chair-to-bath, chair-to-toilet move is a risk, for the person being moved and for the person doing the lifting.',
    stats: [
      { big: '8–20', label: 'average number of wheelchair transfers performed in a single day.' },
      { big: '3,900/yr', label: 'elderly patients present to US EDs with wheelchair-transfer fractures; 44% happen at home.' },
      { big: '93%', label: 'of family caregivers were never trained to perform a transfer safely.' },
      { big: '54%', label: 'of stroke-survivor caregivers go on to develop chronic lower back pain.' },
    ],
    fallShort: [
      { name: 'Mechanical hoists', desc: 'Bulky and costly, with difficult installation, often unrealistic for a home.' },
      { name: 'Slide sheets & boards', desc: 'Demand caregiver strength and skill, and usually need a second pair of hands.' },
      { name: 'Transfer chairs', desc: 'Bulky and non-foldable, built purely for transfer, not for daily use.' },
    ],
  },

  innovation: {
    eyebrow: 'How Chair Force helps',
    h2: 'One chair. Seamless and safe transfers. A lifetime of needs met.',
    body: 'Chair Force replaces the hoist, the slide board, and the separate transfer chair with one wheelchair that does the whole job: a powered lift, a swing-away armrest, and a seat that glides sideways on its own rails. It’s the same chair a person rides every day, and the thing that gets them safely onto a bed, a sofa, or a toilet, with one carer and no lifting.',
  },

  // Phase 1 — maps to mechanism-demo's own physics-validated PHASES sequence.
  // Downloads' step LABELS are reused (its step 4 says "Transfer and slide";
  // the engine's internal PHASES[3].name is "Lock and slide" — cosmetic only,
  // the engine constant is left alone).
  phase1: {
    eyebrow: 'Phase 1',
    h2: 'The transfer mechanism',
    steps: [
      { n: 1, title: 'Match the height', desc: 'The seat rises or drops to meet the bed, sofa, or toilet exactly.' },
      { n: 2, title: 'Open the side', desc: 'The armrest swings clear, removing the barrier.' },
      { n: 3, title: 'Bridge the divide', desc: 'Seat and backrest translate out on telescoping rails.' },
      { n: 4, title: 'Transfer and slide', desc: 'The user moves across, seated and level. One carer, no lifting.' },
    ],
  },

  // Phase 2 — 5 of Downloads' 6 pitched modules have real geometry in the
  // engine (cup/umbrella/storage/tray/ivpole via config/options.js's `acc`
  // list, built in engine/seat.js). Rehab arms do not — flagged as coming
  // soon, not hidden, not faked as working.
  phase2: {
    eyebrow: 'Phase 2',
    h2: 'A wheelchair that grows with the patient.',
    comingSoon: [
      { name: 'Rehab & therapy arms', desc: 'Arm trainer and exercise pedals for in-chair rehab sessions.' },
    ],
  },

  // Phase 3 — only the axes with real geometry in engine/wheels.js and
  // engine/seat.js. Downloads pitches more (frame material, footrest,
  // propulsion, tyre, rim, handrim, castor) — deliberately omitted, not
  // faked as clickable.
  phase3: {
    eyebrow: 'Phase 3',
    h2: 'Configure the chassis.',
  },

  summary: {
    eyebrow: 'Your Chair Force',
    h2: 'This is the chair you designed.',
  },

  purchase: {
    eyebrow: 'Get started',
    h2: 'Book your consultation',
    body: "We'll confirm fit and pricing in person, and help you apply for subsidy if you're eligible.",
    formFinePrint: 'Chair Force is in prototype development. This form is a front-end placeholder. Connect it to your email or CRM before launch.',
    subsidy: {
      label: 'Your estimated cost with SMF subsidy',
      note: 'SMF funds up to 90% of device cost.',
      eligibility: 'Singapore citizens aged 60 and above, with monthly per-capita household income of S$2,000 or less, or a residence with annual value below S$13,000. Persons with disabilities may instead apply through the Assistive Technology Fund (ATF).',
      caveat: 'Subsidy is capped per device type, so the actual amount may be lower than 90%.',
    },
    partners: ['SingHealth Community Hospitals', 'SingHealth', 'SingHealth Patient Advocacy Network', 'SG Enable', 'Enabling Village'],
    footer: 'Redefining safe transfers beyond the hospital. Team AxionCare.',
    footerNote: '© 2026 Chair Force · Team AxionCare. Concept preview, prototype in development. Pricing shown is indicative.',
  },
};
