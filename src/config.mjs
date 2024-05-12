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
CASTLE_FALKENSTEIN.abilityAbbrLevels = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.abilityLevels).map(([key, level]) => [key, level.abbr]));
CASTLE_FALKENSTEIN.abilityValues = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.abilityLevels).map(([key, level]) => [key, level.value]));


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
      "-": { label: "-", value : 0 },
      "a": { value : 1 },
      "b": { value : 2 },
      "c": { value : 3 },
      "d": { value : 4 },
      "e": { value : 6 },
      "f": { value : 7 },
      "g": { value : 8 }
    }
  },
  "complexity": {
    "levels": {
      "-": { label: "-", value : 0 },
      "a": { value : 1 },
      "b": { value : 2 },
      "c": { value : 3 },
      "d": { value : 4 },
      "e": { value : 5 },
      "f": { value : 6 }
    }
  },
  "range": {
    "levels": {
      "-": { label: "-", value : 0 },
      "a": { value : 1 },
      "b": { value : 2 },
      "c": { value : 3 },
      "d": { value : 4 },
      "e": { value : 5 },
      "f": { value : 6 },
      "g": { value : 7 },
    }
  },
  "nbSubjects": {
    "levels": {
      "-": { label: "-", value : 0 },
      "a": { value : 1 },
      "b": { value : 2 },
      "c": { value : 3 },
      "d": { value : 4 },
      "e": { value : 5 }
    }
  },
  "typeSubjects": {
    "levels": {
      "-": { label: "-", value : 0 },
      "a": { value : 1 },
      "b": { value : 1 },
      "c": { value : 2 },
      "d": { value : 3 },
      "e": { value : 6 },
      "f": { value : 6 },
      "g": { value : 8 },
      "h": { value : 16 },
    }
  },
  "familiarity": {
    "levels": {
      "-": { label: "-", value : 0 },
      "a": { value : 1 },
      "b": { value : 2 },
      "c": { value : 3 },
      "d": { value : 4 }
    }
  },
  "harmRank": {
    "levels": {
      "-": { value : 0, label: "-" },
      "a": { value : 2,  wounds: "1 / 2 / 3" },
      "b": { value : 4,  wounds: "2 / 3 / 4" },
      "c": { value : 8,  wounds: "3 / 4 / 5" },
      "d": { value : 12, wounds: "4 / 5 / 7" },
      "e": { value : 16, wounds: "7 / 8 / 9" },
      "f": { value : 20, wounds: "8 / 9 / 10" }
    }
  }
};


for(const type in CASTLE_FALKENSTEIN.spellDefinitions) {
  CASTLE_FALKENSTEIN.spellDefinitions[type].label = `castle-falkenstein.spell.definition.${type}.label`;

  for (let level in CASTLE_FALKENSTEIN.spellDefinitions[type].levels) {
    if (level != "-")
      CASTLE_FALKENSTEIN.spellDefinitions[type].levels[level].label = `castle-falkenstein.spell.definition.${type}.${level}`;
  }
}

// home-made Variation on the Great Game used by @admiralnlson's table. Will test it further before proposing it as an option in this FVTT system.
CASTLE_FALKENSTEIN.SHOW_THAUMIXOLOGY_VARIATION = false;
