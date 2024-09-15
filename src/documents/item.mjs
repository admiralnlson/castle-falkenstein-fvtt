import { CASTLE_FALKENSTEIN } from "../config.mjs";
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

  async _preCreate(data, options, user) {
    let img;
    if (data.type === "ability" || data.type === "spell")
      img = `systems/castle-falkenstein/src/cards/suits.svg`;
    else if (data.type === "weapon")
      img = `systems/castle-falkenstein/src/img/saber-and-pistol.png`;
    else if (data.type === "possession")
      img = `icons/svg/item-bag.svg`;

    if (img)
      this.updateSource({img: img});

    await super._preCreate(data, options, user);
  }

  async _onUpdate(changed, options, user) {

    await super._onUpdate(changed, options, user);

    if (!changed.img && game.user.id === user && (this.type === "ability" || this.type === "spell") &&
        [`systems/castle-falkenstein/src/cards/suits.svg`,
         `systems/castle-falkenstein/src/cards/spades.svg`,
         `systems/castle-falkenstein/src/cards/hearts.svg`,
         `systems/castle-falkenstein/src/cards/diamonds.svg`,
         `systems/castle-falkenstein/src/cards/clubs.svg`].includes(this.img)) {
      const newSuitStr = this.system.suit === "?" ? "suits" : this.system.suit;
      const targetImg = `systems/castle-falkenstein/src/cards/${newSuitStr}.svg`
      if (this.img !== targetImg)
        await this.update({img: targetImg});
    }
  }

  get rollType() {
    const ret = {};

    if (this.type === "ability") {
      ret.i18nLabel = `[${game.i18n.localize("castle-falkenstein.feat.perform")}]`;
      ret.rollFunc = (item) => item.actor?.performFeat(item);
    } else if (this.type === "spell") {
      ret.i18nLabel = `[${game.i18n.localize("castle-falkenstein.sorcery.defineSpell")}]`;
      ret.rollFunc = (item) => item.actor?.defineSpell(item);
    } else { // other item types
      ret.i18nLabel = `[${game.i18n.localize("castle-falkenstein.item.sendToChat")}]`;
      ret.rollFunc = (item) => item.sendToChat();
    }

    return ret;
  }

  /**
   * Handle rolls.
   */
  async roll() {
    await this.rollType.rollFunc(this);
  }

  /**
   * Show the item in chat.
   */
  async sendToChat() {

    let flavor = `[${game.i18n.localize("castle-falkenstein.item.sendToChat")}`;
    let content = `<b>${this.name}</b>`;

    // change label based on item type
    if (this.type === "ability") {
      flavor += ` - ${game.i18n.localize("castle-falkenstein.ability.ability")}]`;
      // replace the default name with a name + level as a sentence
      content = `<b>${CastleFalkenstein.abilityLevelAsSentenceHtml(this)}</b>`;
    } else if (this.type === "weapon") {
      flavor += ` - ${game.i18n.localize("castle-falkenstein.weapon.weapon")}]`;
      // carriage return
      content += `<br/>`;
      // range label : effective value / max value
      if (this.system.effectiveRange !== null || this.system.maxRange !== null) {
        content += `${game.i18n.localize("castle-falkenstein.weapon.range")}: ${this.system.effectiveRange || "-"}`;
        if (this.system.maxRange !== null)
          content += ` / ${this.system.maxRange || "-"}`;
        content += `<br\/>`;
      }
      // ammo label : current ammo / max ammo
      if (this.system.ammunition !== null || this.system.ammunition_max !== null) {
        content += `${game.i18n.localize("castle-falkenstein.weapon.ammunition")}: ${this.system.ammunition || "-"}`;
        if (this.system.ammunition_max !== null)
          content += ` / ${this.system.ammunition_max}`;
        content += `<br\/>`;
      }
      // conceal
      content += `${game.i18n.localize("castle-falkenstein.weapon.conceal")}: ${game.i18n.localize(CASTLE_FALKENSTEIN.weaponConceals[this.system.conceal].label)}<br/>`;
      // wounds label : partial / full / high
      if (CastleFalkenstein.settings.damageSystem !== CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.harmRank)
        content += `${game.i18n.localize("castle-falkenstein.weapon.wounds")}: ${this.system.woundsPartial || "-"} / ${this.system.woundsFull || "-"} / ${this.system.woundsHigh || "-"}<br/>`;
      // harm rank
      if (CastleFalkenstein.settings.damageSystem !== CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.wounds)
        content += `${game.i18n.localize("castle-falkenstein.weapon.harmRank")}: ${this.system.harmRank}<br/>`;
    } else if (this.type === "possession") {
      flavor += ` - ${game.i18n.localize("castle-falkenstein.possession.possession")}]`;
      // default content (name)
    } else if (this.type === "spell") {
      flavor += ` - ${game.i18n.localize("castle-falkenstein.spell.spell")}]`;
      // name
      content    // aspect, on the same line as the name
              += ` <b>${CastleFalkenstein.cardSuitHTML(this.system.suit)}</b>`
                 // carriage return
               + "<br/>"
                 // thaumic level label & value
               + `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.system.level}<br/>`;
    } else {
      flavor += `]`;
      CastleFalkenstein.log.warn(`[Function not supported] Attempting to 'show in chat' an item of type '${this.type}'`);
      // default content (name)
    }

    if (this.system.description)
      content += `<hr/>`
                 + `${this.system.description}`;
 
     // Post message to chat
    CastleFalkenstein.createChatMessage(this.actor, flavor, content);
  }
}