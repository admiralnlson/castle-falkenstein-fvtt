import { CASTLE_FALKENSTEIN } from "../helpers/config.mjs";

// A form for performing a Feat.
export default class CastleFalkensteinPerformFeat extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-perform-feat",
      title: game.i18n.localize("castle-falkenstein.feat.perform"),
      template: "./systems/castle-falkenstein/templates/perform-feat.hbs",
      classes: ["castle-falkenstein-perform-feat", "sheet"],
      width: 500,
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

    // reset checked status. We don't want it to persist between forms.
    for (const card of this.fortuneHand.cards) {
      card.data.checked = false;
    }
  }

  computeScore() {
    let score = CASTLE_FALKENSTEIN.abilityLevels[this.ability.data.data.level].value;

    for (const card of this.fortuneHand.cards) {
      const cardData = card.data;
      if (cardData.checked) {
        // Based on core rules, variants not supposed (yet?)
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

    this.fortuneHand.cards.get(cardId).data.checked = checked;

    this.render(); // rerenders the FormApp with the new data.
  }

  /**
   * @override
   */
  async _updateObject(event, formData) {
    
    // play the cards played

    let idsOfCardPlayed = [];
    for (const card of this.fortuneHand.cards) {
      const cardData = card.data;
      if (cardData.checked) {
        idsOfCardPlayed.push(card.id);
      }
    }

    const score = this.computeScore();

    await this.fortuneHand.pass(game.CastleFalkenstein.fortuneDiscardPile, idsOfCardPlayed, {}, 'pass', false);
  
    // TODO produce chat message

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.character });
    const rollMode = game.settings.get('core', 'rollMode');
    let flavor = `[${game.i18n.localize("castle-falkenstein.feat.feat")}]`;
    let content = `${this.ability.name}<hr/>`
                + `${game.i18n.localize("castle-falkenstein.feat.score")}: ${score}`;

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