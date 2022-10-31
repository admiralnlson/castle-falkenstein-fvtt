import CastleFalkenstein from "../castle-falkenstein.mjs";
import { CASTLE_FALKENSTEIN } from "../config.mjs";

// A form for performing a Feat.
export default class CastleFalkensteinPerformFeat extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-perform-feat",
      title: game.i18n.localize("castle-falkenstein.feat.perform"),
      template: "./systems/castle-falkenstein/src/forms/perform-feat.hbs",
      classes: ["castle-falkenstein castle-falkenstein-perform-feat", "sheet"],
      width: 300,
      height: "auto",
      closeOnSubmit: true,
      submitOnClose: false,
      resizable: true
    });
  }

  /**
   * @override
   */
  constructor(ability, options = {}) {
    super(ability, options);
    this.ability = ability;
    this.character = ability.actor;
    this.hand = this.character.handIfExists("fortune");
    this.wrappedCards = [];
    for (const card of this.hand.cards) {
      this.wrappedCards.push({
        card: card,
        correctSuit: (card.suit == this.ability.system.suit || card.suit == 'joker') ? 'correct-suit' : '',
        checked: ""
      });
    }
    this.wrappedCards.sort((a, b) => (a.card.sort > b.card.sort) ? 1 : -1);
  }

  computeTotal() {
    let total = CASTLE_FALKENSTEIN.abilityLevels[this.ability.system.level].value;

    for (const w of this.wrappedCards) {
      if (w.checked) {
        // Core rules only, variants not supported (yet?)
        if (w.card.suit == this.ability.system.suit || w.card.suit == "joker") {
          total += w.card.value;
        } else {
          total += 1;
        }
      }
    }

    return total;
  }

  /**
   * @override
   */
  async getData() {
    if (this.wrappedCards.length > 0) {
      this.wrappedCards.forEach(w => {
        w.smallCardImg = CastleFalkenstein.smallCardImg(w.card, `card-played ${w.correctSuit}`);
      });
    }

    return {
      abilityLevelAsSentenceHtml: CastleFalkenstein.abilityLevelAsSentenceHtml(this.ability),
      wrappedCards: this.wrappedCards,
      total: this.computeTotal()
    }
  }

  /** @override */
  activateListeners(html) {
    html.find('.feat-card-played-button').click(event => this.onClickCardSelect(event));
  }

  onClickCardSelect(event) {
    const cardId = event.currentTarget.name;
    const w = this.wrappedCards.find(w => {return w.card.id == cardId});
    w.checked = (w.checked == "card-selected") ? "" : "card-selected";

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

  /**
   * @override
   */
  async _updateObject(event, formData) {
    
    // log the cards played, and compute total before they are discarded

    let idsOfCardsPlayed = [];
    for (const w of this.wrappedCards) {
      if (w.checked) {
        idsOfCardsPlayed.push(w.card.id);
      }
    }

    // discard the cards
    const hand = await this.character.hand("fortune");
    await hand.pass(game.CastleFalkenstein.fortuneDiscardPile, idsOfCardsPlayed, {chatNotification: false});
  
    //
    // produce chat message
    //

    const flavor = `[${game.i18n.localize("castle-falkenstein.feat.perform")}]`;
    let content = CastleFalkenstein.abilityLevelAsSentenceHtml(this.ability);
    content += '<hr/><div class="cards-played">';
    if (idsOfCardsPlayed.length > 0) {
      this.wrappedCards.forEach(w => {
        if (w.checked) {
          content += CastleFalkenstein.smallCardImg(w.card, `card-played ${w.correctSuit}`);
        }
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
             + '  <div class="grid-2col feat-chat-ranges">'
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