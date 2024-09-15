import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CastleFalkensteinLootSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "actor", "loot"],
      template: "systems/castle-falkenstein/src/documents/actor-loot-sheet.hbs",
      width: 620,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "items" }],
      dragDrop: [{
        dragSelector: ".items-list > .item > .item-drag, .diary-show, .fortune-hand-show, .sorcery-hand-show",
        dropSelector: ".items-list"
      }],
      scrollY: [".items-list"]
    });
  }

  /* -------------------------------------------- */
  
  newItemSortValue() {
    const max = (this.actor.items.contents.length > 0) ? Math.max(...this.actor.items.contents.map(a => a.sort)) : 0;
    return max + CONST.SORT_INTEGER_DENSITY;
  }

  /** @override */
  async _onDropItem(event, data) {
    if ( !this.actor.isOwner ) return false;
    const item = await Item.implementation.fromDropData(data);
    const itemData = item.toObject();

    // Handle item sorting within the same Actor
    if ( this.actor.uuid === item.parent?.uuid ) {
      const li = event.target.closest(".items-list > .item");
      if ( !li ) return;
      Object.defineProperty(event, "target", {writable: false, value: li});
      return this._onSortItem(event, itemData);
    }

    itemData.sort = this.newItemSortValue();

    // Create the owned item
    if (game.release.generation >= 12) {
      return this._onDropItemCreate(itemData, event);
    } else {
      return this._onDropItemCreate(itemData);
    }
  }

  /** @override */
	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();
    if (game.user.isGM) {
      buttons.unshift({
        class: "character-show-players",
        icon: "fas fa-eye",
        label: "castle-falkenstein.showPlayers",
        onclick: () => {
          CastleFalkenstein.socket.executeForOthers("showActor", this.actor.id);
          CastleFalkenstein.notif.info(game.i18n.format("castle-falkenstein.notifications.characterWasShown", {
            name: this.actor.name
          }));
        }
      });
    }

		return buttons;
	}

  /** @override */
  async getData(options) {

    // Retrieve the data structure from the base sheet.
    let context = await super.getData(options);

    // convenience so context and name/target are aligned for system properties
    context.system = context.actor.system;

    context.items = [...context.actor.items.contents];
    context.items.sort((a,b) => ((a.sort || 0) - (b.sort || 0)));

    // Conditionals
    context.userHasObserverOrOwnerAccess = game.user.isGM || (this.actor.visible && !this.actor.limited);
    context.userIsHost = game.user.isGM;

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".item-show").click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sendToChat();
    });

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find(".item-edit").click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only allowed if the sheet is editable.
    if (!this.isEditable) return;
    
    // Delete item
    html.find(".item-delete").click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
    });

  }
}
