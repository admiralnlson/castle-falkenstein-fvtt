import { CASTLE_FALKENSTEIN } from "../helpers/config.mjs";

// A form for performing a Feat.
export default class CastleFalkensteinPerformFeat extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-perform-feat",
      title: game.i18n.localize("castle-falkenstein.feat.perform"),
      template: "./systems/castle-falkenstein/templates/perform-feat.hbs",
      classes: ["castle-falkenstein-perform-feat", "sheet"],
      width: 250,
      height: "auto",
      closeOnSubmit: true,
      submitOnClose: false,
      resizable: true
    });
  }

  setCardChecked(card, checked) {
    (card.data.data.volatile ??= {}).checked = checked;
  }

  getCardChecked(card) {
    return card.data.data.volatile.checked;
  }

  /**
   * @override
   */
  constructor(object = {}, options = {}) {
    super(object, options);
    this.ability = object;
    this.character = object.actor;
    this.fortuneHand = game.cards.get(object.actor.data.data.hands.fortune);

    // reset checked status. We don't want it to persist between forms.
    for (const card of this.fortuneHand.cards) {
      this.setCardChecked(card, false);
    }
  }

  computeScore() {
    let score = CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].value;

    for (const card of this.fortuneHand.cards) {
      if (this.getCardChecked(card)) {
        // Based on core rules, variants not supposed (yet?)
        const cardData = card.data;
        if (cardData.suit == this.ability.data.data.suit || cardData.suit == "joker") {
          score += cardData.value;
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
      cards: this.fortuneHand.data.cards,
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
    this.setCardChecked(this.fortuneHand.cards.get(cardId), checked);

    this.render(); // rerenders the FormApp with the new data.
  }

  /**
   * @override
   */
  async _updateObject(event, formData) {
    
    // log the cards played, and compute score before they are discarded

    const score = this.computeScore();

    let cardsPlayed = [];
    for (const card of this.fortuneHand.cards) {
      if (this.getCardChecked(card)) {
        cardsPlayed.push(card);
      }
    }

    // discard the cards
    await this.fortuneHand.pass(game.CastleFalkenstein.fortuneDiscardPile, cardsPlayed.map((card) => { return card.id; }), {chatNotification: false});
  
    //
    // TODO produce chat message
    //

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.character });
    const rollMode = game.settings.get('core', 'rollMode');
    const flavor = `[${game.i18n.localize("castle-falkenstein.feat.feat")}]`;
    const levelI18nKey = game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].full);
    const levelValue = CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].value;
    let content = `${this.ability.name} [<i class="cf-cards-generic-${this.ability.data.data.suit}"></i>]`
               + `${game.i18n.localize("castle-falkenstein.ability.levelNameSeparator")}`
               + `${game.i18n.localize(levelI18nKey)} [${levelValue}]`;
    content += '<hr/>';
    if (cardsPlayed.length > 0) {
      content += `${game.i18n.localize("castle-falkenstein.feat.cardsPlayed")}:<ul>`;
      cardsPlayed.forEach(card => {
        content += `<li>${card.name}</li>`;
      });
      content += '</ul>';
    } else {
      content += game.i18n.localize("castle-falkenstein.feat.noCardsPlayed");
    }
    content += `<hr/>${game.i18n.localize("castle-falkenstein.feat.score")}: ${score}`;

    // TODO use 'idsOfCardPlayed' here to complete the message

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