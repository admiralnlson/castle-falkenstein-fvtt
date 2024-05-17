import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CASTLE_FALKENSTEIN } from "../config.mjs";

// A form for performing a Feat.
export class CastleFalkensteinPerformFeat extends FormApplication {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-perform-feat",
      title: game.i18n.localize("castle-falkenstein.feat.perform"),
      template: "./systems/castle-falkenstein/src/forms/perform-feat.hbs",
      classes: ["castle-falkenstein castle-falkenstein-perform-feat", "sheet"],
      width: 400,
      height: "auto",
      closeOnSubmit: true,
      submitOnClose: false,
      resizable: true
    });
  }

  /** @override */
  constructor(ability, options = {}) {
    super(ability, options);
    this.ability = ability;
    this.character = ability.actor;
    this.hand = this.character.handIfExists("fortune");
    this.computeWrappedCards();
    this.divorceSuit = ability.system.suit;
  }

  computeWrappedCards() {
    this.wrappedCards = [];
    for (const card of this.hand.cards) {
      this.wrappedCards.push({
        card: card,
        checked: ""
      });
    }
    this.wrappedCards.sort((a, b) => (a.card.sort > b.card.sort) ? 1 : -1);
  }

  isCorrectSuit(card) {
    return (card.suit == "joker" ||
            (CastleFalkenstein.settings.divorceVariation != CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.disabled
             ? (card.suit == this.divorceSuit)
             : (card.suit == this.ability.system.suit)));
  }

  isDivorceUsed() {
    return this.divorceSuit != this.ability.system.suit;
  }

  computeTotal() {
    let total = CASTLE_FALKENSTEIN.abilityLevels[this.ability.system.level].value;

    for (const w of this.wrappedCards) {
      if (w.checked) {
        if (this.isCorrectSuit(w.card)) {
          if (this.isDivorceUsed() &&
              w.card.suit == this.divorceSuit &&
              CastleFalkenstein.settings.divorceVariation == CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.halfValue)
            total += Math.floor(w.card.value / 2);
          else
            total += w.card.value;
        } else {
          if (CastleFalkenstein.settings.halfOffVariation == CastleFalkenstein.HALF_OFF_VARIATION_OPTIONS.option1) {
            // always half-off
            total += Math.floor(w.card.value / 2);
          } else if (CastleFalkenstein.settings.halfOffVariation == CastleFalkenstein.HALF_OFF_VARIATION_OPTIONS.option2) {
            // Decision taken (b/c it's more natural):
            // In case Divorce is used, color-matching is based on the selected suit, not the original one from the Ability.
            const referenceSuit = this.isDivorceUsed() ? this.divorceSuit : this.ability.system.suit;

            if (w.card.suit == "spades"   && referenceSuit == "clubs"    ||
                w.card.suit == "clubs"    && referenceSuit == "spades"   ||
                w.card.suit == "hearts"   && referenceSuit == "diamonds" ||
                w.card.suit == "diamonds" && referenceSuit == "hearts") {
              // same color
              total += Math.floor(w.card.value / 2);
            } else {
              // different color
              total += 1;
            }
          } else {
            // half-off variation not used
            total += 1;
          }
        }
      }
    }

    return total;
  }

  /** @override */
  async getData() {
    if (this.wrappedCards.length > 0) {
      this.wrappedCards.forEach(w => {
        const correctSuitTag = this.isCorrectSuit(w.card) ? "correct-suit": "";
        w.smallCardImg = CastleFalkenstein.smallCardImg(w.card, `card-played ${correctSuitTag}`);
      });
    }

    let context = {};

    context.abilityLevelAsSentenceHtml = CastleFalkenstein.abilityLevelAsSentenceHtml(this.ability);

    context.wrappedCards = this.wrappedCards;

    context.total = this.computeTotal();

    context.suitHTML = {
      spades: CastleFalkenstein.cardSuitHTML("spades"),
      hearts: CastleFalkenstein.cardSuitHTML("hearts"),
      diamonds: CastleFalkenstein.cardSuitHTML("diamonds"),
      clubs: CastleFalkenstein.cardSuitHTML("clubs")
    };

    context.divorceSettingEnabled = (CastleFalkenstein.settings.divorceVariation != CastleFalkenstein.DIVORCE_VARIATION_OPTIONS.disabled);

    context.divorceSuit = this.divorceSuit;

    context.divorceHint = this.isDivorceUsed()
                          ? game.i18n.localize(`castle-falkenstein.ability.suitValues.${this.divorceSuit}`)
                          : game.i18n.localize(`castle-falkenstein.settings.divorceVariation.divorceNone`);

    context.displayMaxCards = (CastleFalkenstein.settings.hardLimitVariation != CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS.disabled.str);

    const maxCards = CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS[CastleFalkenstein.settings.hardLimitVariation].maxCards[this.ability.system.level];
    const format = (maxCards == 1)
                   ? "castle-falkenstein.settings.hardLimitVariation.maxCardsDrawableSingular"
                   : "castle-falkenstein.settings.hardLimitVariation.maxCardsDrawablePlural";
    context.maxCardsStr = game.i18n.format(format, { nb: maxCards });

    return context;
  }

  /** @override */
  activateListeners(html) {
    html.find('.feat-card-played-button').click(event => this.onClickCardSelect(event));
    html.find(".divorce-button").click( event => this.onClickDivorceSuitSelect(event));
  }

  onClickDivorceSuitSelect(event) {
    const suit = event.currentTarget.name;

    this.divorceSuit = suit;

    this.render();
  }

  onClickCardSelect(event) {
    const cardId = event.currentTarget.name;
    const w = this.wrappedCards.find(w => {return w.card.id == cardId});

    if (w.checked == "card-selected") {
      w.checked = "";
    } else {
      const alreadyCheckedCards = this.wrappedCards.filter(w => w.checked).length;

      const maxCards = CastleFalkenstein.HARD_LIMIT_VARIATION_OPTIONS[CastleFalkenstein.settings.hardLimitVariation].maxCards[this.ability.system.level];

      if (alreadyCheckedCards < maxCards)
        w.checked = "card-selected";
    }

    this.render();
  }

  static onRenderChatMessage(chatMessage, html, messageData) {
    html.find(".feat-chat-ranges-button").click(event => {
      let button = event.currentTarget;
      var content = button.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  /** @override */
  async _updateObject(event, formData) {
    
    // return the cards played back into the deck
    const wrappedCardsPlayed = this.wrappedCards.filter(w => w.checked);
    if (wrappedCardsPlayed.length > 0) {
      const hand = await this.character.hand("fortune");
      await CastleFalkenstein.socket.executeAsGM("returnBackToDeck", hand.id, wrappedCardsPlayed.map(w => w.card.id));

      // move the hand sheet to the top, so that the player may easily refill their hand.
      await hand.sheet.render(true);
    }
  
    //
    // produce the chat message
    //

    const flavor = `[${game.i18n.localize("castle-falkenstein.feat.perform")}]`;
    let content = CastleFalkenstein.abilityLevelAsSentenceHtml(this.ability);
    if (this.isDivorceUsed()) {
      content += "<hr />";
      content += `<label class="divorce-label">${game.i18n.localize('castle-falkenstein.settings.divorceVariation.divorceLabel')}</label>`;
      content += '&nbsp;' + game.i18n.localize(`castle-falkenstein.ability.suitValues.${this.divorceSuit}`);
      content += '&nbsp;' + CastleFalkenstein.cardSuitHTML(this.divorceSuit);
    }
    content += '<hr/><div class="cards-played">';
    if (wrappedCardsPlayed.length > 0) {
      wrappedCardsPlayed.forEach(w => {
        const correctSuitTag = this.isCorrectSuit(w.card) ? "correct-suit": "";
        content += CastleFalkenstein.smallCardImg(w.card, `card-played ${correctSuitTag}`);
      });
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    content += '</div>';
    const total = this.computeTotal();
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
    CastleFalkenstein.createChatMessage(this.character, flavor, content);
  }

}