import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinCards } from "../documents/cards.mjs";

// A form for initiating a spell
export class CastleFalkensteinDefineSpell extends FormApplication {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
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

  /** @override */
  constructor(spell, options = {}) {
    super(spell, options);
    this.spell = spell;
    this.character = spell.actor;

    this.spellBeingCast = {
      actorItemId: this.spell.id,
      definitionLevels: {},
      sorceryAbilityId: this.character.sorceryAbility.id,
      customModifier: { label: game.i18n.localize("castle-falkenstein.spell.customModifier"), value: 0 },
      usesThaumixology: false
    };

    for (const key in CASTLE_FALKENSTEIN.spellDefinitions) {
      this.spellBeingCast.definitionLevels[key] = "-";
    }
  }
  
  computeTotal() {
    return CastleFalkensteinCards.computeTotalPowerNeed(this.character, this.spellBeingCast);
  }

  /** @override */
  async getData() {

    const selectedSorceryAbility = this.character.items.get(this.spellBeingCast.sorceryAbilityId);

    // error if the selected sorcery ability has disappeared since
    if (!selectedSorceryAbility) {
      CastleFalkenstein.notif.error(game.i18n.format("castle-falkenstein.notifications.characterDoesNotHaveAbility", {
        name: CastleFalkenstein.i18nSorceryAbility // approximation since the user may have selected a specialization in the meantime
      }));
    }

    let context = {};

    context.selectedSorceryAbilityLevel = selectedSorceryAbility ? selectedSorceryAbility.system.levelValue : "not found";

    context.spell = this.spell;

    context.spellSuitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.system.suit];

    context.spellBeingCast = this.spellBeingCast;

    context.spellDefinitions = CASTLE_FALKENSTEIN.spellDefinitions;

    context.total = this.computeTotal();

    context.availableSorceryAbilities = Object.fromEntries(this.character.sorceryAbilityAndSpecializations.map(a => [a.id, a.system.displayName]));

    context.thaumixologySettingEnabled = CastleFalkenstein.settings.thaumixologyVariation == CastleFalkenstein.THAUMIXOLOGY_VARIATION_OPTIONS.enabled;
    
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.spell-definition-select').change(event => this._onDefinitionSelectChange(event));

    html.find('.sorcery-ability-select').change(event => this._onAbilitySelectChange(event));

    html.find('.custom-modifier-label').change(event => this._onCustomModifierLabelChange(event));

    html.find('.custom-modifier-value').change(event => this._onCustomModifierValueChange(event));

    html.find(".thaumixology-checkbox").change(event => this._onThaumixologyCheckboxChange(event));
  }

  _onDefinitionSelectChange(event) {
    this.spellBeingCast.definitionLevels[event.currentTarget.name] = event.currentTarget.value;
    this.render();
  }

  _onAbilitySelectChange(event) {
    this.spellBeingCast.sorceryAbilityId = event.currentTarget.value;
    this.render();
  }

  _onCustomModifierLabelChange(event) {
    this.spellBeingCast.customModifier.label = event.currentTarget.value;
    this.render();
  }

  _onCustomModifierValueChange(event) {
    this.spellBeingCast.customModifier.value = parseInt(event.currentTarget.value);
    this.render();
  }

  _onThaumixologyCheckboxChange(event) {
    this.spellBeingCast.usesThaumixology = event.currentTarget.checked;
    this.render();
  }

  /** @override */
  async _updateObject(event, formData) {
    
    //
    // produce chat message
    //

    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.defineSpell")}]`;

    let content = `<b>${this.spell.name}</b> ` + CastleFalkenstein.cardSuitHTML(this.spell.system.suit) + `<br/>`;
    content += `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.spell.system.level}<br/>`;
    content += CastleFalkenstein.abilityLevelAsSentenceHtml(this.character.items.get(this.spellBeingCast.sorceryAbilityId), false);

    content += '<hr/><div class="spell-definitions">';

    for (const [key, value] of Object.entries(CASTLE_FALKENSTEIN.spellDefinitions)) {
      content += `${game.i18n.localize(value.label)}: <b>${game.i18n.localize(value.levels[this.spellBeingCast.definitionLevels[key]].label)}</b><br/>`;
    }
    if (this.spellBeingCast.customModifier.value != 0) {
      content += `${this.spellBeingCast.customModifier.label}: <b>${this.spellBeingCast.customModifier.value}</b><br/>`;
    }
    content += '</div>';

    if (this.spellBeingCast.usesThaumixology) {
      content += `<b>${game.i18n.localize("castle-falkenstein.settings.thaumixologyVariation.leverageChatHint")}</b><br/>`;
    }
    
    const total = this.computeTotal();
    content += `<hr /><div class="define-spell-total">${total}</div>`;

    let hand = await this.character.hand("sorcery");
    await hand.startCasting(this.spellBeingCast);

    // Post message to chat
    CastleFalkenstein.createChatMessage(this.character, flavor, content);

    // rerenders the FormApp with the new data (will disappear soon though)
    this.render();

    // rerenders the hand to update buttons (disabled buttons such as 'Gather Power' will no longer be disabled)
    hand.sheet.render(true);
  }

}