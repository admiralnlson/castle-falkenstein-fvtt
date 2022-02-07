import {CASTLE_FALKENSTEIN} from "../helpers/config.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
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
   * @private
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
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this.data;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    let flavor = `[${item.type}]`;
    let content = `${item.name}<hr/>`
                + `${item.data.description}`;

    // change label based on item type
    if (item.type == 'ability') {
      flavor = `[${game.i18n.localize("CASTLE_FALKENSTEIN.Ability")}]`;
      const levelI18nKey = CASTLE_FALKENSTEIN.abilityLevels[item.data.level].full;
      const levelValue = CASTLE_FALKENSTEIN.abilityLevels[item.data.level].value;
      const suitSymbol = CASTLE_FALKENSTEIN.cardSuits[item.data.suit].symbol;
      const suitColor = CASTLE_FALKENSTEIN.cardSuits[item.data.suit].color;
      content = `${game.i18n.localize("CASTLE_FALKENSTEIN.AbilityLevelInSentence")}${game.i18n.localize(levelI18nKey)} `
              + `[${levelValue}] `
              + `${game.i18n.localize("CASTLE_FALKENSTEIN.AbilityNameInSentence")}${item.name} `
              + `[<span style="color:${suitColor}">${suitSymbol}</span>].`;
    } else if (item.type == 'possession') {
      flavor = `[${game.i18n.localize("CASTLE_FALKENSTEIN.Possession")}]`;
      // default content
    } else if (item.type == 'spell') {
      flavor = `[${game.i18n.localize("CASTLE_FALKENSTEIN.Spell")}]`;
      const suitSymbol = CASTLE_FALKENSTEIN.cardSuits[item.data.suit].symbol;
      const suitColor = CASTLE_FALKENSTEIN.cardSuits[item.data.suit].color;
      content = `${item.name} [<span style="color:${suitColor}">${suitSymbol}</span>]<hr/>`
            + `${game.i18n.localize("CASTLE_FALKENSTEIN.SpellThaumicLevel")}: ${item.data.level}<br/>`
            + `${item.data.description}`;
    } else {
      // default flavor & content
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
