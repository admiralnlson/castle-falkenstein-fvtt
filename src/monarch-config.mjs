import { CASTLE_FALKENSTEIN } from "./config.mjs";
import CastleFalkenstein from "./castle-falkenstein.mjs";

export default class CastleFalkensteinMonarchConfig {

  static onCardDisplay(monarch, components) {

    const cfCardsType = monarch.object.getFlag(CastleFalkenstein.name, "type");
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

    const cfCardsType = monarch.object.getFlag(CastleFalkenstein.name, "type");
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

    // Fortune hand - Refill hand
    components.appControls.push({
      label: "castle-falkenstein.fortune.hand.refill",
      //icon: "fas fa-plus-circle",
      icon: "cf-stack",
      class: "fortune-hand-refill",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.name, "type");
        return type != "fortune";
      },
      disabled: (card, hand) => {
        return hand.cards.size >= 4;
      },
      onclick: async (event, app, hand) =>  {
        await CastleFalkenstein.draw("fortune", hand, 4 - hand.cards.size);
      }
    });

    // Fortune hand - Chance (draw a single Fortune card, immediately playing it)
    components.appControls.push({
      label: "castle-falkenstein.fortune.hand.chance",
      icon: "fas fa-question",
      class: "fortune-hand-chance",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.name, "type");
        return type != "fortune";
      },
      disabled: (card, hand) => {
        return false;
      },
      onclick: async (event, app, hand) =>  {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");

        // draw a single card from the discard pile directly (avoids glitches)
        const cardsDrawn = await CastleFalkenstein.draw("fortune", game.CastleFalkenstein.fortuneDiscardPile, 1);

        // Post message to chat
        const card = cardsDrawn[0];
        const flavor = `[${game.i18n.localize("castle-falkenstein.fortune.hand.chance")}]`;
        // TODO FIXME not always a match actually, compare with spell aspect
        const correctSuit = 'correct-suit';
        const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card,`card-drawn ${correctSuit}`)}</div>`;
        CastleFalkenstein.createChatMessage(actorId === "host" ? "gm" : game.actors.get(actorId), flavor, content);
      }
    });

    // Sorcery hand - Gather Power
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.gatherPower",
      icon: "fas fa-plus-circle",
      class: "sorcery-hand-gather-power",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.name, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return true;
        const actor = game.actors.get(actorId);

        // TODO add "actor.isDragon" getter to allow implementation of this 5-card limit
        //if (actor.isDragon && hand.cards.size >= 5)
        //  return true;

        return !actor.isCasting;
      },
      onclick: async (event, app, hand) =>  {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return; // should never be able to click from host hand anyway (see 'disabled' above)
        const actor = game.actors.get(actorId);

        const cards = await CastleFalkenstein.draw("sorcery", hand, 1);
        const card = cards[0];

        // TODO mention whether the spell thaumic energy requirement has been reached. May not bode well with cooperation spellcasting scenarios though.

        // Post message to chat
        const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.gatherPower")}]`;
        const spell = actor.items.get(actor.data.data.spellBeingCast.spell);
        const correctSuit = (card.data.suit == spell.data.data.suit || card.data.suit == 'joker') ? 'correct-suit' : '';
        const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card, `card-played ${correctSuit}`)}</div>`;
        CastleFalkenstein.createChatMessage(actor, flavor, content);
      }
    });

    // Sorcery card - Release power
    components.controls.push({
      tooltip: "castle-falkenstein.sorcery.hand.releasePower",
      icon: "cf-card-discard",
      class: "sorcery-hand-card-release",
      hide: (card, container) => {
        const type = container.getFlag(CastleFalkenstein.name, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        // TODO disable the release of unaligned power (if done, maybe reconsider label & chat messages content)
        //const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        //if (actorId === "host")
        //  return true;
        //const actor = game.actors.get(actorId);
        //return !actor.isSpellAligned(card);
        return false;
      },
      onclick: async (event, card, container) => {
        const actorId = container.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return; // should never be able to click from host hand anyway (see 'disabled' above)
        const actor = game.actors.get(actorId);

        await card.pass(CastleFalkenstein.sorceryDiscardPile, {chatNotification: false});

        // Post message to chat
        const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.releasePower")}]`;
        const content = `<div class="cards-played">${CastleFalkenstein.smallCardImg(card, "card-played")}</div>`;
        CastleFalkenstein.createChatMessage(actor, flavor, content);
      }
    });

    // Sorcery hands - Cast spell
    components.appControls.push({
      label: "castle-falkenstein.sorcery.hand.castSpell",
      icon: "fas fa-play-circle",
      class: "sorcery-hand-cast-spell",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.name, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return true;
        const actor = game.actors.get(actorId);

        // TODO disable if the thaumic energy requirement has not been reached? (may not bode well with cooperation spellcasting scenario though)

        return !actor.isCasting;
      },
      onclick: async (event, app, hand) =>  {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return; // should never be able to click from host hand anyway (see 'disabled' above)
        const actor = game.actors.get(actorId);
        const spell = actor.items.get(actor.data.data.spellBeingCast.spell);

        // Post message to chat
        let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.castSpell")}]`;

        const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[spell.data.data.suit];
        let content = `<b>${spell.name}</b> [<span class="suit-symbol-${spell.data.data.suit}">${suitSymbol}</span>]<hr/><div class="cards-played">`;

        if (hand.cards.contents.length > 0) {
          hand.cards.contents.forEach(card => {
            // FIXME code duplication
            const correctSuit = (card.data.suit == spell.data.data.suit || card.data.suit == 'joker') ? 'correct-suit' : '';
            content += CastleFalkenstein.smallCardImg(card,`card-played ${correctSuit}`);
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
      label: "castle-falkenstein.sorcery.hand.cancelSpell",
      icon: "fas fa-stop-circle",
      class: "sorcery-hand-cancel-spell",
      hide: (card, hand) => {
        const type = hand.getFlag(CastleFalkenstein.name, "type");
        return type != "sorcery";
      },
      disabled: (card, hand) => {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return true;
        const actor = game.actors.get(actorId);
        return !actor.isCasting;
      },
      onclick: async (event, app, hand) =>  {
        const actorId = hand.getFlag(CastleFalkenstein.name, "actor");
        if (actorId === "host")
          return; // should never be able to click from host hand anyway (see 'disabled' above)
        const actor = game.actors.get(actorId);

        await hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

        // Post message to chat
        let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.cancelSpell")}]`;
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
      }).render(true, { focus: true });

      if (event.shiftKey) popout.shareImage();

      return false; // prevent default Monarch behaviour (open card sheet)
    } else {
      return true;
    }
  }

};