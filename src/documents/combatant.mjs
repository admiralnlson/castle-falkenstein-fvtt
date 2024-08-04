import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinDefineSpell } from "../forms/define-spell.mjs";

/**
 * @extends {Combatant}
 */
export class CastleFalkensteinCombatant extends Combatant {

  // @override
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
    return this.update({initiative: game.actors.get(data?.actorId)?.perceptionAbility?.system.levelValue});
  }

  // @override
  get isNPC() {
    return !this.actor || !this.hasPlayerOwner;
    // TODO TBC
    return !this.hasPlayerOwner;
  }
}
