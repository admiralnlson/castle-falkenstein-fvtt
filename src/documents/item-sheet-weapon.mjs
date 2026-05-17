import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

const { api, sheets } = foundry.applications;
const TextEditor = foundry.applications.ux.TextEditor.implementation;

/**
 * Sheet for the 'weapon' item type.
 */
export class CastleFalkensteinWeaponSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["castle-falkenstein", "sheet", "item"],
    position: { width: 490, height: 300 },
    window: { resizable: true },
    form: { submitOnChange: true }
  };

  static PARTS = {
    sheet: { template: "systems/castle-falkenstein/src/documents/item-sheet-weapon.hbs" }
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
    context.concealSelectOptions = {
      "-": "-",
      "P": "castle-falkenstein.weapon.concealPocket",
      "J": "castle-falkenstein.weapon.concealJacket",
      "L": "castle-falkenstein.weapon.concealLongCoat",
      "N": "castle-falkenstein.weapon.concealNot"
    };
    context.harmRankSelectOptions = {
      "-": "-",
      "A": "A",
      "B": "B",
      "C": "C",
      "D": "D",
      "E": "E",
      "F": "F"
    };

    context.hideWounds = (CastleFalkenstein.settings.damageSystem === CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.harmRank);
    context.hideHarmRank = (CastleFalkenstein.settings.damageSystem === CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.wounds);

    return context;
  }
}
