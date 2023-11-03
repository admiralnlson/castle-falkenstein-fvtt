import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * Sheet for the 'weapon' item type.
 * @extends {ItemSheet}
 */
export class CastleFalkensteinWeaponSheet extends ItemSheet {

  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "item"],
      template: "systems/castle-falkenstein/src/documents/item-sheet-weapon.hbs",
      width: 490,
      height: 300,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    // convenience so context and name/target are aligned for system properties
    context.system = context.item.system;
    context.enrichedDescription = await TextEditor.enrichHTML(context.system.description, {async: true});
    context.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;
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

    context.hideWounds = (CastleFalkenstein.settings.damageSystem == CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.harmRank);
    context.hideHarmRank = (CastleFalkenstein.settings.damageSystem == CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.wounds);

    return context;
  }

}
