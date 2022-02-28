import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

// A form for initiating a spell
export default class CastleFalkensteinDefineSpell extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-define-spell",
      title: game.i18n.localize("castle-falkenstein.spell.definition.definitions"),
      template: "./systems/castle-falkenstein/system/forms/define-spell.hbs",
      classes: ["castle-falkenstein castle-falkenstein-define-spell", "sheet"],
      width: 400,
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

    // FIXME, should be a property of character
    this.spellBeingCast = {
      spell: "", // FIXME unused thus far
      artefact: "",  // FIXME unused thus far
      definitions: {}
    };

    for (const [key, value] of Object.entries(CASTLE_FALKENSTEIN.spellDefinitions)) {
      this.spellBeingCast.definitions[key] = {
        label: value.label,
        levels: value.levels,
        value: 0
      };
    }
  }
  
  computeTotal() {
    let total = this.spell.data.data.level - CASTLE_FALKENSTEIN.abilityLevels[this.character.sorceryAbility.data.data.level].value;

    for (const [key, value] of Object.entries(this.spellBeingCast.definitions)) {
      total += value.value;
    }

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
      spellBeingCast: this.spellBeingCast,
      total: this.computeTotal()
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.spell-definition-select').change(event => this._onSelectChange(event));
  }

  _onSelectChange(event) {
    this.spellBeingCast.definitions[event.currentTarget.name].value = parseInt(event.currentTarget.value);
    this.render(); // rerenders the FormApp with the new data.
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
    const flavor = `[${game.i18n.localize("castle-falkenstein.spell.definition.definitions")}]`;

    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.data.data.suit];
    let content = `<b>${this.spell.name}</b> [<span class="suit-symbol-${this.spell.data.data.suit}">${suitSymbol}</span>]<br/>`;
    content += `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.spell.data.data.level}`;
    content += '<hr/><div class="spell-definitions">';

    for (const [key, value] of Object.entries(this.spellBeingCast.definitions)) {
      content += `${game.i18n.localize(value.label)}: <b>${game.i18n.localize(value.levels[value.value])}</b><br/>`;
    }

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