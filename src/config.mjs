export const CASTLE_FALKENSTEIN = {};

/**
 * The set of Abilities  used within the system.
 * @type {Object}
 */
 CASTLE_FALKENSTEIN.abilityLevels = {
  PR: {
    full: "castle-falkenstein.ability.poor",
    abbr: "castle-falkenstein.ability.poorAbbr",
    value: 2
  },
  AV: {
    full: "castle-falkenstein.ability.average",
    abbr: "castle-falkenstein.ability.averageAbbr",
    value: 4
  },
  GD: {
    full: "castle-falkenstein.ability.good",
    abbr: "castle-falkenstein.ability.goodAbbr",
    value: 6
  },
  GR: {
    full: "castle-falkenstein.ability.great",
    abbr: "castle-falkenstein.ability.greatAbbr",
    value: 8
  },
  EXC: {
    full: "castle-falkenstein.ability.exceptional",
    abbr: "castle-falkenstein.ability.exceptionalAbbr",
    value: 10
  },
  EXT: {
    full: "castle-falkenstein.ability.extraordinary",
    abbr: "castle-falkenstein.ability.extraordinaryAbbr",
    value: 12
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


CASTLE_FALKENSTEIN.spellDefinitions = {};

function addSpellDefinitionLevels(type, minLevel, maxLevel=minLevel) {
  if (!CASTLE_FALKENSTEIN.spellDefinitions[type]) {
    CASTLE_FALKENSTEIN.spellDefinitions[type] = {
      label: `castle-falkenstein.spell.definition.${type}.label`,
      levels: {
        0: "-"
      }
    };
  }

  for(let level = minLevel; level <= maxLevel; ++level) {
    CASTLE_FALKENSTEIN.spellDefinitions[type].levels[`${level}`] = `castle-falkenstein.spell.definition.${type}.${level}`;
  }
}

addSpellDefinitionLevels("duration", 1, 4); addSpellDefinitionLevels("duration", 6, 8);
addSpellDefinitionLevels("complexity", 1, 6);
addSpellDefinitionLevels("range", 1, 7);
addSpellDefinitionLevels("nbSubjects", 1, 5);
addSpellDefinitionLevels("resistance", 1, 3); addSpellDefinitionLevels("resistance", 6); addSpellDefinitionLevels("resistance", 8); addSpellDefinitionLevels("resistance", 16);
addSpellDefinitionLevels("familiarity", 1, 4);
