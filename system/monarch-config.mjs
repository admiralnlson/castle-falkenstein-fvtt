import { CASTLE_FALKENSTEIN } from "./config.mjs";
import CastleFalkenstein from "./castle-falkenstein.mjs";

export default class CastleFalkensteinMonarchConfig {

  static onCardDisplay(monarch, components) {
    // Remove Monarch default standalone card components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }

    // That's it..
  }

  static onHandDisplay(monarch, components) {
    // Remove Monarch default components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }
    while (components.appControls.length > 0) { components.appControls.pop(); }

    //
    // Add Castle Falkenstein-relevant components
    //

    // Fortune hand - Draw
    components.appControls.push({
      label: "castle-falkenstein.fortune.hand.draw",
      icon: "fas fa-plus",
      class: "fortune-hand-draw",
      hide: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        return handProperties?.type != "fortune";
      },
      disabled: (card, hand) => {
        return hand.cards.size >= 4;
      },
      onclick: async (event, app, hand) =>  {
        try {
          await hand.draw(CastleFalkenstein.fortuneDeck, max(4 - hand.cards.size,0), {chatNotification: false});
        } catch (e) {
          ui.notifications.error(e);
          return;
        }
      }
    });

    // Sorcery hand - Gather Power
    components.appControls.push({
      label: "castle-falkenstein.sorcery.gatherPower",
      icon: "fas fa-plus",
      class: "sorcery-hand-gather-power",
      hide: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        return handProperties?.type != "sorcery";
      },
      disabled: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);

        // TODO add "actor.isDragon" getter to allow implementation of this 5-card limit
        //if (actor.isDragon && hand.cards.size >= 5)
        //  return true;

        return actor.data.data.spellBeingCast.spell == "";
      },
      onclick: async (event, app, hand) =>  {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);

        let cards;
        try {
           cards = await hand.draw(CastleFalkenstein.sorceryDeck, 1, {chatNotification: false});
        } catch (e) {
          ui.notifications.error(e);
          return;
        }

        const card = cards[0];

        // TODO mention whether the spell thaumic energy requirement has been reached. May not bode well with cooperation spellcasting scenarios though.

        // Post message to chat
        const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.gatherPower")}]`;
        const spell = actor.items.get(actor.data.data.spellBeingCast.spell);
        const correctSuit = (card.data.suit == spell.data.data.suit || card.data.suit == 'joker') ? 'correct-suit' : '';
        const content = `<div class="cards-drawn"><span class="card-drawn ${correctSuit} cf-card-${card.data.value}-${card.data.suit}"></span></div>`;
        CastleFalkenstein.createChatMessage(actor, flavor, content);
      }
    });

    // Sorcery card - Release power
    components.controls.push({
      tooltip: "castle-falkenstein.sorcery.releasePower",
      icon: "cf-card-discard",
      class: "sorcery-hand-card-release",
      hide: (card, container) => {
        const handProperties = container.getFlag("castle-falkenstein", "handProperties");
        return handProperties.type != "sorcery";
      },
      // TODO disable the button on cards with aligned power (if done, maybe reconsider label & chat messages content)
      /*disabled: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        return !card.isAligned(handProperties.actor);
      },*/
      onclick: async (event, card, container) => {
        const handProperties = container.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);

        if (handProperties.type == "sorcery") {
          await card.pass(CastleFalkenstein.sorceryDiscardPile, {chatNotification: false});

          // Post message to chat
          const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.releasePower")}]`;
          const content = `<div class="cards-played"><span class="card-played cf-card-${card.data.value}-${card.data.suit}"></span></div>`;
          CastleFalkenstein.createChatMessage(actor, flavor, content);
        }
      }
    });

    // Sorcery hands - Cast spell
    components.appControls.push({
      label: "castle-falkenstein.sorcery.castSpell",
      icon: "fas fa-play",
      class: "sorcery-hand-cast-spell",
      hide: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        return handProperties?.type != "sorcery";
      },
      disabled: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);
        // TODO disable if the thaumic energy requirement has not been reached? (may not bode well with cooperation spellcasting scenario though)
        return actor.data.data.spellBeingCast.spell == "";
      },
      onclick: async (event, app, hand) =>  {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);
        const spell = actor.items.get(actor.data.data.spellBeingCast.spell);

        // Post message to chat
        let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.castSpell")}]`;

        const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[spell.data.data.suit];
        let content = `<b>${spell.name}</b> [<span class="suit-symbol-${spell.data.data.suit}">${suitSymbol}</span>]<hr/><div class="cards-played">`;

        if (hand.cards.contents.length > 0) {
          hand.cards.contents.forEach(card => {
            // FIXME code duplication
            const correctSuit = (card.data.suit == spell.data.data.suit || card.data.suit == 'joker') ? 'correct-suit' : '';
            content += `<span class="card-played ${correctSuit} cf-card-${card.data.value}-${card.data.suit}"></span>`;
          });
        } else {
          content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
        }
        content += `</div>`;

        // TODO add "<score> / <total>"" box.
        // TODO show harmonic type(s) (up to 3 for the GM to choose from in case of ex-aequo), if unaligned power was used.

        await hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

        CastleFalkenstein.createChatMessage(actor, flavor, content);

        // no spell being cast anymore on Actor side
        await actor.update({
          ['data.spellBeingCast.spell']: ""
        });

        hand.sheet.render();
      }
    });

    // Sorcery hands - Cancel spell
    components.appControls.push({
      label: "castle-falkenstein.sorcery.cancelSpell",
      icon: "fas fa-stop",
      class: "sorcery-hand-cancel-spell",
      hide: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        return handProperties?.type != "sorcery";
      },
      disabled: (card, hand) => {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);
        return actor.data.data.spellBeingCast.spell == "";
      },
      onclick: async (event, app, hand) =>  {
        const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
        const actor = game.actors.get(handProperties.actor);

        await hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

        // Post message to chat
        let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.cancelSpell")}]`;
        let content = ""; // FIXME add info on spell which was canceled
        CastleFalkenstein.createChatMessage(actor, flavor, content);

        // no spell being cast anymore on Actor side
        await actor.update({
          ['data.spellBeingCast.spell']: ""
        });

        hand.sheet.render();
      }
    });

  }

  static onCardClick(event, app, card) {

    if (app.document?.data?.type == "hand") {
      // Replace Monarch's default behaviour (open card sheet) with Monarch's ' magnify option directly.
      const popout = new ImagePopout(card.img, {
        title: card.data.name,
        uuid: card.data.uuid,
        shareable: true,
        editable: true
      }).render(true);

      if (event.shiftKey) popout.shareImage();

      return false; // prevent default Monarch behaviour (open card sheet)
    } else {
      return true;
    }
  }

};