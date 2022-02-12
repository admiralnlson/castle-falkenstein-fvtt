export const CASTLE_FALKENSTEIN = {};

/**
 * The set of Abilities  used within the sytem.
 * @type {Object}
 */
 CASTLE_FALKENSTEIN.abilityLevels = {
  "PR": {
    "full": "castle-falkenstein.abilityPoor",
    "abbr": "castle-falkenstein.abilityPoorAbbr",
    "value": 2
  },
  "AV": {
    "full": "castle-falkenstein.abilityAverage",
    "abbr": "castle-falkenstein.abilityAverageAbbr",
    "value": 4
  },
  "GD": {
    "full": "castle-falkenstein.abilityGood",
    "abbr": "castle-falkenstein.abilityGoodAbbr",
    "value": 6
  },
  "GR": {
    "full": "castle-falkenstein.abilityGreat",
    "abbr": "castle-falkenstein.abilityGreatAbbr",
    "value": 8
  },
  "EXC": {
    "full": "castle-falkenstein.abilityExceptional",
    "abbr": "castle-falkenstein.abilityExceptionalAbbr",
    "value": 10
  },
  "EXT": {
    "full": "castle-falkenstein.abilityExtraordinary",
    "abbr": "castle-falkenstein.abilityExtraordinaryAbbr",
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
    "symbol": "?"
  },
  "spades": {
    "name": "castle-falkenstein.cards.spades",
    "fortuneDeckDescription": "castle-falkenstein.cards.spadesFortuneDeckDescription",
    "symbol": "♤"
  },
  "hearts": {
    "name": "castle-falkenstein.cards.hearts",
    "fortuneDeckDescription": "castle-falkenstein.cards.heartsFortuneDeckDescription",
    "symbol": "♡"
  },
  "diamonds": {
    "name": "castle-falkenstein.cards.diamonds",
    "fortuneDeckDescription": "castle-falkenstein.cards.diamondsFortuneDeckDescription",
    "symbol": "♢"
  },
  "clubs": {
    "name": "castle-falkenstein.cards.clubs",
    "fortuneDeckDescription": "castle-falkenstein.cards.clubsFortuneDeckDescription",
    "symbol": "♧"
  }
};

CASTLE_FALKENSTEIN.cardSuitsSymbols = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.cardSuits).map(([key, value]) => [key, value.symbol]));
