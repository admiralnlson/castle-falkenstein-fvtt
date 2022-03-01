import CastleFalkenstein from "./castle-falkenstein.mjs";

export default class CastleFalkensteinMonarchConfig {

  static configureCardComponents(monarch, components) {
    // Remove Monarch default standalone card components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }

    // That's it..
  }

  static configureHandComponents(monarch, components) {
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
          hand.draw(CastleFalkenstein.fortuneDeck, 4 - hand.cards.size, {chatNotification: false});
      }
    });

    // Sorcery hand - Gather Power
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.draw",
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

        // TODO mention whether the spell thaumic energy requirement has been reached. May not bode well with cooperation spellcasting scenarios though.
        const cards = await hand.draw(CastleFalkenstein.sorceryDeck, 1, {chatNotification: false});
        if (cards.length < 1) {
          return;
        }
        const card = cards[0];

        // Post message to chat
        const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.chat.powerDrawn")}]`;
        const spell = actor.items.get(actor.data.data.spellBeingCast.spell);
        const correctSuit = (card.data.suit == spell.data.data.suit || card.data.suit == 'joker') ? 'correct-suit' : '';
        const content = `<div class="cards-drawn"><span class="card-drawn ${correctSuit} cf-card-${card.data.value}-${card.data.suit}"></span></div>`;
        CastleFalkenstein.createChatMessage(actor, flavor, content);
      }
    });

    // Sorcery card - Release power
    components.controls.push({
      tooltip: "castle-falkenstein.sorcery.hand.release",
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
          card.pass(CastleFalkenstein.sorceryDiscardPile, {chatNotification: false});

          // Post message to chat
          const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.chat.powerReleased")}]`;
          const content = `<div class="cards-played"><span class="card-played cf-card-${card.data.value}-${card.data.suit}"></span></div>`;
          CastleFalkenstein.createChatMessage(actor, flavor, content);
        }
      }
    });

    // Sorcery hands - Cast spell
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.cast",
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
        
        hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

        // Post message to chat
        let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.chat.spellCast")}]`;
        let content = ""; // FIXME add info on spell which was cast (name, aspect, amount of power which had been gather + harmonic info if any)
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
      label: "castle-falkenstein.sorcery.hand.cancel",
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

        hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

        // Post message to chat
        let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.chat.spellCanceled")}]`;
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
};