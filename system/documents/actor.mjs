import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";
import CastleFalkensteinPerformFeat from "../forms/perform-feat.mjs";
import CastleFalkensteinDefineSpell from "../forms/define-spell.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class CastleFalkensteinActor extends Actor {

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.CastleFalkenstein || {};
  }

  computeHandName(handType) {
    return game.i18n.format(`castle-falkenstein.${handType}.hand`, {character: this.name});
  }

  async onUpdate(data, options, userId) {
    // if the character name changed, update the names of their Fortune/Sorcery hands also (if they exist)
    if (data.name) {
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        if (this.data.data.hands[handType] != "") {
          let hand = game.cards.get(this.data.data.hands[handType]);
          await hand?.update({
            name: this.computeHandName(handType)
          });
        }
      });
    }
  }

  computeNewHandPermissions() {
    // Card hands created for an actor have permissions derived from those on the actor
    //  - None => None
    //  - Limited => None (since with Limited they would just show up in the sidebar cards tab but remain inaccessible)
    //  - Observer => Observer
    //  - Owner => Owner
    return Object.fromEntries(Object.entries(this.data.permission).filter(([key, value]) => value != CONST.ENTITY_PERMISSIONS.LIMITED));
  }

  async createHand(handType) {
    const stacksConfig = [{
      type: "hand",
      name: this.computeHandName(handType),
      displayCount: true,
      folder: null, // the GM may freely moved the hand to whatever folder they wish afterwards. This probably does not deserve a system Setting.
      permission: this.computeNewHandPermissions()
    }];

    const stacks = await Cards.createDocuments(stacksConfig);

    if (stacks.length > 0) {
      let hand = stacks[0];
      await this.update({
        [`data.hands.${handType}`]: hand.id
      });

      await hand.setFlag('castle-falkenstein', 'handProperties', {
        type: handType,
        actor: this.id
      });

      return hand;
    } else {
      CastleFalkenstein.consoleError("Could not create character hand");
    }
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

    let performFeat = new CastleFalkensteinPerformFeat(item);
    performFeat.render(true);
  }

  get sorceryAbility() {
    return this.items.find(item => item.type == 'ability' && item.name == CastleFalkenstein.i18nSorceryAbility);
  }

  /**
   * Cast a Spell.
   */
  async castSpell(item) {
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
    
    let performFeat = new CastleFalkensteinDefineSpell(item);
    performFeat.render(true);
  }
}