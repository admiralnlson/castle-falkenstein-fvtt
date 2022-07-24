import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";
import CastleFalkensteinPerformFeat from "../forms/perform-feat.mjs";
import CastleFalkensteinDefineSpell from "../forms/define-spell.mjs";

/**
 * @extends {Actor}
 */
export class CastleFalkensteinActor extends Actor {

  computeHandName(handType) {
    return game.i18n.format(`castle-falkenstein.${handType}.hand.name`, {character: this.name});
  }

  /** @override */
  async _onUpdate(changed, options, user) {
    super._onUpdate(changed, options, user);
    
    // If the character name changed, update the names of their Fortune/Sorcery hands also, if they exist.
    if (changed.name) {
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        const hand = CastleFalkenstein.searchUniqueHand(handType, this);
        if (hand) {
          // No need for a socket here.
          // Whoever updated the name on the Actor is expected to have permission to update the name of the Hand also (see below).
          await hand.update({
            name: this.computeHandName(handType)
          });
        }
      });
    }

    if (changed.permission) {
      // If permissions on a Character changed and no player owns it anymore, delete their Fortune hand if it exists.
      if (!this.hasPlayerOwner) {
        const fortuneHand = CastleFalkenstein.searchUniqueHand("fortune", this);
        if (fortuneHand) {
          // No need for a socket here.
          // Whoever delete the Actor is expected to have permission to delete the Hand also (with default role permissions at least they should).
          await fortuneHand.delete();
        }
      }

      // If permissions on a Character changed, update the permissions of their Fortune/Sorcery hands to match, if they (still, see above) exist.
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        const hand = CastleFalkenstein.searchUniqueHand(handType, this);
        if (hand) {
          // No need for a socket here.
          // Whoever updated permissions on the the Actor is expected to have permission to update them on the Hand also (with default role permissions at least, they should).
          await hand.update({
            permission: this.data.permission
          });
        }
      });
    }
  }
  

  /** @override */
  async _preDelete(changed, options, user) {
    super._preDelete(changed, options, user);

    [ "fortune", "sorcery" ].forEach(async (handType) => {
      const hand = CastleFalkenstein.searchUniqueHand(handType, this);
      if (hand) {
        await hand.delete();
      }
    });
  }

  handIfExists(handType) {

    let actorOrHost;
    if (handType === "fortune" && !this.hasPlayerOwner)
      actorOrHost = "host";
    else
      actorOrHost = this;

    return CastleFalkenstein.searchUniqueHand(handType, actorOrHost);
  }

  async hand(handType) {
    let hand = this.handIfExists(handType);

    if (!hand)
      hand = await CastleFalkenstein.socket.executeAsGM("createHand", handType, this.id);

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
      ui.notifications.error(game.i18n.localize("castle-falkenstein.notifications.abilityInvalidSuit"));
      return;
    }

    let hand = await this.hand("fortune");
    if (!hand) {
      ui.notifications.error(game.i18n.localize("castle-falkenstein.notifications.noFortuneHandForFeat"));
      return;
    }

    (new CastleFalkensteinPerformFeat(item)).render(true, { focus: true });
  }

  get sorceryAbility() {
    return this.items.find(item => item.type == 'ability' && item.name == CastleFalkenstein.i18nSorceryAbility);
  }

  get isCasting() {
    return this.data.data.spellBeingCast &&
           this.data.data.spellBeingCast.spell;
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
      ui.notifications.error(game.i18n.localize("castle-falkenstein.notifications.spellInvalidAspect"));
      return;
    }

    let hand = await this.hand("sorcery");
    if (!hand) {
      ui.notifications.error(game.i18n.localize("castle-falkenstein.notifications.noSorceryHandforSpell"));
      return;
    }

    if (!this.sorceryAbility) {
      ui.notifications.error(game.i18n.format("castle-falkenstein.notifications.characterDoesNotHaveAbility", {
        name: CastleFalkenstein.i18nSorceryAbility
      }));
      return;
    }
    
    if (this.isCasting) {
      ui.notifications.error(game.i18n.localize("castle-falkenstein.notifications.spellAlreadyBeingCast"));
      return;
    }

    (new CastleFalkensteinDefineSpell(item)).render(true, { focus: true });
  }
}