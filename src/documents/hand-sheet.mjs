import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * Sheet for the Cards Hand.
 * @extends {CardsHand}
 */
export class CastleFalkensteinHandSheet extends CardsHand {

  static HEIGHT_WITHOUT_FEAT_OR_SPELL = 57;
  static HEIGHT_WITH_FEAT = 116;
  static HEIGHT_WITH_SPELL = 116;

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "cards-hand", "cards-config"],
      width: 350,
      height: CastleFalkensteinHandSheet.HEIGHT_WITHOUT_FEAT_OR_SPELL,
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
    const featActive = hand.getFlag(CastleFalkenstein.id, 'featBeingPerformed');

    super.render(force, foundry.utils.mergeObject(options, {
      height: (featActive
               ? CastleFalkensteinHandSheet.HEIGHT_WITH_FEAT
               : (spellActive
                  ? CastleFalkensteinHandSheet.HEIGHT_WITH_SPELL
                  : CastleFalkensteinHandSheet.HEIGHT_WITHOUT_FEAT_OR_SPELL))
    }));
  }

  /** @override */
  get title() {
    const hand = this.object;

    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");
    const feat = hand.featBeingPerformed;
    if (actorFlag === "host" && feat && feat.actor)
      return `${hand.name} (${feat.actor.name})`;
    else
      return hand.name;
  }

  /** @override */
  async _onDrop(event) {
    if (! await CastleFalkenstein.onDropOnCardStack(event, this))
      return;

    return await super._onDrop(event);
  }

  /** @override */
  _onSortCard(event, card) {

    // Identify a specific card as the drop target
    let target = null;
    const li = event.target.closest("[data-card-id]");
    if ( li ) target = this.object.cards.get(li.dataset.cardId) ?? null;

    if (li && li.dataset.cardId == card.id)
      return this;

    return super._onSortCard(event, card);
  }

  /** @override */
  async getData(options) {
    // Retrieve the data structure from the base sheet.
    const context = await super.getData(options);

    const hand = this.object;

    CastleFalkenstein.translateCardStack(hand);

    context.typeFlag =  hand.getFlag(CastleFalkenstein.id, "type");
    let deck;
    if (context.typeFlag)
      deck = CastleFalkenstein.deck(context.typeFlag);
    context.cardHeight = CastleFalkenstein.computeCardHeight(deck);
    context.rtgVisuals = CastleFalkenstein.usingRTGCardVisuals(deck) ? "rtg-visuals" : "";

    if (context.typeFlag == "fortune") {

      context.featBeingPerformed = hand.featBeingPerformed;

      let i18nRefillKey = (4 - hand.cards.size > 1 ? "refillPlural" : "refillSingular");
      context.i18nRefill = game.i18n.format(`castle-falkenstein.fortune.hand.${i18nRefillKey}`, {
        nb: 4 - hand.cards.size
      });

      context.cards.forEach(card => {
        if (!context.featBeingPerformed || hand.isCorrectFeatSuit(card))
          card.correctSuit = "correct-suit";
        else
          card.correctSuit = "";

        if (card.suit == "joker")
          card.joker = "joker";
        else
          card.joker = "";
      });

      if (context.featBeingPerformed) {
        context.abilityLevelAsSentenceHtml = CastleFalkenstein.abilityLevelAsSentenceHtml(context.featBeingPerformed.ability);

        context.total = hand.computeFeatTotal();

        context.suitHTML = {
          spades: CastleFalkenstein.cardSuitHTML("spades"),
          hearts: CastleFalkenstein.cardSuitHTML("hearts"),
          diamonds: CastleFalkenstein.cardSuitHTML("diamonds"),
          clubs: CastleFalkenstein.cardSuitHTML("clubs")
        };

        context.cards.forEach(card => {
          if (card.getFlag(CastleFalkenstein.id, "selected"))
            card.selected = "selected";
          else
            card.selected = "";
        });

        context.divorceSettingEnabled = (CastleFalkenstein.settings.divorceVariation != CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.disabled);

        context.divorceSuit = hand.featBeingPerformed.divorceSuit;

        context.divorceHint = hand.isDivorceUsed()
                              ? game.i18n.localize(`castle-falkenstein.ability.suitValues.${hand.featBeingPerformed.divorceSuit}`)
                              : game.i18n.localize(`castle-falkenstein.settings.divorceVariation.divorceNone`);

        context.displayMaxCards = (CastleFalkenstein.settings.hardLimitVariation != CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS.disabled.str);

        const maxCards = CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS[CastleFalkenstein.settings.hardLimitVariation].maxCards[hand.featBeingPerformed?.ability.system.level];
        const format = (maxCards == 1)
                      ? "castle-falkenstein.settings.hardLimitVariation.maxCardsDrawableSingular"
                      : "castle-falkenstein.settings.hardLimitVariation.maxCardsDrawablePlural";
        context.maxCardsStr = game.i18n.format(format, { nb: maxCards });
      }
    } else if (context.typeFlag == "sorcery") {

      context.spellBeingCast = hand.spellBeingCast;
      if (context.spellBeingCast) {
        context.spellBeingCast.suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[context.spellBeingCast.spell.system.suit];

        context.cards.forEach(card => {
          if (card.suit == "joker" || card.suit == context.spellBeingCast.spell.system.suit)
            card.correctSuit = "correct-suit";
          else
            card.correctSuit = "";

          if (card.suit == "joker")
            card.joker = "joker";
          else
            card.joker = "";
        });
      }
    
      context.readyToCast = context.spellBeingCast
                            ? (context.spellBeingCast.powerGathered >= context.spellBeingCast.powerNeed || context.spellBeingCast.isWildSpell
                              ? "ready-to-cast"
                              : "")
                            : "";
    }

    context.disabled = {};

    context.disabled.openActor = context.inCompendium || CastleFalkensteinHandSheet.openActorDisabled(hand);
    context.disabled.refillHand = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.refillHandDisabled(hand);
    context.disabled.triggerFeat = !context.owner || context.inCompendium || !context.featBeingPerformed || CastleFalkensteinHandSheet.triggerFeatDisabled(hand);
    context.disabled.cancelFeat = !context.owner || context.inCompendium || !context.featBeingPerformed || CastleFalkensteinHandSheet.cancelFeatDisabled(hand);
    context.disabled.chanceCard = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.chanceCardDisabled(hand);

    context.disabled.gatherPower = !context.owner || context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.gatherPowerDisabled(hand);
    context.disabled.castSpell = !context.owner || context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.castSpellDisabled(hand);
    context.disabled.cancelSpell = !context.owner || context.inCompendium || !context.spellBeingCast || CastleFalkensteinHandSheet.cancelSpellDisabled(hand);
    context.harmonicHTML = CastleFalkensteinHandSheet.harmonicHTML(hand, true);

    context.cardWidth = CastleFalkenstein.settings.cardWidth;
    context.cardControlScale = Math.max(1, 1.5 * context.cardWidth / 400);

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    this.rotateCards(html);
  
    // TODO if added, let's make sure this does not conflict left-click which selects cards when performing a feat
    // Adding a :not(.focusedCards) below does not seem to do the job.
    //html.find(".card").contextmenu(this.cardZoom.bind(this));
    //html.find(".card.focusedCard").click((event) => { this.cardZoom(event); event.preventDefault();});

    html.find('.card').click(async(event) => { await this.onClickCard(event); });

    html.find(".divorce-button").click(async(event) => { await this.onClickDivorceSuitSelect(event); });
    
    let handedCards = html.find("ol.cards");
    handedCards.on("dragenter", (e) => {
      e.target.classList.add('draghover');
    });
    handedCards.on("dragleave", (e) => {
      e.target.classList.remove('draghover');
    });
    handedCards.on("drop", (e) => {
      e.target.classList.remove('draghover');
    });
  }

  rotateCards(html) {
    let cardsAreas = html.find('.cards');
    const halfTranslation = CastleFalkenstein.settings.cardWidth/4;
    const halfAngle = 2;
    for (let area of cardsAreas) {
      for (let i = 0; i < area.children.length; i++) {
        let card = area.children[i];
        const factor = 1 - area.children.length + 2*i;
        card.style.transform = `rotateZ(${(factor * halfAngle)}deg) translateX(${factor * halfTranslation}px) translateY(var(--card-hover-translateY))`;
        card.style["z-index"] = 302 + i*4;
      }
    }
  }

  // not used
  cardZoom(event) {
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
      case "triggerFeat":
        return CastleFalkensteinHandSheet.triggerFeat(hand);
      case "cancelFeat":
        return CastleFalkensteinHandSheet.cancelFeat(hand);
      case "chanceCard":
        return CastleFalkensteinHandSheet.chanceCard(hand);
      case "gatherPower":
        return CastleFalkensteinHandSheet.gatherPower(hand);
      case "releasePower":
        event.stopPropagation(); // prevents zoom on the card
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
    await CastleFalkenstein.draw("fortune", hand, 4 - hand.cards.size);
  }

  static triggerFeatDisabled(hand) {
    return !hand.featBeingPerformed;
  }

  static cancelFeatDisabled(hand) {
    return !hand.featBeingPerformed;
  }

  static chanceCardDisabled(hand) {
    return false;
  }

  static async triggerFeat(hand) {
  
    const cardsPlayed = hand.cards.filter(card => card.getFlag(CastleFalkenstein.id, "selected"));

    //
    // produce the chat message
    //

    const flavor = `[${game.i18n.localize("castle-falkenstein.feat.perform")}]`;
    let content = CastleFalkenstein.abilityLevelAsSentenceHtml(hand.featBeingPerformed.ability);
    if (hand.isDivorceUsed()) {
      content += "<hr />";
      content += `<label class="divorce-label">${game.i18n.localize('castle-falkenstein.settings.divorceVariation.divorceLabel')}</label>`;
      content += '&nbsp;' + game.i18n.localize(`castle-falkenstein.ability.suitValues.${hand.featBeingPerformed.divorceSuit}`);
      content += '&nbsp;' + CastleFalkenstein.cardSuitHTML(hand.featBeingPerformed.divorceSuit);
    }
    content += '<hr/><div class="cards-played">';
    if (cardsPlayed.length > 0) {
      cardsPlayed.forEach(card => {
        const correctSuitTag = hand.isCorrectFeatSuit(card) ? "correct-suit": "";
        content += CastleFalkenstein.smallCardImg(card, `card-played ${correctSuitTag}`);
      });
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    content += '</div>';
    const total = hand.computeFeatTotal();
    content += `<hr/><button type="button" class="feat-chat-ranges-button">${total}</button>`;

    const highSuccessMax = Math.floor(total/2);
    const fullSuccessMax = Math.floor(total*2/3);
    const fumbleMin = Math.round((total+0.6)*2);
    content += '<div class="feat-chat-ranges-collapsible">'
          //  + '  <hr />'
              + '  <div class="grid grid-2col feat-chat-ranges">'
              + `    <span class="feat-chat-range">0-${highSuccessMax}</span><span>${game.i18n.localize("castle-falkenstein.feat.highSuccess")}</span>`;
    if (total > 2) { // when total is 2 (FAI with no cards), a full success is impossible
      content += `    <span class="feat-chat-range">${highSuccessMax+1}-${fullSuccessMax}</span><span>${game.i18n.localize("castle-falkenstein.feat.fullSuccess")}</span>`
    }
    content += `    <span class="feat-chat-range">${fullSuccessMax+1}-${total}</span><span>${game.i18n.localize("castle-falkenstein.feat.partialSuccess")}</span>`
              + `    <span class="feat-chat-range">${total+1}-${fumbleMin-1}</span><span>${game.i18n.localize("castle-falkenstein.feat.failure")}</span>`
              + `    <span class="feat-chat-range">${fumbleMin}+</span><span>${game.i18n.localize("castle-falkenstein.feat.fumble")}</span>`
              + '  </div>'
              + '</div>';

    // Post message to chat
    CastleFalkenstein.createChatMessage(hand.featBeingPerformed.actor, flavor, content, true);

    // return the cards played back into the deck
    if (cardsPlayed.length > 0) {
      await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, cardsPlayed.map(card => card.id));
    }
    
    // no feat being performed anymore
    await hand.stopPerformingFeat();
    
    // move the hand sheet to the top, so that the player may easily refill their hand.
    await hand.sheet.render(true);
  }

  static async cancelFeat(hand) {
    // unselect cards
    hand.cards.forEach(card => {
      card.unsetFlag(CastleFalkenstein.id, "selected");
    });

    // no feat being performed anymore
    await hand.stopPerformingFeat();
    await hand.sheet.render(true);
  }

  async onClickDivorceSuitSelect(event) {
    const suit = event.currentTarget.name;

    const hand = this.object;
    const fbp = await hand.getFlag(CastleFalkenstein.id, "featBeingPerformed");
    fbp.divorceSuit = suit;
    await hand.setFlag(CastleFalkenstein.id, "featBeingPerformed", fbp);

    this.render();
  }

  async onClickCard(event) {

    const hand = this.object;
    const typeFlag = hand.getFlag(CastleFalkenstein.id, "type");

    if (typeFlag == "fortune" && hand.featBeingPerformed) {
      const cardId = event.currentTarget.getAttribute("data-card-id");
      const card = hand.cards.find(card => {return card.id == cardId});

      if (card.getFlag(CastleFalkenstein.id, "selected")) {
        await card.unsetFlag(CastleFalkenstein.id, "selected");
      } else {
        const alreadySelectedCards = hand.cards.filter(card => card.getFlag(CastleFalkenstein.id, "selected")).length;

        const maxCards = CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS[CastleFalkenstein.settings.hardLimitVariation].maxCards[hand.featBeingPerformed.ability.system.level];

        if (alreadySelectedCards < maxCards)
          await card.setFlag(CastleFalkenstein.id, "selected", true);
      }

      this.render();
    }

  }

  static async chanceCard(hand) {
    // pick a card out of the available ones in the deck

    const deck = CastleFalkenstein.fortuneDeck;

    if (deck.availableCards.length <= 0) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.cannotDraw"));
      return;
    }

    const card = deck.availableCards[Math.floor(Math.random() * deck.availableCards.length)];

    // Post message to chat
    const flavor = `[${game.i18n.localize("castle-falkenstein.fortune.hand.chance")}]`;
    const correctSuit = 'correct-suit'; // will be grayed out otherwise
    const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card,`card-drawn ${correctSuit}`)}</div>`;
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    CastleFalkenstein.createChatMessage(actorId === "host" ? "gm" : game.actors.get(actorId), flavor, content, true);
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
    CastleFalkenstein.createChatMessage(actor, flavor, content, true);
  }

  static async releasePower(card, hand, force = false) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)

    if (hand.spellBeingCast?.usesThaumixology) {
      const i18nTitle = game.i18n.localize("castle-falkenstein.dialogs.confirmTitle");
      const i18nDescription1 = game.i18n.format("castle-falkenstein.dialogs.thaumixologyReleaseAllPower.description1");
      const i18nDescription2 = game.i18n.localize("castle-falkenstein.dialogs.thaumixologyReleaseAllPower.description2");

      if (!force) {
        Dialog.confirm({
          title: i18nTitle,
          content: `<p>${i18nDescription1}</p><p>${i18nDescription2}</p>`,
          yes: async () => {
            CastleFalkensteinHandSheet.releasePower(card, hand, true);
          },
          defaultYes: false
        });

        return;
      }
    }

    await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, [card.id]);

    // Post message to chat - TOO SPAMMY => DISABLED
    /*const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.releasePower")}]`;
    const content = `<div class="cards-played">${CastleFalkenstein.smallCardImg(card, "card-played")}</div>`;
    CastleFalkenstein.createChatMessage(actor, flavor, content, true);*/
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
    let content = `<b>${spell.name}</b> ` + CastleFalkenstein.cardSuitHTML(spell.system.suit);

    // TODO consider adding an expandable section which shows the original spell definitions:
    // FIXME the corresponding code exists in define-spell.mjs

    // in the chat message, display the cards played, if any
    content += `<hr/><div class="cards-played">`;
    if (hand.cards.contents.length > 0) {
      hand.cards.contents.sort((a,b) => ((a.sort || 0) - (b.sort || 0))).forEach(card => {
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
      content += `<span style="--x:0;   --y:0; --xt:13; --yt:12; --xd:1; --yd:2; --w:25;  --d:1;  --o:.4;" class="pt s1"><b></b></span>`;
      content += `<span style="--x:-17; --y:0; --xt:14; --yt:10; --xd:2; --yd:1; --w:39;  --d:2;  --o:.5;" class="pt s2"><b></b></span>`;
      content += `<span style="--x:34;  --y:0; --xt:15; --yt:10; --xd:3; --yd:3; --w:28;  --d:3;  --o:.4;" class="pt s3"><b></b></span>`;
      content += `<span style="--x:45;  --y:0; --xt:16; --yt:13; --xd:1; --yd:2; --w:38;  --d:4;  --o:.5;" class="pt s4"><b></b></span>`;
      content += `<span style="--x:6;   --y:0; --xt:17; --yt:10; --xd:2; --yd:1; --w:58;  --d:5;  --o:.7;" class="pt s1"><b></b></span>`;
      content += `<span style="--x:-35; --y:0; --xt:18; --yt:10; --xd:3; --yd:3; --w:45;  --d:6;  --o:.6;" class="pt s2"><b></b></span>`;
      content += `<span style="--x:-1;  --y:0; --xt:19; --yt:10; --xd:1; --yd:2; --w:65;  --d:7;  --o:.8;" class="pt s3"><b></b></span>`;
      content += `<span style="--x:-30; --y:0; --xt:20; --yt:12; --xd:2; --yd:1; --w:70;  --d:8;  --o:.8;" class="pt s4"><b></b></span>`;

      content += `<span style="--x:-8;  --y:0; --xt:21; --yt:12; --xd:3; --yd:3; --w:70;  --d:8;  --o:.8;" class="pt s1"><b></b></span>`;
      content += `<span style="--x:8;   --y:0; --xt:22; --yt:10; --xd:1; --yd:2; --w:65;  --d:7;  --o:.8;" class="pt s2"><b></b></span>`;
      content += `<span style="--x:40;  --y:0; --xt:23; --yt:10; --xd:2; --yd:1; --w:45;  --d:6;  --o:.6;" class="pt s3"><b></b></span>`;
      content += `<span style="--x:25;  --y:0; --xt:24; --yt:13; --xd:3; --yd:3; --w:58;  --d:5;  --o:.7;" class="pt s4"><b></b></span>`;
      content += `<span style="--x:-15; --y:0; --xt:25; --yt:10; --xd:1; --yd:2; --w:38;  --d:4;  --o:.5;" class="pt s1"><b></b></span>`;
      content += `<span style="--x:-18; --y:0; --xt:26; --yt:10; --xd:2; --yd:1; --w:28;  --d:3;  --o:.4;" class="pt s2"><b></b></span>`;
      content += `<span style="--x:15;  --y:0; --xt:27; --yt:10; --xd:3; --yd:3; --w:39;  --d:2;  --o:.5;" class="pt s3"><b></b></span>`;
      content += `<span style="--x:30;  --y:0; --xt:28; --yt:12; --xd:1; --yd:2; --w:25;  --d:1;  --o:.4;" class="pt s4"><b></b></span>`;

      content += game.i18n.localize("castle-falkenstein.sorcery.wildSpell");
      content += "</div>";
    } else if (spellBeingCast.harmonics) {
      // show harmonic type(s) (up to 3 for the GM to choose from in case of ex-aequo), if unaligned power was used.
      content += `<hr/><div class="harmonics">`
      content += CastleFalkensteinHandSheet.harmonicHTML(hand, false);
      content += "</div>";
    }

    // return back the cards in the deck
    await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, hand.cards.map(c => c.id));

    // Display the chat message only if the return-back was successful
    CastleFalkenstein.createChatMessage(actor, flavor, content, true);

    // no spell being cast anymore
    await hand.stopCasting();
    hand.sheet.render();
  }

  static harmonicHTML(hand, short) {

    let content = "";

    content += game.i18n.localize("castle-falkenstein.sorcery.harmonics.label") + " ";

    if (hand.spellBeingCast?.harmonics?.length > 0) {
      let firstH = true;
      hand.spellBeingCast.harmonics.forEach((hSuit) => {
        const description = game.i18n.localize(`castle-falkenstein.sorcery.harmonics.${hSuit}`);
        if (!firstH) content += ", ";
        content += `<span class="harmonics-desc">${description}</span>&nbsp;${CastleFalkenstein.cardSuitHTML(hSuit)}</li>`
        firstH = false;
      });
    } else {
      content += " " + game.i18n.localize(`castle-falkenstein.sorcery.harmonics.none`);
    }
    content += ".";

    return content;
  }

  static cancelSpellDisabled(hand) {
    return !hand.spellBeingCast;
  }

  static async cancelSpell(hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host")
      return; // should never be able to click from host hand anyway (see 'disabled' above)
    const actor = game.actors.get(actorId);

    await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, hand.cards.map(c => c.id));

    // Post message to chat
    let flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.cancelSpell")}]`;
    let content = ""; // TODO add info on spell which was canceled
    CastleFalkenstein.createChatMessage(actor, flavor, content, true);

    // no spell being cast anymore
    await hand.stopCasting();
    hand.sheet.render();
  }

}
