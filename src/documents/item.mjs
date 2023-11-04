import {CASTLE_FALKENSTEIN} from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * @extends {Item}
 */
export class CastleFalkensteinItem extends Item {

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   */
   getRollData() {
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   */
  async roll() {
     if (this.type == 'ability') {
      await this.actor?.performFeat(this);
    } else if (this.type == 'spell') {
      await this.actor?.defineSpell(this);
    } else {
      // default (other item types, if any)
      await this.showOthers();
    }
  }

  /**
   * Show the item in chat.
   */
  async showOthers() {

    let flavor = `[${game.i18n.localize('castle-falkenstein.item.showOthers')}`;
    let content = `${this.name}<hr/>`
                + `${this.system.description}`;

    // change label based on item type
    if (this.type == 'ability') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.ability.ability')}]`;
      content = CastleFalkenstein.abilityLevelAsSentenceHtml(this);
    } else if (this.type == 'weapon') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.weapon.weapon')}]`;
      content = `${this.name}<hr/>`
              + (this.system.effectiveRange == "" ? `` : `${game.i18n.localize("castle-falkenstein.weapon.effectiveRange")}: ${this.system.effectiveRange}<br/>`)
              + (this.system.ammunition == null && this.system.ammunition_max == null ? `` : `${game.i18n.localize("castle-falkenstein.weapon.ammunition")}: ${this.system.ammunition} / ${this.system.ammunition_max}<br/>`)
              + `${game.i18n.localize("castle-falkenstein.weapon.wounds")}: ${this.system.woundsPartial ?? 0} / ${this.system.woundsFull ?? 0} / ${this.system.woundsHigh ?? 0}<br/>`
              + `${this.system.description}`;
    } else if (this.type == 'possession') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.possession.possession')}]`;
      // default content
    } else if (this.type == 'spell') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.spell.spell')}]`;
      const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[this.system.suit];
      content = `${this.name} [<span class="suit-symbol-${this.system.suit}">${suitSymbol}</span>]<hr/>`
            + `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.system.level}<br/>`
            + `${this.system.description}`;
    } else {
      flavor += `]`;
      CastleFalkenstein.log.warn(`Attempting to 'show others' an item of type '${this.type}'`);
    }
 
     // Post message to chat
    CastleFalkenstein.createChatMessage(this.actor, flavor, content);
  }

}