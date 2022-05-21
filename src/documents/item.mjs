import {CASTLE_FALKENSTEIN} from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 */
export class CastleFalkensteinItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.data.data);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   */
  async roll() {
    const itemData = this.data;

    if (itemData.type == 'ability') {
      await this.actor?.performFeat(this);
    } else if (itemData.type == 'spell') {
      await this.actor?.defineSpell(this);
    } else {
      // default (other item types, if any)
      await showOthers();
    }
  }

  /**
   * Show the item in chat.
   */
  async showOthers() {
    const itemData = this.data;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    let flavor = `[${game.i18n.localize('castle-falkenstein.item.showOthers')}`;
    let content = `${itemData.name}<hr/>`
                + `${itemData.data.description}`;

    // change label based on item type
    if (itemData.type == 'ability') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.ability.ability')}]`;
      content = CastleFalkenstein.abilityLevelAsSentenceHtml(this);
    } else if (itemData.type == 'weapon') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.weapon.weapon')}]`;
      content = `${itemData.name}<hr/>`
              + (itemData.data.effectiveRange == "" ? `` : `${game.i18n.localize("castle-falkenstein.weapon.effectiveRange")}: ${itemData.data.effectiveRange}<br/>`)
              + (itemData.data.ammunition == null && itemData.data.ammunition_max == null ? `` : `${game.i18n.localize("castle-falkenstein.weapon.ammunition")}: ${itemData.data.ammunition} / ${itemData.data.ammunition_max}<br/>`)
              + `${game.i18n.localize("castle-falkenstein.weapon.wounds")}: ${itemData.data.woundsPartial ?? 0} / ${itemData.data.woundsFull ?? 0} / ${itemData.data.woundsHigh ?? 0}<br/>`
              + `${itemData.data.description}`;
    } else if (itemData.type == 'possession') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.possession.possession')}]`;
      // default content
    } else if (itemData.type == 'spell') {
      flavor += ` - ${game.i18n.localize('castle-falkenstein.spell.spell')}]`;
      const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[itemData.data.suit];
      content = `${itemData.name} [<span class="suit-symbol-${itemData.data.suit}">${suitSymbol}</span>]<hr/>`
            + `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${itemData.data.level}<br/>`
            + `${itemData.data.description}`;
    } else {
      flavor += `]`;
      CastleFalkenstein.consoleWarn(`Attempting to 'show others' an item of type '${itemData.type}'`);
    }
 
     // Post message to chat
    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: flavor,
      content: content
    });
  }

}