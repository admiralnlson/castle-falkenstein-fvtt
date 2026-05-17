import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";
import { CastleFalkensteinLootSheet } from "./actor-loot-sheet.mjs";

const TextEditor = foundry.applications.ux.TextEditor.implementation;

/**
 * Character actor sheet.
 */
export class CastleFalkensteinCharacterSheet extends CastleFalkensteinLootSheet {

  static DEFAULT_OPTIONS = {
    classes: ["castle-falkenstein", "sheet", "actor", "character"],
    position: { width: 620, height: 600 },
    actions: {
      itemCreate: this._onItemCreate,
      roll: this._onRoll,
      diaryShow: this._onDiaryShow,
      fortuneHandShow: this._onFortuneHandShow,
      sorceryHandShow: this._onSorceryHandShow
    }
  };

  static PARTS = {
    sheet: { template: "systems/castle-falkenstein/src/documents/actor-character-sheet.hbs" }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "description" },
        { id: "abilities" },
        { id: "possessions" },
        { id: "spells" },
        { id: "playerNotes" },
        { id: "hostNotes" }
      ],
      initial: "description"
    }
  };

  /** Lets external callers preselect a tab before re-rendering. */
  tabToOpen = null;

  /* -------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.canOpenDiary = !this.actor.isToken && this.actor.isOwner;
    context.diaryIfExists = await this.actor.diaryIfExists();
    context.diaryVisible = context.diaryIfExists?.sheet.rendered;
    context.diaryUuid = context.diaryIfExists?.uuid;
    context.diaryName = context.diaryIfExists ? context.diaryIfExists.name : this.actor.computeDiaryName();

    context.source = this.actor.toObject();
    context.fields = this.actor.system.schema.fields;
    const editorOptions = {
      secrets: this.actor.isOwner, rollData: this.actor.getRollData(), relativeTo: this.actor
    };
    context.enrichedDescription = await TextEditor.enrichHTML(this.actor.system.description, editorOptions);
    context.enrichedPlayerNotes = await TextEditor.enrichHTML(this.actor.system.playerNotes, editorOptions);
    context.enrichedHostNotes = await TextEditor.enrichHTML(this.actor.system.hostNotes, editorOptions);

    context.concealLabels = CASTLE_FALKENSTEIN.weaponConceals;

    context.hideWounds = (CastleFalkenstein.settings.damageSystem === CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.harmRank);
    context.hideHarmRank = (CastleFalkenstein.settings.damageSystem === CastleFalkenstein.DAMAGE_SYSTEM_OPTIONS.wounds);

    context.fortuneHandIfExists = await this.actor.handIfExists("fortune");
    context.fortuneHandVisible = context.fortuneHandIfExists?.sheet.rendered;
    context.fortuneHandUuid = context.fortuneHandIfExists?.uuid;
    context.sorceryHandIfExists = await this.actor.handIfExists("sorcery");
    context.sorceryHandVisible = context.sorceryHandIfExists?.sheet.rendered;
    context.sorceryHandUuid = context.sorceryHandIfExists?.uuid;

    return context;
  }

  /* -------------------------------------------- */

  async _onRender(context, options) {
    await super._onRender(context, options);

    // Switch to the preselected tab, if any
    if (this.tabToOpen) {
      this.changeTab(this.tabToOpen, "primary");
      this.tabToOpen = null;
    }

    // Weapon ammunition change handler — too granular to be a static action, wire up directly
    if (this.isEditable) {
      this.element.querySelectorAll(".weapon-ammunition-current").forEach(input => {
        input.addEventListener("change", ev => {
          const li = ev.currentTarget.closest(".item");
          const item = this.actor.items.get(li.dataset.itemId);
          item.update({ "system.ammunition": ev.currentTarget.value });
        });
      });
    }
  }

  /* -------------------------------------------- */
  /*  Actions                                     */
  /* -------------------------------------------- */

  static async _onDiaryShow(event, target) {
    if (!this.actor.isOwner) return;
    const diary = await this.actor.diary();
    diary?.sheet.render(true);
  }

  static async _onFortuneHandShow(event, target) {
    const hand = await this.actor.hand("fortune");
    hand?.sheet.render(true);
  }

  static async _onSorceryHandShow(event, target) {
    const hand = await this.actor.hand("sorcery");
    hand?.sheet.render(true);
  }

  /**
   * Create a new Owned Item using initial data from the clicked element's dataset.
   */
  static async _onItemCreate(event, target) {
    if (!this.isEditable) return;
    event.preventDefault();
    const type = target.dataset.type;
    const itemData = {
      name: `New ${type.capitalize()}`,
      type,
      sort: this.newItemSortValue()
    };
    return Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   */
  static async _onRoll(event, target) {
    if (!(this.isEditable || game.user.isGM)) return;
    event.preventDefault();
    const dataset = target.dataset;

    if (dataset.rollType === "item") {
      const itemId = target.closest(".item")?.dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) return item.roll();
    }

    if (dataset.roll) {
      const label = dataset.label ? `[ability] ${dataset.label}` : "";
      const roll = new Roll(dataset.roll, this.actor.getRollData());
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get("core", "rollMode"),
      });
      return roll;
    }
  }

  /* -------------------------------------------- */
  /*  Drag & Drop                                 */
  /* -------------------------------------------- */

  /** @override */
  _onDragStart(event) {
    super._onDragStart(event);

    event.dataTransfer.setDragImage(event.target.parentElement, 0, 0);

    const targetA = event.target.closest("a");
    if (targetA?.dataset.uuid) {
      const dragData = { uuid: targetA.dataset.uuid };
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }
  }
}
