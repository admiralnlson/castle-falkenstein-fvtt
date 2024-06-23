import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinDefineSpell } from "../forms/define-spell.mjs";

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
          const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
          if (actorId != "host") {
            // No need for a socket here.
            // Whoever updated the name on the Actor is expected to have the ownership level necessary to update the name of the Hand also (see below).
            await hand.update({
              name: this.computeHandName(handType)
            });
          }
        }
      });
    }

    if (changed.ownership) {
      // If ownership on a Character changed and no player owns it anymore, delete their Fortune hand if it exists.
      if (!this.hasPlayerOwner) {
        const hand = CastleFalkenstein.searchUniqueHand("fortune", this, true);
        if (hand) {
          const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
          if (actorId != "host") {
            await hand.delete();
          }
        }
      }

      // If ownership on a Character changed, update the ownership of their Fortune/Sorcery hands to match, if they (still, see above) exist.
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        const hand = CastleFalkenstein.searchUniqueHand(handType, this);
        if (hand) {
          const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
          if (actorId != "host") {
            // No need for a socket here.
            // Whoever updated ownership on the the Actor is expected to have the ownership level necessary to update them on the Hand also (with default role ownership at least, they should).
            await hand.update({
              ownership: this.ownership
            });
          }
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
        const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
        if (actorId != "host") {
          await hand.delete();
        }
      }
    });
  }

  handIfExists(handType) {
    return CastleFalkenstein.searchUniqueHand(handType, this);
  }

  async hand(handType) {
    let hand = this.handIfExists(handType);

    if (!hand) {
      

      hand = await CastleFalkenstein.socket.executeAsGM("createHand", handType, this.id);
    }

    return hand;
  }

  spellBeingCast() {
    return this.handIfExists("sorcery")?.spellBeingCast;
  }

  /**
   * Perform a Feat.
   */
  async performFeat(item) {
    if (!this.isOwner) return;
 
    if (item.type != 'ability') {
      CastleFalkenstein.log.error("Trying to perform a feat with non-ability item.");
      return;
    }

    if (!CASTLE_FALKENSTEIN.validNonJokerCardSuits.includes(item.system.suit)) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.abilityInvalidSuit"));
      return;
    }

    let hand = await this.hand("fortune");
    if (!hand) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.noFortuneHandForFeat"));
      return;
    }

    // unselect cards
    hand.cards.forEach(card => {
      card.unsetFlag(CastleFalkenstein.id, "selected");
    });

    await hand.startPerformingFeat(item);
  }

  get sorceryAbility() {
    return this.items.find(item => item.type == 'ability' && item.name == CastleFalkenstein.i18nSorceryAbility);
  }

  get sorceryAbilityAndSpecializations() {
    return this.items.filter(item => item.type == "ability" && (item.name == CastleFalkenstein.i18nSorceryAbility ||
      item.system.isSpecialization && item.system.rootAbility?.name == CastleFalkenstein.i18nSorceryAbility));
  }

  /**
   * Define a Spell.
   */
  async defineSpell(item) {
    if (!this.isOwner) return;

    if (item.type != 'spell') {
      CastleFalkenstein.log.error("Trying to cast a spell from non-spell item.");
      return;
    }

    if (!CASTLE_FALKENSTEIN.validNonJokerCardSuits.includes(item.system.suit)) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.spellInvalidAspect"));
      return;
    }

    let hand = await this.hand("sorcery");
    if (!hand) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.noSorceryHandforSpell"));
      return;
    }

    if (!this.sorceryAbility) {
      CastleFalkenstein.notif.error(game.i18n.format("castle-falkenstein.notifications.characterDoesNotHaveAbility", {
        name: CastleFalkenstein.i18nSorceryAbility
      }));
      return;
    }
    
    if (hand.spellBeingCast) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.spellAlreadyBeingCast"));
      return;
    }

    (new CastleFalkensteinDefineSpell(item)).render(true);
  }
}