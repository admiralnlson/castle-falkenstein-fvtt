import { CASTLE_FALKENSTEIN } from "../config.mjs";

/**
 * @extends {Combatant}
 */
export class CastleFalkensteinCombatant extends Combatant {

  get #defaultInitiative() {
    // if the actor is not found or it does not have the perception ability, then default to Average (4)
    return this.actor?.perceptionAbility?.system.levelValue ?? CASTLE_FALKENSTEIN.abilityLevels.AV.value;
  }

  // @override
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
    return this.update({initiative: this.#defaultInitiative});
  }

  // @override
  getInitiativeRoll(formula) {
    return super.getInitiativeRoll(`${this.#defaultInitiative}`);
  }
}

