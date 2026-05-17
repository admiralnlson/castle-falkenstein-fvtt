import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

const { api, sheets } = foundry.applications;
const TextEditor = foundry.applications.ux.TextEditor.implementation;

/**
 * Sheet for the 'ability' item type.
 */
export class CastleFalkensteinAbilitySheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["castle-falkenstein", "sheet", "item"],
    position: { width: 460, height: 300 },
    window: { resizable: true },
    form: { submitOnChange: true }
  };

  static PARTS = {
    sheet: { template: "systems/castle-falkenstein/src/documents/item-sheet-ability.hbs" }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "description", label: "castle-falkenstein.description" },
        { id: "icon", label: "castle-falkenstein.icon" }
      ],
      initial: "description"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.source = this.item.toObject();
    context.fields = this.item.system.schema.fields;
    context.editable = this.isEditable;
    context.cssClass = this.isEditable ? "editable" : "locked";
    context.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;
    context.enrichedDescription = await TextEditor.enrichHTML(this.item.system.description, {
      secrets: this.document.isOwner,
      rollData: this.item.getRollData(),
      relativeTo: this.item
    });

    if (this.item.actor) {
      context.specializationSelectOptions = {
        false: "castle-falkenstein.ability.ability",
        true: "castle-falkenstein.ability.specialization"
      };
      const availableRootAbilities = this.item.actor.items
        .filter(it => it.type === "ability" && !it.system.isSpecialization)
        .map(a => a.name).sort();
      context.availableRootAbilities = { "": null };
      if (availableRootAbilities && availableRootAbilities.length > 0)
        context.availableRootAbilities = { ...context.availableRootAbilities, ...Object.fromEntries(availableRootAbilities.map(a => [a, a])) };
    } else {
      context.specializationSelectOptions = {
        false: "castle-falkenstein.ability.ability"
      };
      context.availableRootAbilities = { "": null };
    }
    return context;
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    const suitSelect = this.element.querySelector(".suit-select");
    if (suitSelect) CastleFalkenstein.colorizeSuitSelect(suitSelect);
  }
}
