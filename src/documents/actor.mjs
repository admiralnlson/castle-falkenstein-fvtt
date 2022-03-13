import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";
import CastleFalkensteinPerformFeat from "../forms/perform-feat.mjs";
import CastleFalkensteinDefineSpell from "../forms/define-spell.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class CastleFalkensteinActor extends Actor {

  computeHandName(handType) {
    return game.i18n.format(`castle-falkenstein.${handType}.hand.name`, {character: this.name});
  }

  /** @override */
  async _preUpdate(changed, options, user) {
    super._preUpdate(changed, options, user);

    // character name changed, update the names of their Fortune/Sorcery hands also (if they exist)
    // unless the user is using custom role permissions for their game, whoever updated the Actor should have permission to update the Hand also.
    if (changed.name) {
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        if (this.data.data.hands[handType] != "") {
          let hand = game.cards.get(this.data.data.hands[handType]);
          await hand?.update({
            name: this.computeHandName(handType)
          });
        }
      });
    }

    // if permissions on the character changed, update the permissions of their Fortune/Sorcery hands also (if they exist)
    // unless the user is using custom role permissions for their game, whoever updated the Actor should have permission to update the Hand also.
    if (changed.permission) {
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        if (this.data.data.hands[handType] != "") {
          let hand = game.cards.get(this.data.data.hands[handType]);
          await hand?.update({
            permission: this.data.permission
          });
        }
      });
    }
  }

  async createHand(handType) {
    const handData = {
      type: "hand",
      name: this.computeHandName(handType),
      displayCount: true,
      folder: null, // the GM may freely moved the hand to whatever folder they wish afterwards. This probably does not deserve a system Setting.
      permission: this.data.permission, // hands inherit the permissions from the actor they belong to
      folder: (await CastleFalkenstein.cardsFolder("character-hands", game.i18n.localize("castle-falkenstein.cardsDirectory.characterHandsFolder"))).id,
      "flags.castle-falkenstein": { type: handType, actor: this.id }
    };

    const hand = await Cards.create(handData);

    await this.update({
      [`data.hands.${handType}`]: hand.id
    });

    return hand;
  }

  
  async hand(handType) {
    let hand = null;

    if (this.data.data.hands[handType]) {
      hand = game.cards.get(this.data.data.hands[handType]);
    }

    if (!hand) {
      hand = await this.createHand(handType);
    }

    return hand;
  }

  /**
   * Perform a Feat.
   */
  async performFeat(item) {
    if (!this.isOwner) return;
 
    if (item.data.type != 'ability') {
      CastleFalkenstein.consoleError("Trying to perform a feat with non-ability item.");
      return;
    }

    if (!CASTLE_FALKENSTEIN.validNonJokerCardSuits.includes(item.data.data.suit)) {
      ui.notifications.error("Ability does not have a proper suit.");
      return;
    }

    let hand = await this.hand("fortune");
    if (!hand) {
      ui.notifications.error("No Fortune hand to perform feat with.");
      return;
    }

    (new CastleFalkensteinPerformFeat(item)).render(true);
  }

  get sorceryAbility() {
    return this.items.find(item => item.type == 'ability' && item.name == CastleFalkenstein.i18nSorceryAbility);
  }

  get isCasting() {
    return this.data.data.spellBeingCast.spell != false;
  }

  /**
   * Define a Spell.
   */
  async defineSpell(item) {
    if (!this.isOwner) return;

    const itemData = item.data;

    if (itemData.type != 'spell') {
      CastleFalkenstein.consoleError("Trying to cast a spell from non-spell item.");
      return;
    }

    if (!CASTLE_FALKENSTEIN.validNonJokerCardSuits.includes(item.data.data.suit)) {
      ui.notifications.error("Spell does not have a proper aspect.");
      return;
    }

    let hand = await this.hand("sorcery");
    if (!hand) {
      ui.notifications.error("No Sorcery hand to cast spell with.");
      return;
    }

    if (!this.sorceryAbility) {
      ui.notifications.error(`Character does not have ability '${CastleFalkenstein.i18nSorceryAbility}'.`);
      return;
    }
    
    hand.sheet.render(true);

    if (this.isCasting) {
      ui.notifications.error("Spell is already being cast. Cancel the previous one if you wish to cast another.");
      return;
    }

    (new CastleFalkensteinDefineSpell(item)).render(true);
  }
}