export const CASTLE_FALKENSTEIN = {};

/**
 * The set of Abilities  used within the sytem.
 * @type {Object}
 */
 CASTLE_FALKENSTEIN.abilityLevels = {
  "PR": {
    "full": "castle-falkenstein.ability.poor",
    "abbr": "castle-falkenstein.ability.poorAbbr",
    "value": 2
  },
  "AV": {
    "full": "castle-falkenstein.ability.average",
    "abbr": "castle-falkenstein.ability.averageAbbr",
    "value": 4
  },
  "GD": {
    "full": "castle-falkenstein.ability.good",
    "abbr": "castle-falkenstein.ability.goodAbbr",
    "value": 6
  },
  "GR": {
    "full": "castle-falkenstein.ability.great",
    "abbr": "castle-falkenstein.ability.greatAbbr",
    "value": 8
  },
  "EXC": {
    "full": "castle-falkenstein.ability.exceptional",
    "abbr": "castle-falkenstein.ability.exceptionalAbbr",
    "value": 10
  },
  "EXT": {
    "full": "castle-falkenstein.ability.extraordinary",
    "abbr": "castle-falkenstein.ability.extraordinaryAbbr",
    "value": 12
  }
};

CASTLE_FALKENSTEIN.abilityFullLevels = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.abilityLevels).map(([key, level]) => [key, level.full]));
CASTLE_FALKENSTEIN.abilityAbbrLevels = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.abilityLevels).map(([key, level]) => [key, level.abbr]));
CASTLE_FALKENSTEIN.abilityValues = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.abilityLevels).map(([key, level]) => [key, level.value]));


/**
 * The set of card suits used within the sytem.
 * @type {Object}
 */
 CASTLE_FALKENSTEIN.cardSuits = {
  "?": {
    "name": "?",
    "fortuneDeckDescription": "?",
    "symbol": "&nbsp;?" // unmapped in "cf cards" font
  },
  "spades": {
    "name": "castle-falkenstein.cards.spades",
    "fortuneDeckDescription": "castle-falkenstein.cards.spadesFortuneDeckDescription",
    "symbol": "'" // as defined in "cf cards" font
  },
  "hearts": {
    "name": "castle-falkenstein.cards.hearts",
    "fortuneDeckDescription": "castle-falkenstein.cards.heartsFortuneDeckDescription",
    "symbol": "("  // as defined in "cf cards" font
  },
  "diamonds": {
    "name": "castle-falkenstein.cards.diamonds",
    "fortuneDeckDescription": "castle-falkenstein.cards.diamondsFortuneDeckDescription",
    "symbol": ")"  // as defined in "cf cards" font
  },
  "clubs": {
    "name": "castle-falkenstein.cards.clubs",
    "fortuneDeckDescription": "castle-falkenstein.cards.clubsFortuneDeckDescription",
    "symbol": "*"  // as defined in "cf cards" font
  }
};

CASTLE_FALKENSTEIN.cardSuitsSymbols = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.cardSuits).map(([key, value]) => [key, value.symbol]));
