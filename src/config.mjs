export const CASTLE_FALKENSTEIN = {};

/**
 * The set of Abilities  used within the system.
 * @type {Object}
 */
 CASTLE_FALKENSTEIN.abilityLevels = {
  PR: {
    full: "castle-falkenstein.ability.poor",
    abbr: "castle-falkenstein.ability.poorAbbr",
    value: 2,
    specialized: "AV"
  },
  AV: {
    full: "castle-falkenstein.ability.average",
    abbr: "castle-falkenstein.ability.averageAbbr",
    value: 4,
    specialized: "GD"
  },
  GD: {
    full: "castle-falkenstein.ability.good",
    abbr: "castle-falkenstein.ability.goodAbbr",
    value: 6,
    specialized: "GR"
  },
  GR: {
    full: "castle-falkenstein.ability.great",
    abbr: "castle-falkenstein.ability.greatAbbr",
    value: 8,
    specialized: "EXC"
  },
  EXC: {
    full: "castle-falkenstein.ability.exceptional",
    abbr: "castle-falkenstein.ability.exceptionalAbbr",
    value: 10,
    specialized: "EXT"
  },
  EXT: {
    full: "castle-falkenstein.ability.extraordinary",
    abbr: "castle-falkenstein.ability.extraordinaryAbbr",
    value: 12,
    specialized: "EXT" // specialization does not increase the level if it's already Extraordinary
  }
};

CASTLE_FALKENSTEIN.abilityFullLevels = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.abilityLevels).map(([key, level]) => [key, level.full]));


/**
 * The set of card suits used within the system.
 * @type {Object}
 */
 CASTLE_FALKENSTEIN.cardSuits = {
  "?": {
    name: "?",
    symbol: "-"
  },
  spades: {
    name: "castle-falkenstein.cards.spades",
    symbol: "♠"
  },
  hearts: {
    name: "castle-falkenstein.cards.hearts",
    symbol: "♥"
  },
  diamonds: {
    name: "castle-falkenstein.cards.diamonds",
    symbol: "♦"
  },
  clubs: {
    name: "castle-falkenstein.cards.clubs",
    symbol: "♣"
  }
};

CASTLE_FALKENSTEIN.cardSuitsSymbols = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.cardSuits).map(([key, value]) => [key, value.symbol]));
CASTLE_FALKENSTEIN.validNonJokerCardSuits = [ "spades", "hearts", "diamonds", "clubs" ];


CASTLE_FALKENSTEIN.spellDefinitions = {
  "duration": {
    "levels": {
      "-": { label: "-", energy : 0 },
      "a": { energy : 1 },
      "b": { energy : 2 },
      "c": { energy : 3 },
      "d": { energy : 4 },
      "e": { energy : 6 },
      "f": { energy : 7 },
      "g": { energy : 8 }
    }
  },
  "complexity": {
    "levels": {
      "-": { label: "-", energy : 0 },
      "a": { energy : 1 },
      "b": { energy : 2 },
      "c": { energy : 3 },
      "d": { energy : 4 },
      "e": { energy : 5 },
      "f": { energy : 6 }
    }
  },
  "range": {
    "levels": {
      "-": { label: "-", energy : 0 },
      "a": { energy : 1 },
      "b": { energy : 2 },
      "c": { energy : 3 },
      "d": { energy : 4 },
      "e": { energy : 5 },
      "f": { energy : 6 },
      "g": { energy : 7 },
    }
  },
  "nbSubjects": {
    "levels": {
      "-": { label: "-", energy : 0 },
      "a": { energy : 1 },
      "b": { energy : 2 },
      "c": { energy : 3 },
      "d": { energy : 4 },
      "e": { energy : 5 }
    }
  },
  "typeSubjects": {
    "levels": {
      "-": { label: "-", energy : 0 },
      "a": { energy : 1 },
      "b": { energy : 1 },
      "c": { energy : 2 },
      "d": { energy : 3 },
      "e": { energy : 6 },
      "f": { energy : 6 },
      "g": { energy : 8 },
      "h": { energy : 16 },
    }
  },
  "familiarity": {
    "levels": {
      "-": { label: "-", energy : 0 },
      "a": { energy : 1 },
      "b": { energy : 2 },
      "c": { energy : 3 },
      "d": { energy : 4 }
    }
  },
  "harmRank": {
    "levels": {
      "-": { energy : 0, label: "-" },
      "a": { energy : 2,  wounds: "1 / 2 / 3" },
      "b": { energy : 4,  wounds: "2 / 3 / 4" },
      "c": { energy : 8,  wounds: "3 / 4 / 5" },
      "d": { energy : 12, wounds: "4 / 5 / 7" },
      "e": { energy : 16, wounds: "7 / 8 / 9" },
      "f": { energy : 20, wounds: "8 / 9 / 10" }
    }
  }
};

for(const type in CASTLE_FALKENSTEIN.spellDefinitions) {
  CASTLE_FALKENSTEIN.spellDefinitions[type].label = `castle-falkenstein.spell.definition.${type}.label`;

  for (let level in CASTLE_FALKENSTEIN.spellDefinitions[type].levels) {
    if (level !== "-")
      CASTLE_FALKENSTEIN.spellDefinitions[type].levels[level].label = `castle-falkenstein.spell.definition.${type}.${level}`;
  }
}

CASTLE_FALKENSTEIN.weaponConceals = {
  "-": {
    labelAbbr: "castle-falkenstein.empty",
    label: "-"
  },
  "P": {
    labelAbbr: "castle-falkenstein.weapon.concealPocketAbbr",
    label: "castle-falkenstein.weapon.concealPocket"
  },
  "J": {
    labelAbbr: "castle-falkenstein.weapon.concealJacketAbbr",
    label: "castle-falkenstein.weapon.concealJacket"
  },
  "L": {
    labelAbbr: "castle-falkenstein.weapon.concealLongCoatAbbr",
    label: "castle-falkenstein.weapon.concealLongCoat"
  },
  "N": {
    labelAbbr:"castle-falkenstein.weapon.concealNotAbbr",
    label: "castle-falkenstein.weapon.concealNot"
  }
};