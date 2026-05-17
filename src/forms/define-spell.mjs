import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinCards } from "../documents/cards.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Form for defining a Spell prior to casting it.
 */
export class CastleFalkensteinDefineSpell extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    id: "castle-falkenstein-define-spell",
    classes: ["castle-falkenstein", "castle-falkenstein-define-spell", "sheet"],
    position: { width: 400, height: "auto" },
    tag: "form",
    window: {
      resizable: true,
      title: "castle-falkenstein.sorcery.defineSpell"
    },
    form: {
      handler: CastleFalkensteinDefineSpell._onSubmit,
      submitOnChange: false,
      closeOnSubmit: true
    }
  };

  static PARTS = {
    form: { template: "systems/castle-falkenstein/src/forms/define-spell.hbs" }
  };

  constructor(spell, options = {}) {
    super(options);
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

  /* -------------------------------------------- */

  computeTotal() {
    return CastleFalkensteinCards.computeTotalPowerNeed(this.character, this.spellBeingCast);
  }

  /* -------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const selectedSorceryAbility = this.character.items.get(this.spellBeingCast.sorceryAbilityId);

    if (!selectedSorceryAbility) {
      const key = this.character.isToken
        ? "castle-falkenstein.notifications.tokenDoesNotHaveAbility"
        : "castle-falkenstein.notifications.characterDoesNotHaveAbility";
      CastleFalkenstein.notif.error(game.i18n.format(key, {
        token: this.character.parent?.name,
        character: this.character.name,
        ability: CastleFalkenstein.i18nAbility("sorcery")
      }));
    }

    context.selectedSorceryAbilityLevel = selectedSorceryAbility ? selectedSorceryAbility.system.levelValue : "not found";
    context.spell = this.spell;
    context.spellSuitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[this.spell.system.suit];
    context.spellBeingCast = this.spellBeingCast;
    context.spellDefinitions = CASTLE_FALKENSTEIN.spellDefinitions;
    context.total = this.computeTotal();
    context.availableSorceryAbilities = Object.fromEntries(
      this.character.sorceryAbilityAndSpecializations.map(a => [a.id, a.system.displayName])
    );
    context.thaumixologySettingEnabled = CastleFalkenstein.settings.thaumixologyVariation === CastleFalkenstein.THAUMIXOLOGY_VARIATION_OPTIONS.enabled;

    return context;
  }

  /* -------------------------------------------- */

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelectorAll(".spell-definition-select").forEach(el => {
      el.addEventListener("change", ev => this._onDefinitionSelectChange(ev));
    });
    this.element.querySelectorAll(".sorcery-ability-select").forEach(el => {
      el.addEventListener("change", ev => this._onAbilitySelectChange(ev));
    });
    this.element.querySelectorAll(".custom-modifier-label").forEach(el => {
      el.addEventListener("change", ev => this._onCustomModifierLabelChange(ev));
    });
    this.element.querySelectorAll(".custom-modifier-value").forEach(el => {
      el.addEventListener("change", ev => this._onCustomModifierValueChange(ev));
    });
    this.element.querySelectorAll(".thaumixology-checkbox").forEach(el => {
      el.addEventListener("change", ev => this._onThaumixologyCheckboxChange(ev));
    });
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

  /* -------------------------------------------- */

  /**
   * Form submission handler — posts the spell-definition chat message and begins casting.
   * @this {CastleFalkensteinDefineSpell}
   */
  static async _onSubmit(event, form, formData) {
    const flavor = `[${game.i18n.localize("castle-falkenstein.sorcery.defineSpell")}]`;

    let content = `<b>${this.spell.name}</b> ` + CastleFalkenstein.cardSuitHTML(this.spell.system.suit) + `<br/>`;
    content += `${game.i18n.localize("castle-falkenstein.spell.thaumicLevel")}: ${this.spell.system.level}<br/>`;
    content += CastleFalkenstein.abilityLevelAsSentenceHtml(this.character.items.get(this.spellBeingCast.sorceryAbilityId), false);

    content += "<hr/><div class=\"spell-definitions\">";
    for (const [key, value] of Object.entries(CASTLE_FALKENSTEIN.spellDefinitions)) {
      content += `${game.i18n.localize(value.label)}: <b>${game.i18n.localize(value.levels[this.spellBeingCast.definitionLevels[key]].label)}</b><br/>`;
    }
    if (this.spellBeingCast.customModifier.value !== 0) {
      content += `${this.spellBeingCast.customModifier.label}: <b>${this.spellBeingCast.customModifier.value}</b><br/>`;
    }
    content += "</div>";

    if (this.spellBeingCast.usesThaumixology) {
      content += `<b>${game.i18n.localize("castle-falkenstein.settings.thaumixologyVariation.leverageChatHint")}</b><br/>`;
    }

    const total = this.computeTotal();
    content += `<hr /><div class="define-spell-total">${total}</div>`;

    const hand = await this.character.hand("sorcery");
    await hand.startCasting(this.spellBeingCast);

    CastleFalkenstein.createChatMessage(this.character, flavor, content);

    // Refresh the hand to update its action buttons
    hand.sheet.render(true);
  }
}
