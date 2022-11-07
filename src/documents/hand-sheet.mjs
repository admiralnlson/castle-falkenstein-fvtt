import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";document

/**
 * Sheet for the default Cards Hand.
 * @extends {CardsHand}
 */
export class CastleFalkensteinHandSheet extends CardsHand {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "cardsHand", "cards-config"],
      width: 300,
      top: 150,
      resizable: false,
      template: "systems/castle-falkenstein/src/documents/hand-sheet.hbs",
    })
  }

  /** @override */
  get title() {
    return this.object.name;
  }

  /** @override */
  async getData(options) {
    // Retrieve the data structure from the base sheet.
    const context = super.getData(options);

    const hand = this.object;
    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");

    context.disabled = {};

    context.disabled.openActor = context.inCompendium || CastleFalkensteinHandSheet.openActorDisabled(hand);
    context.disabled.refillHand = context.inCompendium || CastleFalkensteinHandSheet.refillHandDisabled(hand);
    context.disabled.chanceCard = context.inCompendium || CastleFalkensteinHandSheet.chanceCardDisabled(hand);

    context.disabled.gatherPower = context.inCompendium || CastleFalkensteinHandSheet.gatherPowerDisabled(hand);
    //context.disabled.releasePower = context.inCompendium || CastleFalkensteinHandSheet.releasePowerDisabled(card, hand);
    context.disabled.castSpell = context.inCompendium || CastleFalkensteinHandSheet.castSpellDisabled(hand);
    context.disabled.cancelSpell = context.inCompendium || CastleFalkensteinHandSheet.cancelSpellDisabled(hand);

    return context;
  }

  async activateListeners(html) {
    this.rotateCards(html);
    html.find(".card img").click(this.focusCard.bind(this));
    super.activateListeners(html);
  }

  rotateCards(html) {
    let cardsAreas = html.find('.cards');
    for (let area of cardsAreas) {
      for (let i = 0; i < area.children.length; i++) {
        let card = area.children[i];
        card.style.transform = `rotateZ(${(i * 4)}deg) translateX(${i * 30}px)`;
        card.style["z-index"] = 302 + i*4;
      }
      area.style.transform = `rotateZ(${-((area.children.length - 1) * 2)}deg) translateX(-${area.children.length * 15}px)`
    }
  }

  focusCard(event) {
    let eventCard = event.currentTarget.closest('li.card');
    eventCard.classList.toggle('focusedCard');
    let correction = parseInt(eventCard.parentElement.style.transform.replace("rotateZ(", "").replace(")deg", "")) * -1;
    if (eventCard.classList.contains("focusedCard")) {
      eventCard.setAttribute("data-rot", eventCard.style.transform);
      eventCard.setAttribute("data-zind", eventCard.style["z-index"])
      eventCard.style.transform = `rotateZ(${correction}deg) scale(1.5) translate(7%, 40%)`;
      eventCard.style["z-index"] = 400 - correction;
    } else {
      eventCard.style.transform = eventCard.getAttribute("data-rot");
      eventCard.style["z-index"] = eventCard.getAttribute("data-zind");
    }
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
    actor.sheet.render(true, { focus: true });
  }

  static refillHandDisabled(hand) {
    return hand.cards.size >= 4;
  }

  static async refillHand(hand) {
    await CastleFalkenstein.draw("fortune", hand, 4 - hand.cards.size);
  }

  static chanceCardDisabled(hand) {
    return false;
  }

  static async chanceCard(hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");

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
    const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card, `card-played ${correctSuit}`)}</div>`;
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

    await card.pass(CastleFalkenstein.sorceryDiscardPile, {chatNotification: false});

    // Post message to chat
    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.releasePower")}]`;
    const content = `<div class="cards-played">${CastleFalkenstein.smallCardImg(card, "card-played")}</div>`;
    CastleFalkenstein.createChatMessage(actor, flavor, content);
  }

  static castSpellDisabled(hand) {
    //const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    //if (actorId === "host")
    //  return true;

    // TODO disable if the thaumic energy requirement has not been reached? (may not bode well with cooperation spellcasting scenario though)

    return !hand.spellBeingCast;
  }

  static async castSpell(hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)
    const actor = game.actors.get(actorId);
    const spell = actor.items.get(hand.spellBeingCast.actorItemId);

    // Post message to chat
    let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.castSpell")}]`;

    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[spell.system.suit];
    let content = `<b>${spell.name}</b> [<span class="suit-symbol-${spell.system.suit}">${suitSymbol}</span>]<hr/><div class="cards-played">`;

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

    // TODO add "<score> / <total>"" box.
    // TODO show harmonic type(s) (up to 3 for the GM to choose from in case of ex-aequo), if unaligned power was used.

    await hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

    CastleFalkenstein.createChatMessage(actor, flavor, content);

    // no spell being cast anymore
    await hand.stopCasting();

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

    await hand.pass(CastleFalkenstein.sorceryDiscardPile, hand.cards.map((c)=>{ return c.id; }), {chatNotification: false});

    // Post message to chat
    let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.cancelSpell")}]`;
    let content = ""; // FIXME add info on spell which was canceled
    CastleFalkenstein.createChatMessage(actor, flavor, content);

    // no spell being cast anymore
    await hand.stopCasting();

    hand.sheet.render();
  }

}
