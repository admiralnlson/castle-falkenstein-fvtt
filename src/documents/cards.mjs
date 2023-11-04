import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CASTLE_FALKENSTEIN } from "../config.mjs";

/**
 * @extends {Cards}
 */
export class CastleFalkensteinCards extends Cards {

  // "spellBeingCast" flag object structure = {
  //    actorItemId: <id of the spell item within the actor>,
  //    sorceryAbilityId: "<id of the sorcery ability item within the actor>"
  //    definitions: {
  //      duration: "[a-z]",
  //      complexity: "[a-z]",
  //      range: "[a-z]",
  //      nbSubjects: "[a-z]",
  //      typeSubjects: "[a-z]",
  //      famiiliarity: "[a-z]",
  //      harmRank: "[a-z]"
  //    },
  //    customModifier: { label: "<label>", value: <value> }
  //  }

  static computeTotalPowerNeed(actorObject, spellBeingCast) {
    const spellObject = actorObject.items.get(spellBeingCast.actorItemId);
    let total = spellObject.system.level;
    total -= CASTLE_FALKENSTEIN.abilityLevels[actorObject.items.get(spellBeingCast.sorceryAbilityId).system.level].value;

    for (const [key, value] of Object.entries(spellBeingCast.definitionLevels)) {
      total += CASTLE_FALKENSTEIN.spellDefinitions[key].levels[value].value;
    }

    total += spellBeingCast.customModifier.value;

    return total > 0 ? total : 0;
  }

  get spellBeingCast() {
    const spellBeingCast = this.getFlag(CastleFalkenstein.id, "spellBeingCast");
    if (spellBeingCast) {
      const actorId = this.getFlag(CastleFalkenstein.id, "actor");
      spellBeingCast.actorObject = game.actors.get(actorId);
      spellBeingCast.spellObject = spellBeingCast.actorObject.items.get(spellBeingCast.actorItemId);
      spellBeingCast.powerNeed = CastleFalkensteinCards.computeTotalPowerNeed(spellBeingCast.actorObject, spellBeingCast);
      spellBeingCast.powerGathered = 0;
      spellBeingCast.jokerDrawn = false;
      for (const card of this.cards) {
        if (card.suit == "joker") {
          spellBeingCast.jokerDrawn = true;
          spellBeingCast.powerGathered = spellBeingCast.powerNeed;
          break;
        } else {
          spellBeingCast.powerGathered += (card.suit == spellBeingCast.spellObject.system.suit ? card.value : 1);
        }
      }
    }
    return spellBeingCast;
  }

  async defineSpell(spellBeingCast) {
    await this.unsetFlag(CastleFalkenstein.id, 'spellBeingCast');
    await this.setFlag(CastleFalkenstein.id, 'spellBeingCast', spellBeingCast);
    this.sheet.render(true);
  }

  async stopCasting() {
    await this.unsetFlag(CastleFalkenstein.id, 'spellBeingCast');
    this.sheet.render();
  }

}
