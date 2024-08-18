import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CASTLE_FALKENSTEIN } from "../config.mjs";

/**
 * @extends {Cards}
 */
export class CastleFalkensteinCards extends Cards {

  // "featBeingPerformed" flag object structure = {
  //    actorId:     <(string) id of the actor performing the feat (important because the Host Fortune Hand is used for all Host characters)>,
  //    actorItemId: <(string) id of the ability item within the actor>,
  //    divorceSuit: <(string) ability.system.suit or other suit chosen>
  //  }

  
  static onPassCards(from, to, { toCreate }) {

    const fromType =  from.getFlag(CastleFalkenstein.id, "type");
    const toType = to.getFlag(CastleFalkenstein.id, "type");

    if (fromType !== toType) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.mismatchingCardTypeInDrop"));
      return false;
    }

    // unless 'to' is empty, in which case we might as well keep the default sort from 'from'
    if (to.cards.contents.length > 0) {
      // ensure passed cards are added "at the end"
      let maxSort = Math.max.apply(Math, to.cards.contents.map(c => c.sort));
      for (const card of toCreate) {
        card.sort = (maxSort += CONST.SORT_INTEGER_DENSITY);
      }
    }
    return true;
  }

  async startPerformingFeat(actor, ability) {
    await this.unsetFlag(CastleFalkenstein.id, "featBeingPerformed");
    const featBeingPerformed = {
      actorId: actor.id,
      actorItemId: ability.id,
      divorceSuit: ability.system.suit
    };
    await this.setFlag(CastleFalkenstein.id, "featBeingPerformed", featBeingPerformed);
    
    this.sheet.render(true);
  }

  get featBeingPerformed() {
    let featBeingPerformed = this.getFlag(CastleFalkenstein.id, "featBeingPerformed");
    if (featBeingPerformed) {
      featBeingPerformed.actor = game.actors.get(featBeingPerformed.actorId);
      featBeingPerformed.ability = featBeingPerformed.actor?.items.get(featBeingPerformed.actorItemId);
    }

    if (featBeingPerformed && !featBeingPerformed.ability) {
      this.stopPerformingFeat();
      return;
    }

    return featBeingPerformed;
  }

  isCorrectFeatSuit(card) {
    return (card.suit === "joker" ||
            (CastleFalkenstein.settings.divorceVariation !== CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.disabled
             ? (card.suit === this.featBeingPerformed?.divorceSuit)
             : (card.suit === this.featBeingPerformed?.ability.system.suit)));
  }

  isDivorceUsed() {
    return this.featBeingPerformed?.divorceSuit !== this.featBeingPerformed?.ability.system.suit;
  }

  computeFeatTotal() {
    let total = CASTLE_FALKENSTEIN.abilityLevels[this.featBeingPerformed?.ability.system.level].value;

    for (const card of this.cards) {
      if (card.getFlag(CastleFalkenstein.id, "selected")) {
        if (this.isCorrectFeatSuit(card)) {
          if (this.isDivorceUsed() &&
              card.suit === this.featBeingPerformed?.divorceSuit &&
              CastleFalkenstein.settings.divorceVariation === CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.halfValue)
            total += Math.floor(card.value / 2);
          else
            total += card.value;
        } else {
          if (CastleFalkenstein.settings.halfOffVariation === CastleFalkenstein.HALF_OFF_VARIATION_OPTIONS.option1) {
            // always half-off
            total += Math.floor(card.value / 2);
          } else if (CastleFalkenstein.settings.halfOffVariation === CastleFalkenstein.HALF_OFF_VARIATION_OPTIONS.option2) {
            // Decision taken (b/c it's more natural):
            // In case Divorce is used, color-matching is based on the selected suit, not the original one from the Ability.
            const referenceSuit = this.isDivorceUsed() ? this.featBeingPerformed?.divorceSuit : this.featBeingPerformed?.ability.system.suit;

            if (card.suit === "spades"   && referenceSuit === "clubs"    ||
                card.suit === "clubs"    && referenceSuit === "spades"   ||
                card.suit === "hearts"   && referenceSuit === "diamonds" ||
                card.suit === "diamonds" && referenceSuit === "hearts") {
              // same color
              total += Math.floor(card.value / 2);
            } else {
              // different color
              total += 1;
            }
          } else {
            // half-off variation not used
            total += 1;
          }
        }
      }
    }

    return total;
  }

  // "spellBeingCast" flag object structure = {
  //    actorItemId: <id of the spell item within the actor>,
  //    sorceryAbilityId: "<id of the sorcery ability item within the actor>"
  //    definitionLevels: {
  //      duration: "[-a-z]",
  //      complexity: "[-a-z]",
  //      range: "[-a-z]",
  //      nbSubjects: "[-a-z]",
  //      typeSubjects: "[-a-z]",
  //      famiiliarity: "[-a-z]",
  //      harmRank: "[-a-z]"
  //    },
  //    customModifier: { label: "<label>", value: <value> },
  //    isWildSpell: <true/false>,
  //    harmonics: [ "<spades", "<hearts" ]
  //    usesThaumixology: <true/false>
  //  }
  
  static computeTotalPowerNeed(actor, spellBeingCast) {
    const spell = actor.items.get(spellBeingCast.actorItemId);
    let total = spell.system.level;
    total -= CASTLE_FALKENSTEIN.abilityLevels[actor.items.get(spellBeingCast.sorceryAbilityId).system.level].value;

    for (const [key, value] of Object.entries(spellBeingCast.definitionLevels)) {
      total += CASTLE_FALKENSTEIN.spellDefinitions[key].levels[value].energy;
    }

    total += isNaN(spellBeingCast.customModifier.value) ? 0 : spellBeingCast.customModifier.value;

    return total > 0 ? total : 0;
  }

  get spellBeingCast() {
    const spellBeingCast = this.getFlag(CastleFalkenstein.id, "spellBeingCast");
    if (spellBeingCast) {
      const actorId = this.getFlag(CastleFalkenstein.id, "actor");
      spellBeingCast.actor = game.actors.get(actorId);
      spellBeingCast.spell = spellBeingCast.actor.items.get(spellBeingCast.actorItemId);
      spellBeingCast.powerNeed = CastleFalkensteinCards.computeTotalPowerNeed(spellBeingCast.actor, spellBeingCast);
      spellBeingCast.powerGathered = 0;
      spellBeingCast.isWildSpell = false;
      spellBeingCast.harmonics = [];
      let maxHarmonicValue = 0;
      for (const card of this.cards) {
        if (card.suit === "joker") {
          spellBeingCast.isWildSpell = true;
          spellBeingCast.harmonics = [];
          spellBeingCast.powerGathered = "∞";
          break;
        } else {
          if (card.suit === spellBeingCast.spell.system.suit)
            spellBeingCast.powerGathered += card.value;
          else {
            spellBeingCast.powerGathered += 1;
            
            if (card.value > maxHarmonicValue) {
              spellBeingCast.harmonics = [ card.suit ];
              maxHarmonicValue = card.value;
            } else if (card.value === maxHarmonicValue) {
              spellBeingCast.harmonics.push(card.suit);
            }
          }
        }
      }

      if (spellBeingCast.harmonics.length === 0) {
        delete spellBeingCast.harmonics;
      } else if (spellBeingCast.usesThaumixology) {
        // already added 1 point above for it
        spellBeingCast.powerGathered += Math.floor(maxHarmonicValue / 2) - 1;
      }
    }

    return spellBeingCast;
  }

  async startCasting(spellBeingCast) {
    await this.unsetFlag(CastleFalkenstein.id, "spellBeingCast");
    await this.setFlag(CastleFalkenstein.id, "spellBeingCast", spellBeingCast);
    this.sheet.render(true);
  }

  async stopPerformingFeat() {
    await this.unsetFlag(CastleFalkenstein.id, "featBeingPerformed");
  }

  async stopCasting() {
    await this.unsetFlag(CastleFalkenstein.id, "spellBeingCast");
  }

}
