import { CastleFalkenstein } from "../castle-falkenstein.mjs";

const { api, sheets } = foundry.applications;

/**
 * Loot actor sheet — also serves as the base for the character sheet.
 */
export class CastleFalkensteinLootSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["castle-falkenstein", "sheet", "actor", "loot"],
    position: { width: 620, height: 600 },
    window: {
      resizable: true,
      controls: [
        {
          icon: "fas fa-eye",
          label: "castle-falkenstein.showPlayers",
          action: "showPlayers",
          visible: function () { return game.user.isGM; }
        }
      ]
    },
    actions: {
      showPlayers: this._onShowPlayers,
      itemShow: this._onItemShow,
      itemEdit: this._onItemEdit,
      itemDelete: this._onItemDelete
    },
    form: { submitOnChange: true }
  };

  static PARTS = {
    sheet: { template: "systems/castle-falkenstein/src/documents/actor-loot-sheet.hbs" }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "items", label: "castle-falkenstein.item.items" }
      ],
      initial: "items"
    }
  };

  /* -------------------------------------------- */

  newItemSortValue() {
    const max = (this.actor.items.contents.length > 0)
      ? Math.max(...this.actor.items.contents.map(a => a.sort))
      : 0;
    return max + CONST.SORT_INTEGER_DENSITY;
  }

  /* -------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.editable = this.isEditable;
    context.cssClass = this.isEditable ? "editable" : "locked";

    context.items = [...this.actor.items.contents].sort((a, b) => ((a.sort || 0) - (b.sort || 0)));

    context.userHasObserverOrOwnerAccess = game.user.isGM || (this.actor.visible && !this.actor.limited);
    context.userIsHost = game.user.isGM;

    return context;
  }

  /* -------------------------------------------- */
  /*  Header Controls / Actions                   */
  /* -------------------------------------------- */

  static async _onShowPlayers(event, target) {
    CastleFalkenstein.socket.executeForOthers("showActor", this.actor.id);
    CastleFalkenstein.notif.info(game.i18n.format("castle-falkenstein.notifications.characterWasShown", {
      name: this.actor.name
    }));
  }

  static async _onItemShow(event, target) {
    const li = target.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    item.sendToChat();
  }

  static async _onItemEdit(event, target) {
    const li = target.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    item.sheet.render(true);
  }

  static async _onItemDelete(event, target) {
    if (!this.isEditable) return;
    const li = target.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    item.delete();
  }

  /* -------------------------------------------- */
  /*  Drag & Drop                                 */
  /* -------------------------------------------- */

  /** @override */
  async _onDropItem(event, item) {
    if (!this.actor.isOwner) return false;
    const itemData = item.toObject();

    // Handle item sorting within the same Actor
    if (this.actor.uuid === item.parent?.uuid) {
      const li = event.target.closest(".items-list > .item");
      if (!li) return;
      Object.defineProperty(event, "target", { writable: false, value: li });
      return this._onSortItem(event, itemData);
    }

    itemData.sort = this.newItemSortValue();

    return this._onDropItemCreate(itemData, event);
  }

  async _onDropItemCreate(itemData, event) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    return this.actor.createEmbeddedDocuments("Item", itemData);
  }
}
