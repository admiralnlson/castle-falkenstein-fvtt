import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinDefineSpell } from "../forms/define-spell.mjs";
import { CastleFalkensteinCards } from "./cards.mjs";

/**
 * @extends {Actor}
 */
export class CastleFalkensteinActor extends Actor {

  computeHandName(handType) {
    return game.i18n.format(`castle-falkenstein.${handType}.hand.name`, {character: this.name});
  }

  computeDiaryName() {
    return game.i18n.format(`castle-falkenstein.diary.name`, {character: this.name});
  }

  /** @override */
  async _onUpdate(changed, options, user) {
    await super._onUpdate(changed, options, user);

    // If the character name changed, update the names of their Fortune/Sorcery hands also, if they exist.
    if (game.user.id == user && changed.name && !this.isToken) {
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

      // rename the diary as well, if it exists
      const diary = CastleFalkenstein.searchUniqueDiary(this);
      if (diary) {
        await diary.update({
          name: this.computeDiaryName()
        });
      }
    }

    // If ownership on a Character changed
    if (game.user.id == user && changed.ownership) {
      
      // if no player owns it anymore, delete their Fortune hand if it exists.
      // We assume here that whoever triggered this change has the required permissions to do it (Actor and Hands permissions are sync'ed).
      if (!this.hasPlayerOwner) {
        const hand = CastleFalkenstein.searchUniqueHand("fortune", this, true);
        if (hand) {
         // No need for a socket here.
         // Whoever is updating ownership on the Actor is expected to have the ownership level necessary to delete the Hand also.
          await hand.delete();
        }
      }

      // Update the ownership of their Fortune/Sorcery hands and Diary to match, if they still (see above) exist.
      [ "fortune", "sorcery" ].forEach(async (handType) => {
        const hand = CastleFalkenstein.searchUniqueHand(handType, this, true);
        if (hand) {
          // No need for a socket here.
          // Whoever is updating ownership on the Actor is expected to have the ownership level necessary to update them on the Hand also.
          await hand.update({
            ownership: this.ownership
          });
        }
      });

      // Update the ownership of their Diary to match, if it exists.
      const diary = CastleFalkenstein.searchUniqueDiary(this);
      if (diary) {
        await diary.update({
          ownership: this.ownership
        });
      }
    }
  }

  /** @override */
  async _preDelete(changed, options, user) {
    await super._preDelete(changed, options, user);

    if (this.isToken)
      return;

    // Delete their Fortune/Sorcery hand if it exists.
    // We assume here that whoever triggered this deletion has the required permissions to do it (Actor and Hands permissions are sync'ed).
    [ "fortune", "sorcery" ].forEach(async (handType) => {
      const hand = CastleFalkenstein.searchUniqueHand(handType, this);
      if (hand) {
        const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
        if (actorId != "host") {
          await hand.delete();
        }
      }
    });

    // Diaries are not deleted. But a notification saying it still exists does not hurt
    const diary = CastleFalkenstein.searchUniqueDiary(this);
    if (diary) {
      CastleFalkenstein.notif.info("castle-falkenstein.notifications.deletedCharacterHadADiary", {
        character: this.name
      });
    }
  }

  handIfExists(handType) {
    return CastleFalkenstein.searchUniqueHand(handType, this);
  }

  async hand(handType) {
    let hand = this.handIfExists(handType);

    if (!hand && !this.isToken) {
      if (!game.users.activeGM) {
        // planning to use executeAsGM below
        CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
        return;
      }
      hand = await CastleFalkenstein.socket.executeAsGM("createHand", handType, this.id);

      if (hand && !(hand instanceof CONFIG.Cards.documentClass))
        hand = new CONFIG.Cards.documentClass(hand);
    }

    return hand;
  }

  diaryIfExists() {
    return CastleFalkenstein.searchUniqueDiary(this);
  }

  async diary() {
    let diary = this.diaryIfExists();

    if (!diary && !this.isToken) {
      if (!game.users.activeGM) {
        // planning to use executeAsGM below
        CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
        return;
      }
      diary = await CastleFalkenstein.socket.executeAsGM("createDiary", this.id);

    if (diary && !(diary instanceof CONFIG.JournalEntry.documentClass))
      diary = new CONFIG.JournalEntry.documentClass(diary);
    }

    return diary;
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

    await hand.startPerformingFeat(this, item);
  }

  get sorceryAbility() {
    return this.items.find(item => item.type == 'ability' && item.name == CastleFalkenstein.i18nAbility("sorcery"));
  }

  get sorceryAbilityAndSpecializations() {
    return this.items.filter(item => item.type == "ability" && (item.name == CastleFalkenstein.i18nAbility("sorcery") ||
      item.system.isSpecialization && item.system.rootAbility?.name == CastleFalkenstein.i18nAbility("sorcery")));
  }
    
  get perceptionAbility() {
    return this.items.find(item => item.type == 'ability' && item.name == CastleFalkenstein.i18nAbility("perception"));
  }

  /**
   * Define a Spell.
   */
  async defineSpell(item) {
    if (!this.isOwner)
      return;

    if (this.isToken)
      return;

    if (item.type != 'spell') {
      CastleFalkenstein.log.error("Trying to cast a spell from non-spell item.");
      return;
    }

    if (!CASTLE_FALKENSTEIN.validNonJokerCardSuits.includes(item.system.suit)) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.spellInvalidAspect"));
      return;
    }

    if (!this.sorceryAbility) {
      if (this.isToken) {
        CastleFalkenstein.notif.error(game.i18n.format("castle-falkenstein.notifications.tokenDoesNotHaveAbility", {
          token: this.parent.name,
          ability: CastleFalkenstein.i18nAbility("sorcery")
        }));
      } else {
        CastleFalkenstein.notif.error(game.i18n.format("castle-falkenstein.notifications.characterDoesNotHaveAbility", {
          character: this.name,
          ability: CastleFalkenstein.i18nAbility("sorcery")
        }));
      }
      return;
    }

    let hand = await this.hand("sorcery");
    if (!hand) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.noSorceryHandforSpell"));
      return;
    }
    
    if (hand.spellBeingCast) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.spellAlreadyBeingCast"));
      return;
    }

    (new CastleFalkensteinDefineSpell(item)).render(true);
  }

}
