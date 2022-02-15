import { CASTLE_FALKENSTEIN } from "../helpers/config.mjs";

// A form for performing a Feat.
export default class CastleFalkensteinPerformFeat extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-perform-feat",
      title: game.i18n.localize("castle-falkenstein.feat.perform"),
      template: "./systems/castle-falkenstein/templates/perform-feat.hbs",
      classes: ["castle-falkenstein-perform-feat", "sheet"],
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
  constructor(object = {}, options = {}) {
    super(object, options);
    this.ability = object;
    this.character = object.actor;
    this.fortuneHand = game.cards.get(object.actor.data.data.hands.fortune);
    this.wrappedCards = [];
    for (const card of this.fortuneHand.cards) {
      this.wrappedCards.push({
        card: card,
        checked: ""
      });
    }
  }

  computeScore() {
    let score = CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].value;

    for (const w of this.wrappedCards) {
      if (w.checked) {
        // Core rules only, variants not supported (yet?)
        if (w.card.data.suit == this.ability.data.data.suit || w.card.data.suit == "joker") {
          score += w.card.data.value;
        } else {
          score += 1;
        }
      }
    }

    return score;
  }

  /**
   * @override
   */
  async getData() {
    return {
      abilityData: this.ability.data,
      levelI18nLabel: game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].full),
      levelValue: CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].value,
      wrappedCards: this.wrappedCards,
      score: this.computeScore()
    }
  }

  /** @override */
  activateListeners(html) {
    html.find('.perform-feat-card-select').click(event => this.onClickCardSelect(event));
  }

  onClickCardSelect(event) {
    const cardId = event.currentTarget.name;
    const checked = event.currentTarget.checked;
    const w = this.wrappedCards.find(w => {return w.card.id == cardId});
    w.checked = checked ? "checked" : "";

    this.render(); // rerenders the FormApp with the new data.
  }

  static onRenderChatMessage(chatMessage, html, messageData) {
    html.find(".feat-chat-ranges-button").click(event => {
      console.log("Castle Falkenstein | .feat-chat-ranges-button clicked");

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
    
    // log the cards played, and compute score before they are discarded

    let idsOfCardsPlayed = [];
    for (const w of this.wrappedCards) {
      if (w.checked) {
        idsOfCardsPlayed.push(w.card.id);
      }
    }

    // discard the cards
    await this.fortuneHand.pass(game.CastleFalkenstein.fortuneDiscardPile, idsOfCardsPlayed, {chatNotification: false});
  
    //
    // TODO produce chat message
    //

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.character });
    const rollMode = game.settings.get('core', 'rollMode');
    const flavor = `[${game.i18n.localize("castle-falkenstein.feat.feat")}]`;
    const levelI18nKey = game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].full);
    const levelValue = CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].value;
    let content = `${game.i18n.localize(levelI18nKey)} [${levelValue}]`
                + `${game.i18n.localize("castle-falkenstein.ability.levelNameSeparator")}`
                + `<b>${this.ability.name}</b> [<i class="cf-cards-generic-${this.ability.data.data.suit}"></i>]`;
    content += '<hr/>';
    if (idsOfCardsPlayed.length > 0) {
      content += `${game.i18n.localize("castle-falkenstein.feat.cardsPlayed")}:<ul>`;
      this.wrappedCards.forEach(w => {
        if (w.checked) {
          content += `<li>${w.card.name}</li>`;
        }
      });
      content += '</ul>';
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    const total = this.computeScore();
    content += `<hr/>${game.i18n.localize("castle-falkenstein.feat.total")}: <button type="button" class="feat-chat-ranges-button">${total}</button>`;

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
    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: flavor,
      content: content
    });

    // rerenders the FormApp with the new data.
    this.render();
  }

}