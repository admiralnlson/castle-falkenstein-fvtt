import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinPerformFeat } from "../forms/perform-feat.mjs";

/**
 * Sheet for the native Cards Hand.
 * @extends {CardsHand}
 */
export class CastleFalkensteinHandSheet extends CardsHand {

  static HEIGHT_WITHOUT_SPELL = 60;
  static HEIGHT_WITH_SPELL = 97;

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "cards-hand", "cards-config"],
      width: 300,
      height: CastleFalkensteinHandSheet.HEIGHT_WITHOUT_SPELL,
      resizable: {
        resizeX: true,
        resizeY: false
      },
      template: "systems/castle-falkenstein/src/documents/hand-sheet.hbs",
    })
  }

  render(force=false, options={}) {
    const hand = this.object;
    const spellActive = hand.getFlag(CastleFalkenstein.id, 'spellBeingCast');

    super.render(force, foundry.utils.mergeObject(options, {
      height: (spellActive ? CastleFalkensteinHandSheet.HEIGHT_WITH_SPELL : CastleFalkensteinHandSheet.HEIGHT_WITHOUT_SPELL)
    }));
  }

  /** @override */
  get title() {
    return this.object.name;
  }

  /** @override */
  async getData(options) {
    // Retrieve the data structure from the base sheet.
    const context = await super.getData(options);

    const hand = this.object;

    context.typeFlag =  hand.getFlag(CastleFalkenstein.id, "type");
    const deck = CastleFalkenstein.deck(context.typeFlag);

    context.spellBeingCast = hand.spellBeingCast;
    if (context.spellBeingCast)
      context.spellBeingCast.suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[context.spellBeingCast.spellObject.system.suit];
   
    context.disabled = {};

    context.disabled.openActor = context.inCompendium || CastleFalkensteinHandSheet.openActorDisabled(hand);
    context.disabled.refillHand = context.inCompendium || CastleFalkensteinHandSheet.refillHandDisabled(hand);
    context.disabled.chanceCard = context.inCompendium || CastleFalkensteinHandSheet.chanceCardDisabled(hand);

    context.disabled.gatherPower = context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.gatherPowerDisabled(hand);
    //context.disabled.releasePower = context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.releasePowerDisabled(card, hand);
    context.disabled.castSpell = context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.castSpellDisabled(hand);
    context.disabled.cancelSpell = context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.cancelSpellDisabled(hand);

    context.cardWidth = CastleFalkenstein.settings.cardWidth;
    context.cardHeight = CastleFalkenstein.computeCardHeight(deck);

    context.rtgVisuals = CastleFalkenstein.usingRTGCardVisuals(deck) ? "rtg-visuals" : "";

    return context;
  }

  async activateListeners(html) {
    this.rotateCards(html);
    html.find(".card img").click(this.cardClick.bind(this));
    html.find(".card img").mouseenter(this.cardMouseEnter.bind(this));
    html.find(".card img").mouseleave(this.cardMouseLeave.bind(this));
    super.activateListeners(html);
  }

  rotateCards(html) {
    let cardsAreas = html.find('.cards');
    const halfTranslation = CastleFalkenstein.settings.cardWidth/5;
    const halfAngle = 2;
    for (let area of cardsAreas) {
      for (let i = 0; i < area.children.length; i++) {
        let card = area.children[i];
        const factor = 1 - area.children.length + 2*i;
        card.style.transform = `rotateZ(${(factor * halfAngle)}deg) translateX(${factor * halfTranslation}px)`;
        card.style["z-index"] = 302 + i*4;
      }
    }
  }

  cardClick(event) {
    let eventCard = event.currentTarget.closest('li.card');
    eventCard.classList.toggle('focusedCard');

    const parent = eventCard.parentNode;
    const index = Array.prototype.indexOf.call(parent.children, eventCard);

    if (eventCard.classList.contains("focusedCard")) {
      eventCard.setAttribute("data-transf", eventCard.style.transform);
      eventCard.setAttribute("data-zind", eventCard.style["z-index"]);

      const hand = this.object;
      const typeFlag =  hand.getFlag(CastleFalkenstein.id, "type");
      const deck = CastleFalkenstein.deck(typeFlag);
      const cardHeight = CastleFalkenstein.computeCardHeight(deck);
      const scaleFactor = (cardHeight + 60) / cardHeight;
      eventCard.style.transform = `scale(${scaleFactor}) translateY(-25px)`;
      eventCard.children[1].style.transform = `scale(${1/scaleFactor})`;

      eventCard.style["z-index"] = 400 + index * 4;
    } else {
      eventCard.style.transform = eventCard.getAttribute("data-transf");
      eventCard.style["z-index"] = eventCard.getAttribute("data-zind");
      eventCard.children[1].style.transform = `scale(1)`;
    }
  }

  static CARD_MOUSE_ENTER_TRANSLATE = ` translateY(-10px)`;

  cardMouseEnter(event) {
    let eventCard = event.currentTarget.closest('li.card');

    let oneIsFocused = false;

    for (let card of eventCard.parentNode.children) {
      if (card.classList.contains("focusedCard")) {
        oneIsFocused = true;
      }
    };

    if (!oneIsFocused) {
      eventCard.style.transform = eventCard.style.transform += CastleFalkensteinHandSheet.CARD_MOUSE_ENTER_TRANSLATE;
    }
  }

  cardMouseLeave(event) {
    let eventCard = event.currentTarget.closest('li.card');
    eventCard.style.transform = eventCard.style.transform.replace(CastleFalkensteinHandSheet.CARD_MOUSE_ENTER_TRANSLATE,'');
  }

  /** @override */
  async _onCardControl(event) {
    super._onCardControl(event);

    const button = event.currentTarget;
    const li = button.closest(".card");
    const card = li ? this.object.cards.get(li.dataset.cardId) : null;

    const hand = this.object;

    // Handle the control action
    switch ( button.dataset.action ) {
      case "openActor":
        return CastleFalkensteinHandSheet.openActor(hand);
      case "refillHand":
        return CastleFalkensteinHandSheet.refillHand(hand);
      case "chanceCard":
        return CastleFalkensteinHandSheet.chanceCard(hand);
      case "gatherPower":
        return CastleFalkensteinHandSheet.gatherPower(hand);
      case "releasePower":
        return CastleFalkensteinHandSheet.releasePower(card, hand);
      case "castSpell":
        return CastleFalkensteinHandSheet.castSpell(hand);
      case "cancelSpell":
        return CastleFalkensteinHandSheet.cancelSpell(hand);
    }
  }

  static openActorDisabled(hand) {
    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");
    return actorFlag === "host";
  }

  static async openActor(hand) {
    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorFlag === "host")
      return;
    const actor = game.actors.get(actorFlag);
    if (!actor)
      return;

    const typeFlag = hand.getFlag(CastleFalkenstein.id, "type");

    if (typeFlag == "fortune") {
      actor.sheet.tabToOpen = "abilities";
    } else if (typeFlag == "sorcery") {
      actor.sheet.tabToOpen = "spells";
    }
    actor.sheet.render(true);
  }

  static refillHandDisabled(hand) {
    return hand.cards.size >= 4;
  }

  static async refillHand(hand) {
    const cardsDrawn = await CastleFalkenstein.draw("fortune", hand, 4 - hand.cards.size);

    // Refresh the local "Perform Feat" window, if any
    if (cardsDrawn.length > 0) {
      for (const form of Object.values(ui.windows)) {
        if (form instanceof CastleFalkensteinPerformFeat && form.hand.id == hand.id) {
          form.computeWrappedCards();
          form.render();
          break;
        }
      }
    }
  }

  static chanceCardDisabled(hand) {
    return false;
  }

  static async chanceCard(hand) {
    // pick a card out of the available ones in the deck

    const deck = CastleFalkenstein.fortuneDeck;
    if (deck.availableCards.length <= 0) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.cannotDraw"));
      return;
    }

    const card = deck.availableCards[Math.floor(Math.random() * deck.availableCards.length)];
    deck.shuffle({ chatNotification: false });

    // Post message to chat
    const flavor = `[${game.i18n.localize("castle-falkenstein.fortune.hand.chance")}]`;
    const correctSuit = 'correct-suit'; // will be grayed out otherwise
    const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card,`card-drawn ${correctSuit}`)}</div>`;
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    CastleFalkenstein.createChatMessage(actorId === "host" ? "gm" : game.actors.get(actorId), flavor, content);
  }

  static gatherPowerDisabled(hand) {
    //const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    //if (actorId === "host")
    //  return true;
    //const actor = game.actors.get(actorId);

    // TODO add "actor.isDragon" getter to allow implementation of this 5-card limit
    //if (actor.isDragon && hand.cards.size >= 5)
    //  return true;

    return !hand.spellBeingCast;
  }

  static async gatherPower(hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)
    const actor = game.actors.get(actorId);

    const cards = await CastleFalkenstein.draw("sorcery", hand, 1);
    const card = cards[0];

    // TODO mention whether the spell thaumic energy requirement has been reached. May not bode well with cooperation spellcasting scenarios though.

    // Post message to chat
    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.gatherPower")}]`;
    const spell = actor.items.get(hand.spellBeingCast.actorItemId);
    const correctSuit = (card.suit == spell.system.suit || card.suit == 'joker') ? 'correct-suit' : '';
    const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card, `card-drawn ${correctSuit}`)}</div>`;
    CastleFalkenstein.createChatMessage(actor, flavor, content);
  }

  static releasePowerDisabled(card, hand) {
    // TODO disable the release of unaligned power (if done, maybe reconsider label & chat messages content)
    //const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    //if (actorId === "host")
    //  return true;
    //const actor = game.actors.get(actorId);
    //return !actor.isSpellAligned(card);
    return false;
  }

  static async releasePower(card, hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)
    const actor = game.actors.get(actorId);

    await CastleFalkenstein.socket.executeAsGM("shuffleBackToDeck", hand.id, [card.id]);

    // Post message to chat - TOO SPAMMY => DISABLED
    /*const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.releasePower")}]`;
    const content = `<div class="cards-played">${CastleFalkenstein.smallCardImg(card, "card-played")}</div>`;
    CastleFalkenstein.createChatMessage(actor, flavor, content);*/
  }

  static castSpellDisabled(hand) {
    //const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    //if (actorId === "host")
    //  return true;

    // TODO disable if the thaumic energy requirement has not been reached? (may not bode well with cooperation spellcasting scenario though)

    return !hand.spellBeingCast;
  }

  static async castSpell(hand, force=false) {

    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)

    const spellBeingCast = hand.spellBeingCast;
    if (!spellBeingCast) return;

    if (!force && spellBeingCast.powerGathered < spellBeingCast.powerNeed) {
      const i18nTitle = game.i18n.localize("castle-falkenstein.dialogs.confirmTitle");
      const i18nDescription1 = game.i18n.localize("castle-falkenstein.dialogs.notEnoughPowerGathered.description1");
      const i18nDescription2 = game.i18n.localize("castle-falkenstein.dialogs.notEnoughPowerGathered.description2");

      Dialog.confirm({
        title: i18nTitle,
        content: `<p>${i18nDescription1}</p><p>${i18nDescription2}</p>`,
        yes: () => CastleFalkensteinHandSheet.castSpell(hand, true),
        defaultYes: false
      });
      return;
    }

    const actor = game.actors.get(actorId);
    const spell = actor.items.get(hand.spellBeingCast.actorItemId);

    // Chat message flavor
    let flavor = `[${game.i18n.localize(`castle-falkenstein.sorcery.hand.castSpell${force?"Forced":""}`)}]`;

    // in the chat message, display the spell name and aspect
    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[spell.system.suit];
    let content = `<b>${spell.name}</b> [<span class="suit-symbol-${spell.system.suit}">${suitSymbol}</span>]`;

    // TODO consider adding an expandable section which shows the original spell definitions:
    // FIXME the corresponding code exists in define-spell.mjs

    // in the chat message, display the cards played, if any
    content += `<hr/><div class="cards-played">`;
    if (hand.cards.contents.length > 0) {
      hand.cards.contents.forEach(card => {
        // FIXME code duplication
        const correctSuit = (card.suit == spell.system.suit || card.suit == 'joker') ? 'correct-suit' : '';
        content += CastleFalkenstein.smallCardImg(card,`card-played ${correctSuit}`);
      });
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    content += `</div>`;

    // in the chat message, display info about the Spell being Wild or  the Harmonics, if any
    if (spellBeingCast.isWildSpell) {
      content += `<hr/><div class="wild-spell">`
      content += game.i18n.localize("castle-falkenstein.sorcery.wildSpell");
      content += "</div>";
    } else if (spellBeingCast.harmonics) {
      // show harmonic type(s) (up to 3 for the GM to choose from in case of ex-aequo), if unaligned power was used.
      content += `<hr/><div class="harmonics">`

      if (spellBeingCast.harmonics.length == 1)
        content += game.i18n.localize("castle-falkenstein.sorcery.harmonics.labelOne") + ": ";
      else
        content += game.i18n.localize("castle-falkenstein.sorcery.harmonics.labelMore") + ":<br/>";

      let firstH = true;
      spellBeingCast.harmonics.forEach((hSuit) => {
        const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[hSuit];
        const description = game.i18n.localize(`castle-falkenstein.sorcery.harmonics.${hSuit}`);
        if (!firstH) content += ", ";
        content += `<span class="suit-symbol-${hSuit}">${suitSymbol}&nbsp;</span><span class="harmonics-desc">${description}</span></li>`
        firstH = false;
      });
      content += ".</div>";
    }

    // shuffle back the cards in the deck
    await CastleFalkenstein.socket.executeAsGM("shuffleBackToDeck", hand.id, hand.cards.map((c)=>{ return c.id; }));

    // Display the chat message only if the shuffle-back was successful
    CastleFalkenstein.createChatMessage(actor, flavor, content);

    // no spell being cast anymore
    await hand.stopCasting();

    // refresh the Sorcery hand sheet
    hand.sheet.render();
  }

  static cancelSpellDisabled(hand) {
    return !hand.spellBeingCast;
  }

  static async cancelSpell(hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)
    const actor = game.actors.get(actorId);


    await CastleFalkenstein.socket.executeAsGM("shuffleBackToDeck", hand.id, hand.cards.map((c)=>{ return c.id; }));

    // Post message to chat
    let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.cancelSpell")}]`;
    let content = ""; // TODO add info on spell which was canceled
    CastleFalkenstein.createChatMessage(actor, flavor, content);

    // no spell being cast anymore
    await hand.stopCasting();

    hand.sheet.render();
  }

}
