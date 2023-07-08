import { CASTLE_FALKENSTEIN } from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * Sheet for the 'ability' item type.
 * @extends {ItemSheet}
 */
export class CastleFalkensteinAbilitySheet extends ItemSheet {

  /**
   * @override
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "item"],
      template: "systems/castle-falkenstein/src/documents/item-sheet-ability.hbs",
      width: 460,
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
    if (context.item.actor) {
      context.specializationSelectOptions = {
        false: "castle-falkenstein.ability.ability",
        true: "castle-falkenstein.ability.specialization"
      };
      let availableRootAbilities = context.item.actor.items.filter(it => it.type == "ability" && !it.system.isSpecialization).map(a => a.name).sort();
      context.availableRootAbilities = { "": null };
      if (availableRootAbilities && availableRootAbilities.length > 0)
        context.availableRootAbilities = { ...context.availableRootAbilities, ...Object.fromEntries(availableRootAbilities?.map(a => [a, a])) };
    } else {
      context.specializationSelectOptions = {
        false: "castle-falkenstein.ability.ability"
      };
      context.availableRootAbilities = { "": null };
    }
    return context;
  }

}
