import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinLootSheet } from "./actor-loot-sheet.mjs";

/**
 * @extends {CastleFalkensteinLootSheet}
 */
export class CastleFalkensteinCharacterSheet extends CastleFalkensteinLootSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "actor", "character"],
      template: "systems/castle-falkenstein/src/documents/actor-character-sheet.hbs",
      width: 620,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    // Retrieve the data structure from the base sheet.
    let context = await super.getData(options);

    context.canOpenDiary = !context.actor.isToken && context.actor.isOwner;
    context.diaryIfExists = (await context.actor.diaryIfExists());
    context.diaryVisible = context.diaryIfExists?.sheet.rendered;
    context.diaryUuid = context.diaryIfExists?.uuid;
    context.diaryName = context.diaryIfExists ? context.diaryIfExists.name : context.actor.computeDiaryName();

    context.enrichedDescription = await TextEditor.enrichHTML(context.system.description);
    context.enrichedPlayerNotes = await TextEditor.enrichHTML(context.system.playerNotes);
    context.enrichedHostNotes = await TextEditor.enrichHTML(context.system.hostNotes);

    context.concealLabels = CASTLE_FALKENSTEIN.weaponConceals;

    context.hideWounds = (CastleFalkenstein.settings.damageSystem === CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.harmRank);
    context.hideHarmRank = (CastleFalkenstein.settings.damageSystem === CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.wounds);

    context.fortuneHandIfExists = (await context.actor.handIfExists("fortune"));
    context.fortuneHandVisible = context.fortuneHandIfExists?.sheet.rendered;
    context.fortuneHandUuid = context.fortuneHandIfExists?.uuid;
    context.sorceryHandIfExists = (await context.actor.handIfExists("sorcery"));
    context.sorceryHandVisible = context.sorceryHandIfExists?.sheet.rendered;
    context.sorceryHandUuid = context.sorceryHandIfExists?.uuid;

    return context;
  }

  static async onRender(app, html, data) {
    if (app.tabToOpen) {
      await app.activateTab(app.tabToOpen);
      app.tabToOpen = null;
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
 
    if (this.object.isOwner) {
      html.find(".diary-show").click(async (ev) => {
        const diary = await this.actor.diary();
        diary.sheet.render(true);
      });
    }

    html.find(".fortune-hand-show").click(async (ev) => {
      const hand = await this.actor.hand("fortune");
      hand.sheet.render(true);
    });

    html.find(".sorcery-hand-show").click(async (ev) => {
      const hand = await this.actor.hand("sorcery");
      hand.sheet.render(true);
    });

    // Rollable items
    if (this.isEditable || game.user.isGM) {
      html.find(".rollable").click(this._onRoll.bind(this));
    }

    // -------------------------------------------------------------
    // Everything below here is only allowed if the sheet is editable.
    if (!this.isEditable) return;

    // Add item
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Weapon ammunition
    html.find(".weapon-ammunition-current").change(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.update({
        [`system.ammunition`]: ev.currentTarget.value 
      });
    });
  }

  /** @override */
  _onDragStart(event) {
    super._onDragStart(event);

    event.dataTransfer.setDragImage(event.target.parentElement, 0, 0);
    
    const targetA = event.target.closest("a");

    if (targetA?.dataset.uuid) {
      const dragData = {
        uuid: targetA.dataset.uuid
      };
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }
  }
  
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      sort: this.newItemSortValue()
    };

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType === "item") {
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : "";
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get("core", "rollMode"),
      });
      return roll;
    }
  }

}

