// Configurator option data. Every option here has real, working geometry in
// engine/wheels.js or engine/seat.js — this file intentionally does NOT
// include Downloads/index.html's extra axes (frame material, footrest,
// propulsion, tyre, rim, handrim, castor) since none of those have a
// modeled variant.
export const CFG = {
  wheel: [
    ['standard', 'Standard 24"', 'Indoor and pavement. Fitted as base.'],
    ['terrain', 'All-terrain', 'Wider knobby tyres. Fewer jolts on rough ground.'],
    ['powered', 'Powered hub', 'Motorised rear hubs for users who tire quickly.'],
  ],
  seat: [
    ['standard', 'Standard 386 mm', 'The measured prototype width.'],
    ['wide', 'Wide 460 mm', 'For larger users or long sitting hours.'],
    ['contour', 'Contoured', 'Bolstered pressure-relief cushion with side support.'],
  ],
  back: [
    ['standard', 'Standard', '470 mm. Fitted as base.'],
    ['high', 'High back + headrest', 'Head and neck support for weaker trunk control.'],
    ['recline', 'Reclining', 'Gas-strut recline for pressure relief through the day.'],
  ],
  acc: [
    ['cup', 'Cup holder', 'Keeps a drink in reach without balancing it on the lap.'],
    ['umbrella', 'Umbrella mount', 'Sun and rain cover, hands free.'],
    ['storage', 'Rear storage bag', 'Bags and belongings off the lap.'],
    ['tray', 'Tray table', 'Eating, reading and working from the chair.'],
    ['ivpole', 'IV pole & oxygen holder', 'Built for higher-dependency users who need medical equipment close by.'],
  ],
};
