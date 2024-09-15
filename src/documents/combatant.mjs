import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * @extends {Combatant}
 */
export class CastleFalkensteinCombatant extends Combatant {

  get #defaultInitiative() {
    if (!this.actor)
      return;

    // if the actor does not have the perception ability, then display a warning notif and default to Average (4)
    const ability = this.actor.perceptionAbility;
    if (!ability) {
      if (this.actor.isToken) {
        CastleFalkenstein.notif.warn(game.i18n.format("castle-falkenstein.notifications.tokenDoesNotHaveAbility", {
          token: this.actor.parent.name,
          ability: CastleFalkenstein.i18nAbility("perception")
        }));
      } else {
        CastleFalkenstein.notif.warn(game.i18n.format("castle-falkenstein.notifications.characterDoesNotHaveAbility", {
          character: this.actor.name,
          ability: CastleFalkenstein.i18nAbility("perception")
        }));
      }
    }
    return ability?.system.levelValue ?? CASTLE_FALKENSTEIN.abilityLevels.AV.value;
  }

  /** @override */
  async _onCreate(data, options, userId) {
    let ret = await super._onCreate(data, options, userId);

    if (game.user.id === userId) {
      ret = this.update({initiative: this.#defaultInitiative});
    }

    return ret;
  }

  /** @override */
  getInitiativeRoll(formula) {
    return super.getInitiativeRoll(`${this.#defaultInitiative}`);
  }
}

