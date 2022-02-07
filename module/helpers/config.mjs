export const CASTLE_FALKENSTEIN = {};

/**
 * The set of Abilities  used within the sytem.
 * @type {Object}
 */
CASTLE_FALKENSTEIN.abilityLevels = {
  "PR": {
    "full": "CASTLE_FALKENSTEIN.AbilityPoor",
    "abbr": "CASTLE_FALKENSTEIN.AbilityPoorAbbr",
    "value": 2
  },
  "AV": {
    "full": "CASTLE_FALKENSTEIN.AbilityAverage",
    "abbr": "CASTLE_FALKENSTEIN.AbilityAverageAbbr",
    "value": 4
  },
  "GD": {
    "full": "CASTLE_FALKENSTEIN.AbilityGood",
    "abbr": "CASTLE_FALKENSTEIN.AbilityGoodAbbr",
    "value": 6
  },
  "GR": {
    "full": "CASTLE_FALKENSTEIN.AbilityGreat",
    "abbr": "CASTLE_FALKENSTEIN.AbilityGreatAbbr",
    "value": 8
  },
  "EXC": {
    "full": "CASTLE_FALKENSTEIN.AbilityExceptional",
    "abbr": "CASTLE_FALKENSTEIN.AbilityExceptionalAbbr",
    "value": 10
  },
  "EXT": {
    "full": "CASTLE_FALKENSTEIN.AbilityExtraordinary",
    "abbr": "CASTLE_FALKENSTEIN.AbilityExtraordinaryAbbr",
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
    "name": "CASTLE_FALKENSTEIN.Unset",
    "fortuneDeckDescription": "?",
    "symbol": "?",
    "color": "gray"
  },
  "spades": {
    "name": "CASTLE_FALKENSTEIN.Spades",
    "fortuneDeckDescription": "CASTLE_FALKENSTEIN.SpadesFortuneDeckDescription",
    "symbol": "♠",
    "color": "black"
  },
  "hearts": {
    "name": "CASTLE_FALKENSTEIN.Hearts",
    "fortuneDeckDescription": "CASTLE_FALKENSTEIN.HeartsFortuneDeckDescription",
    "symbol": "♥",
    "color": "red"
  },
  "diamonds": {
    "name": "CASTLE_FALKENSTEIN.Diamonds",
    "fortuneDeckDescription": "CASTLE_FALKENSTEIN.DiamondsFortuneDeckDescription",
    "symbol": "♦",
    "color": "red"
  },
  "clubs": {
    "name": "CASTLE_FALKENSTEIN.Clubs",
    "fortuneDeckDescription": "CASTLE_FALKENSTEIN.ClubsFortuneDeckDescription",
    "symbol": "♣",
    "color": "black"
  }
};

CASTLE_FALKENSTEIN.cardSuitSymbols = Object.fromEntries(Object.entries(CASTLE_FALKENSTEIN.cardSuits).map(([key, value]) => [key, value.symbol]));
