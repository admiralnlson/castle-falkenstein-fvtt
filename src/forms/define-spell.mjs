import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

// A form for initiating a spell
export default class CastleFalkensteinDefineSpell extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-define-spell",
      title: game.i18n.localize("castle-falkenstein.sorcery.defineSpell"),
      template: "./systems/castle-falkenstein/src/forms/define-spell.hbs",
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
  constructor(spell, options = {}) {
    super(spell, options);
    this.spell = spell;
    this.character = spell.actor;

    this.spellBeingCast = {
      actorItemId: this.spell.id,
      definitionLevels: {},
      sorceryAbilityId: this.character.sorceryAbility.id,
      customModifier: 0
    };

    for (const key in CASTLE_FALKENSTEIN.spellDefinitions) {
      this.spellBeingCast.definitionLevels[key] = "-";
    }
  }
  
  computeTotal() {
    let total = this.spell.system.level;
    total -= CASTLE_FALKENSTEIN.abilityLevels[this.character.items.get(this.spellBeingCast.sorceryAbilityId).system.level].value;

    for (const [key, value] of Object.entries(this.spellBeingCast.definitionLevels)) {
      total += CASTLE_FALKENSTEIN.spellDefinitions[key].levels[value].value;
    }

    total += this.spellBeingCast.customModifier;

    return total > 0 ? total : 0;
  }

  /**
   * @override
   */
  async getData() {

    const selectedSorceryAbility = this.character.items.get(this.spellBeingCast.sorceryAbilityId);

    // error if the selected sorcery ability has disappeared since
    if (!selectedSorceryAbility) {
      CastleFalkenstein.notif.error(game.i18n.format("castle-falkenstein.notifications.characterDoesNotHaveAbility", {
        name: CastleFalkenstein.i18nSorceryAbility // approximation since the user may have selected a specialization in the meantime
      }));
    }

    return {
      selectedSorceryAbilityLevel: selectedSorceryAbility ? selectedSorceryAbility.system.levelValue : "not found",
      spell: this.spell,
      spellSuitSymbol: CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.system.suit],
      spellBeingCast: this.spellBeingCast,
      spellDefinitions: CASTLE_FALKENSTEIN.spellDefinitions,
      total: this.computeTotal(),
      availableSorceryAbilities: Object.fromEntries(this.character.sorceryAbilityAndSpecializations.map(a => [a.id, a.system.displayName]))
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.spell-definition-select').change(event => this._onDefinitionSelectChange(event));

    html.find('.sorcery-ability-select').change(event => this._onAbilitySelectChange(event));

    html.find('.custom-modifier').change(event => this._onCustomModifierChange(event));
  }

  _onDefinitionSelectChange(event) {
    this.spellBeingCast.definitionLevels[event.currentTarget.name] = event.currentTarget.value;
    this.render();
  }

  _onAbilitySelectChange(event) {
    this.spellBeingCast.sorceryAbilityId = event.currentTarget.value;
    this.render();
  }

  _onCustomModifierChange(event) {
    this.spellBeingCast.customModifier = parseInt(event.currentTarget.value);
    this.render();
  }

  /**
   * @override
   */
  async _updateObject(event, formData) {
    
    //
    // produce chat message
    //

    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.defineSpell")}]`;

    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.system.suit];
    let content = `<b>${this.spell.name}</b> [<span class="suit-symbol-${this.spell.system.suit}">${suitSymbol}</span>]<br/>`;
    content += `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.spell.system.level}<br/>`;
    content += CastleFalkenstein.abilityLevelAsSentenceHtml(this.character.items.get(this.spellBeingCast.sorceryAbilityId), false);
    content += '<hr/><div class="spell-definitions">';

    for (const [key, value] of Object.entries(CASTLE_FALKENSTEIN.spellDefinitions)) {
      content += `${game.i18n.localize(value.label)}: <b>${game.i18n.localize(value.levels[this.spellBeingCast.definitionLevels[key]].label)}</b><br/>`;
    }
    if (this.spellBeingCast.customModifier != 0) {
      const label = game.i18n.localize("castle-falkenstein.spell.customModifier");
      content += `${label}: <b>${this.spellBeingCast.customModifier}</b><br/>`;
    }

    content += '</div>';
    const total = this.computeTotal();
    content += `<div class="define-spell-total">${total}</div>`;

    let hand = await this.character.hand("sorcery");
    await hand.defineSpell(this.spellBeingCast);

    // Post message to chat
    CastleFalkenstein.createChatMessage(this.character, flavor, content);

    // rerenders the FormApp with the new data (will disappear soon though)
    this.render();

    // rerenders the hand to update buttons (disabled buttons such as 'Gather Power' will no longer be disabled)
    hand.sheet.render(true);
  }

}