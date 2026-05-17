import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

const { CardHandConfig } = foundry.applications.sheets;

/**
 * Sheet for a Castle Falkenstein "hand" Cards stack.
 */
export class CastleFalkensteinHandSheet extends CardHandConfig {

  static HEIGHT_WITHOUT_FEAT_OR_SPELL = 57;
  static HEIGHT_WITH_FEAT = 116;
  static HEIGHT_WITH_SPELL = 116;

  static DEFAULT_OPTIONS = {
    classes: ["castle-falkenstein", "sheet", "cards-hand", "cards-config"],
    position: { width: 350, height: 150 },
    window: { resizable: true },
    actions: {
      openActor: CastleFalkensteinHandSheet._onOpenActor,
      refillHand: CastleFalkensteinHandSheet._onRefillHand,
      triggerFeat: CastleFalkensteinHandSheet._onTriggerFeat,
      cancelFeat: CastleFalkensteinHandSheet._onCancelFeat,
      chanceCard: CastleFalkensteinHandSheet._onChanceCard,
      gatherPower: CastleFalkensteinHandSheet._onGatherPower,
      castSpell: CastleFalkensteinHandSheet._onCastSpell,
      cancelSpell: CastleFalkensteinHandSheet._onCancelSpell,
      releasePower: CastleFalkensteinHandSheet._onReleasePower,
      playHostFortuneCard: CastleFalkensteinHandSheet._onPlayHostFortuneCard,
      cardClick: CastleFalkensteinHandSheet._onCardClick,
      divorceSuit: CastleFalkensteinHandSheet._onDivorceSuit
    }
  };

  static PARTS = {
    sheet: {
      template: "systems/castle-falkenstein/src/documents/hand-sheet.hbs",
      root: true
    }
  };

  /** @override */
  static TABS = {};

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  get title() {
    const hand = this.document;
    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");
    const feat = hand.featBeingPerformed;
    if (actorFlag === "host" && feat && feat.actor) return `${hand.name} (${feat.actor.name})`;
    return hand.name;
  }

  static computeHeight(hand) {
    const featActive = hand.getFlag(CastleFalkenstein.id, "featBeingPerformed");
    const spellActive = hand.getFlag(CastleFalkenstein.id, "spellBeingCast");
    if (featActive) return CastleFalkensteinHandSheet.HEIGHT_WITH_FEAT;
    if (spellActive) return CastleFalkensteinHandSheet.HEIGHT_WITH_SPELL;
    return CastleFalkensteinHandSheet.HEIGHT_WITHOUT_FEAT_OR_SPELL;
  }

  /* -------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const hand = this.document;

    CastleFalkenstein.translateCardStack(hand);

    context.cards = hand.cards.contents;
    context.owner = hand.isOwner;
    context.inCompendium = !!hand.pack;

    context.typeFlag = hand.getFlag(CastleFalkenstein.id, "type");
    let deck;
    if (context.typeFlag) deck = CastleFalkenstein.deck(context.typeFlag);
    context.cardHeight = CastleFalkenstein.computeCardHeight(deck);
    context.rtgVisuals = CastleFalkenstein.usingRTGCardVisuals(deck) ? "rtg-visuals" : "";

    if (context.typeFlag === "fortune") {
      context.hostFortune = game.user.isGM && hand.getFlag(CastleFalkenstein.id, "actor") === "host";

      context.featBeingPerformed = hand.featBeingPerformed;

      const i18nRefillKey = (4 - hand.cards.size > 1 ? "refillPlural" : "refillSingular");
      context.i18nRefill = game.i18n.format(`castle-falkenstein.fortune.hand.${i18nRefillKey}`, {
        nb: 4 - hand.cards.size
      });

      context.cards.forEach(card => {
        if (!context.featBeingPerformed || hand.isCorrectFeatSuit(card)) card.correctSuit = "correct-suit";
        else card.correctSuit = "";
        card.joker = card.suit === "joker" ? "joker" : "";
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
          card.selected = card.getFlag(CastleFalkenstein.id, "selected") ? "selected" : "";
        });

        context.divorceSettingEnabled = (CastleFalkenstein.settings.divorceVariation !== CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.disabled);
        context.divorceSuit = hand.featBeingPerformed.divorceSuit;
        context.divorceHint = hand.isDivorceUsed()
          ? game.i18n.localize(`castle-falkenstein.ability.suitValues.${hand.featBeingPerformed.divorceSuit}`)
          : game.i18n.localize(`castle-falkenstein.settings.divorceVariation.divorceNone`);

        context.displayMaxCards = (CastleFalkenstein.settings.hardLimitVariation !== CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS.disabled.str);
        const maxCards = CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS[CastleFalkenstein.settings.hardLimitVariation].maxCards[hand.featBeingPerformed?.ability.system.level];
        const format = (maxCards === 1)
          ? "castle-falkenstein.settings.hardLimitVariation.maxCardsDrawableSingular"
          : "castle-falkenstein.settings.hardLimitVariation.maxCardsDrawablePlural";
        context.maxCardsStr = game.i18n.format(format, { nb: maxCards });
      }
    } else if (context.typeFlag === "sorcery") {
      context.spellBeingCast = hand.spellBeingCast;
      if (context.spellBeingCast) {
        context.spellBeingCast.suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[context.spellBeingCast.spell.system.suit];
        context.cards.forEach(card => {
          if (card.suit === "joker" || card.suit === context.spellBeingCast.spell.system.suit) card.correctSuit = "correct-suit";
          else card.correctSuit = "";
          card.joker = card.suit === "joker" ? "joker" : "";
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
    context.disabled.triggerFeat = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.triggerFeatDisabled(hand);
    context.disabled.cancelFeat = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.cancelFeatDisabled(hand);
    context.disabled.chanceCard = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.chanceCardDisabled(hand);
    context.disabled.gatherPower = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.gatherPowerDisabled(hand);
    context.disabled.castSpell = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.castSpellDisabled(hand);
    context.disabled.cancelSpell = !context.owner || context.inCompendium || CastleFalkensteinHandSheet.cancelSpellDisabled(hand);
    context.harmonicHTML = CastleFalkensteinHandSheet.harmonicHTML(hand, true);

    context.cardWidth = CastleFalkenstein.settings.cardWidth;
    context.cardControlScale = Math.max(1, 1.5 * context.cardWidth / 400);

    return context;
  }

  /* -------------------------------------------- */

  async _onRender(context, options) {
    await super._onRender(context, options);

    // Dynamic height based on feat/spell state
    this.setPosition({ height: CastleFalkensteinHandSheet.computeHeight(this.document) });

    // Hand-shaped card rotation effect
    this.rotateCards();

    // Drop-target visual feedback on the card row
    this.element.querySelectorAll("ol.cards").forEach(ol => {
      ol.addEventListener("dragenter", e => e.target.classList.add("draghover"));
      ol.addEventListener("dragleave", e => e.target.classList.remove("draghover"));
      ol.addEventListener("drop", e => e.target.classList.remove("draghover"));
    });
  }

  rotateCards() {
    const cardsAreas = this.element.querySelectorAll(".cards");
    const halfTranslation = CastleFalkenstein.settings.cardWidth / 4;
    const halfAngle = 2;
    for (const area of cardsAreas) {
      for (let i = 0; i < area.children.length; i++) {
        const card = area.children[i];
        const factor = 1 - area.children.length + 2 * i;
        card.style.transform = `rotateZ(${(factor * halfAngle)}deg) translateX(${factor * halfTranslation}px) translateY(var(--card-hover-translateY))`;
        card.style["z-index"] = 302 + i * 4;
      }
    }
  }

  /* -------------------------------------------- */
  /*  PopOut integration                          */
  /* -------------------------------------------- */

  static async onPopout(app, popout) {
    if (app instanceof CastleFalkensteinHandSheet) {
      const cardWidth = CastleFalkenstein.settings.cardWidth;
      const hand = app.document;
      const deckType = hand.getFlag(CastleFalkenstein.id, "type");
      const deck = CastleFalkenstein.deck(deckType);

      const innerWidth = cardWidth * (deckType === "fortune" ? 2.5 : 3.5);
      const innerHeight = CastleFalkenstein.computeCardHeight(deck) * (deckType === "fortune" ? 1.2 : 1.3)
        + (deckType === "fortune" ? CastleFalkensteinHandSheet.HEIGHT_WITH_FEAT : CastleFalkensteinHandSheet.HEIGHT_WITH_SPELL) + 5;

      popout.resizeTo(innerWidth + popout.outerWidth - app.position.width,
        innerHeight + popout.outerHeight - app.position.height);
    }
  }

  /* -------------------------------------------- */
  /*  Actions                                     */
  /* -------------------------------------------- */

  static async _onOpenActor(event, target) {
    return CastleFalkensteinHandSheet.openActor(this.document);
  }

  static async _onRefillHand(event, target) {
    return CastleFalkensteinHandSheet.refillHand(this.document);
  }

  static async _onTriggerFeat(event, target) {
    return CastleFalkensteinHandSheet.triggerFeat(this.document);
  }

  static async _onCancelFeat(event, target) {
    return CastleFalkensteinHandSheet.cancelFeat(this.document);
  }

  static async _onChanceCard(event, target) {
    return CastleFalkensteinHandSheet.chanceCard(this.document);
  }

  static async _onGatherPower(event, target) {
    return CastleFalkensteinHandSheet.gatherPower(this.document);
  }

  static async _onCastSpell(event, target) {
    return CastleFalkensteinHandSheet.castSpell(this.document);
  }

  static async _onCancelSpell(event, target) {
    return CastleFalkensteinHandSheet.cancelSpell(this.document);
  }

  static async _onReleasePower(event, target) {
    event.stopPropagation();
    const li = target.closest(".card");
    const card = li ? this.document.cards.get(li.dataset.cardId) : null;
    return CastleFalkensteinHandSheet.releasePower(card, this.document);
  }

  static async _onPlayHostFortuneCard(event, target) {
    const li = target.closest(".card");
    const card = li ? this.document.cards.get(li.dataset.cardId) : null;
    return CastleFalkensteinHandSheet.playHostFortuneCard(card, this.document);
  }

  static async _onCardClick(event, target) {
    return this.onClickCard(event, target);
  }

  static async _onDivorceSuit(event, target) {
    return this.onClickDivorceSuitSelect(event, target);
  }

  /* -------------------------------------------- */

  async onClickCard(event, target) {
    const hand = this.document;
    const typeFlag = hand.getFlag(CastleFalkenstein.id, "type");

    if (typeFlag !== "fortune") return;
    if (!hand.featBeingPerformed && !(game.user.isGM && !hand.featBeingPerformed)) return;

    const cardId = target.getAttribute("data-card-id") ?? target.closest(".card")?.dataset.cardId;
    const card = hand.cards.find(c => c.id === cardId);
    if (!card) return;

    if (card.getFlag(CastleFalkenstein.id, "selected")) {
      await card.unsetFlag(CastleFalkenstein.id, "selected");
    } else {
      const alreadySelected = hand.cards.filter(c => c.getFlag(CastleFalkenstein.id, "selected")).length;

      let maxCards = 4;
      if (hand.featBeingPerformed) {
        maxCards = CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS[CastleFalkenstein.settings.hardLimitVariation].maxCards[hand.featBeingPerformed.ability.system.level];
      }

      if (alreadySelected < maxCards) await card.setFlag(CastleFalkenstein.id, "selected", true);
    }

    this.render();
  }

  async onClickDivorceSuitSelect(event, target) {
    const suit = target.name;
    const hand = this.document;
    const fbp = await hand.getFlag(CastleFalkenstein.id, "featBeingPerformed");
    fbp.divorceSuit = suit;
    await hand.setFlag(CastleFalkenstein.id, "featBeingPerformed", fbp);

    this.render();
  }

  /* -------------------------------------------- */
  /*  Static helpers (re-rendering / disabled)    */
  /* -------------------------------------------- */

  static openActorDisabled(hand) {
    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorFlag === "host") {
      // intentionally empty — preserved from original
    }
  }

  static async openActor(hand) {
    const actorFlag = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorFlag === "host") return;

    const actor = game.actors.get(actorFlag);
    if (!actor) return;

    const typeFlag = hand.getFlag(CastleFalkenstein.id, "type");
    if (typeFlag === "fortune") actor.sheet.tabToOpen = "abilities";
    else if (typeFlag === "sorcery") actor.sheet.tabToOpen = "spells";
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

    if (cardsPlayed.length > 0 && !game.users.activeGM) {
      CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
      return;
    }

    const flavor = `[${game.i18n.localize("castle-falkenstein.feat.perform")}]`;
    let content = CastleFalkenstein.abilityLevelAsSentenceHtml(hand.featBeingPerformed.ability);
    if (hand.isDivorceUsed()) {
      content += "<hr />";
      content += `<label class="divorce-label">${game.i18n.localize("castle-falkenstein.settings.divorceVariation.divorceLabel")}</label>`;
      content += "&nbsp;" + game.i18n.localize(`castle-falkenstein.ability.suitValues.${hand.featBeingPerformed.divorceSuit}`);
      content += "&nbsp;" + CastleFalkenstein.cardSuitHTML(hand.featBeingPerformed.divorceSuit);
    }
    content += "<hr/><div class=\"cards-played\">";
    if (cardsPlayed.length > 0) {
      cardsPlayed.forEach(card => {
        const correctSuitTag = hand.isCorrectFeatSuit(card) ? "correct-suit" : "";
        content += CastleFalkenstein.smallCardImg(card, `card-played ${correctSuitTag}`);
      });
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    content += "</div>";
    const total = hand.computeFeatTotal();
    content += `<hr/><button type="button" class="feat-chat-ranges-button">${total}</button>`;

    const highSuccessMax = Math.floor(total / 2);
    const fullSuccessMax = Math.floor(total * 2 / 3);
    const fumbleMin = Math.round((total + 0.6) * 2);
    content += "<div class=\"feat-chat-ranges-collapsible\">"
      + "  <div class=\"grid grid-2col feat-chat-ranges\">"
      + `    <span class="feat-chat-range">0-${highSuccessMax}</span><span>${game.i18n.localize("castle-falkenstein.feat.highSuccess")}</span>`;
    if (total > 2) {
      content += `    <span class="feat-chat-range">${highSuccessMax + 1}-${fullSuccessMax}</span><span>${game.i18n.localize("castle-falkenstein.feat.fullSuccess")}</span>`;
    }
    content += `    <span class="feat-chat-range">${fullSuccessMax + 1}-${total}</span><span>${game.i18n.localize("castle-falkenstein.feat.partialSuccess")}</span>`
      + `    <span class="feat-chat-range">${total + 1}-${fumbleMin - 1}</span><span>${game.i18n.localize("castle-falkenstein.feat.failure")}</span>`
      + `    <span class="feat-chat-range">${fumbleMin}+</span><span>${game.i18n.localize("castle-falkenstein.feat.fumble")}</span>`
      + "  </div>"
      + "</div>";

    CastleFalkenstein.createChatMessage(hand.featBeingPerformed.actor, flavor, content);

    if (cardsPlayed.length > 0) {
      await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, cardsPlayed.map(card => card.id));
    }

    await hand.stopPerformingFeat();
    await hand.sheet.render(true);
  }

  static async cancelFeat(hand) {
    hand.cards.forEach(card => {
      card.unsetFlag(CastleFalkenstein.id, "selected");
    });
    await hand.stopPerformingFeat();
    await hand.sheet.render(true);
  }

  static async chanceCard(hand) {
    const deck = CastleFalkenstein.fortuneDeck;
    if (deck.availableCards.length <= 0) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.cannotDraw"));
      return;
    }
    const card = deck.availableCards[Math.floor(Math.random() * deck.availableCards.length)];

    const flavor = `[${game.i18n.localize("castle-falkenstein.fortune.hand.chance")}]`;
    const correctSuit = "correct-suit";
    const content = `<div class="cards-played">${CastleFalkenstein.smallCardImg(card, `card-played ${correctSuit}`)}</div>`;
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    CastleFalkenstein.createChatMessage(actorId === "host" ? "gm" : game.actors.get(actorId), flavor, content);
  }

  static gatherPowerDisabled(hand) {
    return !hand.spellBeingCast;
  }

  static async gatherPower(hand) {
    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host") return;
    const actor = game.actors.get(actorId);

    const cards = await CastleFalkenstein.draw("sorcery", hand, 1);
    const card = cards[0];

    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.gatherPower")}]`;
    const spell = actor.items.get(hand.spellBeingCast.actorItemId);
    const correctSuit = (card.suit === spell.system.suit || card.suit === "joker") ? "correct-suit" : "";
    const content = `<div class="cards-drawn">${CastleFalkenstein.smallCardImg(card, `card-drawn ${correctSuit}`)}</div>`;
    CastleFalkenstein.createChatMessage(actor, flavor, content);
  }

  static async playHostFortuneCard(card, hand) {
    if (!game.user.isGM) return;

    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId !== "host") return;

    const flavor = `[${game.i18n.localize("castle-falkenstein.fortune.hand.playCard")}]`;
    const correctSuit = "correct-suit";
    const content = `<div class="cards-played">${CastleFalkenstein.smallCardImg(card, `card-played ${correctSuit}`)}</div>`;
    CastleFalkenstein.createChatMessage("gm", flavor, content);

    CastleFalkenstein.returnBackToDeck(hand.id, [card.id]);
  }

  static async releasePower(card, hand, force = false) {
    if (!game.users.activeGM) {
      CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
      return;
    }

    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host") return;

    if (hand.spellBeingCast?.usesThaumixology && !force) {
      const i18nTitle = game.i18n.localize("castle-falkenstein.dialogs.confirmTitle");
      const i18nDescription1 = game.i18n.format("castle-falkenstein.dialogs.thaumixologyReleaseAllPower.description1");
      const i18nDescription2 = game.i18n.localize("castle-falkenstein.dialogs.thaumixologyReleaseAllPower.description2");

      foundry.applications.api.DialogV2.confirm({
        window: { title: i18nTitle },
        content: `<p>${i18nDescription1}</p><p>${i18nDescription2}</p>`,
        yes: { callback: () => CastleFalkensteinHandSheet.releasePower(card, hand, true) },
        defaultYes: false
      });
      return;
    }

    await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, [card.id]);
  }

  static castSpellDisabled(hand) {
    return !hand.spellBeingCast;
  }

  static async castSpell(hand, force = false) {
    if (!game.users.activeGM) {
      CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
      return;
    }

    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host") return;

    const spellBeingCast = hand.spellBeingCast;
    if (!spellBeingCast) return;

    if (!force && spellBeingCast.powerGathered < spellBeingCast.powerNeed) {
      const i18nTitle = game.i18n.localize("castle-falkenstein.dialogs.confirmTitle");
      const i18nDescription1 = game.i18n.localize("castle-falkenstein.dialogs.notEnoughPowerGathered.description1");
      const i18nDescription2 = game.i18n.localize("castle-falkenstein.dialogs.notEnoughPowerGathered.description2");

      foundry.applications.api.DialogV2.confirm({
        window: { title: i18nTitle },
        content: `<p>${i18nDescription1}</p><p>${i18nDescription2}</p>`,
        yes: { callback: () => CastleFalkensteinHandSheet.castSpell(hand, true) },
        defaultYes: false
      });
      return;
    }

    const actor = game.actors.get(actorId);
    const spell = actor.items.get(hand.spellBeingCast.actorItemId);

    let flavor = `[${game.i18n.localize(`castle-falkenstein.sorcery.hand.castSpell${force ? "Forced" : ""}`)}]`;
    let content = `<b>${spell.name}</b> ` + CastleFalkenstein.cardSuitHTML(spell.system.suit);

    content += `<hr/><div class="cards-played">`;
    if (hand.cards.contents.length > 0) {
      hand.cards.contents.sort((a, b) => ((a.sort || 0) - (b.sort || 0))).forEach(card => {
        const correctSuit = (card.suit === spell.system.suit || card.suit === "joker") ? "correct-suit" : "";
        content += CastleFalkenstein.smallCardImg(card, `card-played ${correctSuit}`);
      });
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    content += `</div>`;

    if (spellBeingCast.isWildSpell) {
      content += `<hr/><div class="wild-spell">`;
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
      content += `<hr/><div class="harmonics">`;
      content += CastleFalkensteinHandSheet.harmonicHTML(hand, false);
      content += "</div>";
    }

    await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, hand.cards.map(c => c.id));

    CastleFalkenstein.createChatMessage(actor, flavor, content);

    await hand.stopCasting();
    hand.sheet.render();
  }

  static harmonicHTML(hand, short) {
    let content = "";
    content += game.i18n.localize("castle-falkenstein.sorcery.harmonics.label") + " ";

    if (hand.spellBeingCast?.harmonics?.length > 0) {
      let firstH = true;
      hand.spellBeingCast.harmonics.forEach(hSuit => {
        const description = game.i18n.localize(`castle-falkenstein.sorcery.harmonics.${hSuit}`);
        if (!firstH) content += ", ";
        content += `<span class="harmonics-desc">${description}</span>&nbsp;${CastleFalkenstein.cardSuitHTML(hSuit)}</li>`;
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
    if (!game.users.activeGM) {
      CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
      return;
    }

    const actorId = hand.getFlag(CastleFalkenstein.id, "actor");
    if (actorId === "host") return;
    const actor = game.actors.get(actorId);

    await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, hand.cards.map(c => c.id));

    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.hand.cancelSpell")}]`;
    const content = "";
    CastleFalkenstein.createChatMessage(actor, flavor, content);

    await hand.stopCasting();
    hand.sheet.render();
  }
}
