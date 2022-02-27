import { CASTLE_FALKENSTEIN } from "../const.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

// A form for initiating a spell
export default class CastleFalkensteinDefineSpell extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-define-spell",
      title: game.i18n.localize("castle-falkenstein.spell.definitions"),
      template: "./systems/castle-falkenstein/system/forms/define-spell.hbs",
      classes: ["castle-falkenstein castle-falkenstein-define-spell", "sheet"],
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
    this.spell = object;
    this.character = object.actor;
  }

  computeTotal() {
    let total = this.spell.data.data.level - CASTLE_FALKENSTEIN.abilityLevels[this.character.sorceryAbility.data.data.level].value;

    // TODO add definition levels

    return total > 0 ? total : 0;
  }

  /**
   * @override
   */
  async getData() {
    return {
      sorceryLevelAsSentenceHtml: CastleFalkenstein.abilityLevelAsSentenceHtml(this.character.sorceryAbility, false),
      spell: this.spell,
      spellSuitSymbol: CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.data.data.suit],
      total: this.computeTotal()
    }
  }

  /** @override */
  activateListeners(html) {
    //No listener at this stage
    //html.find('.spell-card-played-button').click(event => this.onClickCardSelect(event));
  }

  static onRenderChatMessage(chatMessage, html, messageData) {
    html.find(".spell-chat-ranges-button").click(event => {
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
    
    //
    // produce chat message
    //

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.character });
    const rollMode = game.settings.get('core', 'rollMode');
    const flavor = `[${game.i18n.localize("castle-falkenstein.spell.definitions")}]`;

    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.data.data.suit];
    let content = `<b>${this.spell.name}</b> [<span class="suit-symbol-${this.spell.data.data.suit}">${suitSymbol}</span>]<br/>`;
    content += `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.spell.data.data.level}`;
    content += '<hr/><div class="spell-definitions">';

    // TODO add definitions

    content += '</div><hr/>';
    content += CastleFalkenstein.abilityLevelAsSentenceHtml(this.character.sorceryAbility, false);
    const total = this.computeTotal();
    content += `<div class="define-spell-total">${total}</div>`;

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