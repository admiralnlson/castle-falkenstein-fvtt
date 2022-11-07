import CastleFalkenstein from "./castle-falkenstein.mjs";
import { CastleFalkensteinHandSheet } from "./documents/hand-sheet.mjs";

export default class CastleFalkensteinMonarchConfig {

  static onCardDisplay(monarch, components) {

    const cfCardsType = monarch.object.getFlag(CastleFalkenstein.id, "type");
    if (!cfCardsType)
      return;

    // Remove Monarch default standalone card components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }

    // That's it..
  }

  static onHandDisplay(monarch, components) {

    const cfCardsType = monarch.object.getFlag(CastleFalkenstein.id, "type");
    if (!cfCardsType)
      return;

    // Remove Monarch default components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }
    while (components.appControls.length > 0) { components.appControls.pop(); }

    //
    // Add Castle Falkenstein-relevant components
    //

    // Fortune & Sorcery hands - Open character sheet
    components.appControls.push({
      label: "castle-falkenstein.empty",
      tooltip: "castle-falkenstein.openCharacterSheet",
      icon: "fas fa-user",
      class: "hand-charsheet",
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.openActorDisabled(hand);
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkensteinHandSheet.openActor(hand);
      }
    });

    // Fortune hand - Refill hand
    components.appControls.push({
      label: "castle-falkenstein.fortune.hand.refill",
      icon: "cf-stack",
      class: "fortune-hand-refill",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.id, "type");
        return type != "fortune";
      },
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.refillHandDisabled(hand);
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkensteinHandSheet.refillHand(hand);
      }
    });

    // Fortune hand - Chance (draw a single Fortune card, immediately playing it)
    components.appControls.push({
      label: "castle-falkenstein.fortune.hand.chance",
      icon: "fas fa-question",
      class: "fortune-hand-chance",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.id, "type");
        return type != "fortune";
      },
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.chanceCardDisabled(hand);
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkensteinHandSheet.chanceCard(hand);
      }
    });

    // Sorcery hand - Gather Power
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.gatherPower",
      icon: "fas fa-plus-circle",
      class: "sorcery-hand-gather-power",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.id, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.gatherPowerDisabled(hand);
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkensteinHandSheet.gatherPower(hand);
      }
    });

    // Sorcery card - Release power
    components.controls.push({
      tooltip: "castle-falkenstein.sorcery.hand.releasePower",
      icon: "fas fa-trash",
      class: "sorcery-hand-card-release",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.id, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.releasePowerDisabled(card, hand);
      },
      onclick: async (event, card, hand) => {
        await CastleFalkensteinHandSheet.releasePower(card, hand);
      }
    });

    // Sorcery hands - Cast spell
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.castSpell",
      icon: "fas fa-play-circle",
      class: "sorcery-hand-cast-spell",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.id, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.castSpellDisabled(hand);
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkensteinHandSheet.castSpell(hand);
      }
    });

    // Sorcery hands - Cancel spell
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.cancelSpell",
      icon: "fas fa-stop-circle",
      class: "sorcery-hand-cancel-spell",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.id, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        return CastleFalkensteinHandSheet.cancelSpellDisabled(hand);
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkensteinHandSheet.cancelSpell(hand);
      }
    });

  }

  static onCardClick(event, app, card) {

    if (app.document?.type == "hand") {
      // Replace Monarch's default behaviour (open card sheet) with Monarch's ' magnify option directly.
      const popout = new ImagePopout(card.img, {
        title: card.name,
        uuid: card.uuid,
        shareable: true,
        editable: true
      }).render(true, { focus: true });

      if (event.shiftKey) popout.shareImage();

      return false; // prevent default Monarch behaviour (open card sheet)
    } else {
      return true;
    }
  }

};