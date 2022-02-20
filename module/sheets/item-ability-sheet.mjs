import { CASTLE_FALKENSTEIN } from "../helpers/config.mjs";

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
      classes: ["castle-falkenstein", "sheet", "item"],
      template: "systems/castle-falkenstein/templates/item-ability-sheet.hbs",
      width: 460,
      height: 300,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = itemData.data;
    context.flags = itemData.flags;

    context.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    /*if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      // FIXME PopOut! may not like this selection:
      let select = $(".suit-select");
      select.style = "font-size: 150%";
      let options = select.children();
      if (options.length == 5) {
        options[1].text = "♠";
        options[1].style = "font-size: 150%";
        options[2].text = "♥";
        options[2].style = "font-size: 150%";
        options[3].text = "♦";
        options[3].style = "font-size: 150%";
        options[4].text = "♣";
        options[4].style = "font-size: 150%";
      }
    }*/

    // Roll handlers, click handlers, etc. would go here.
  }
}
