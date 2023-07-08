import {CASTLE_FALKENSTEIN} from "../config.mjs";
import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CastleFalkensteinActorSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "actor"],
      template: "systems/castle-falkenstein/src/documents/actor-sheet.hbs",
      width: 620,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      dragDrop: [{
        dragSelector: ".items-list > .item > .item-drag",
        dropSelector: ".items-list > .item"
      }],
      scrollY: [".items-list"]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropItem(event, data) {
    // TEMP HACK work-around for https://github.com/foundryvtt/foundryvtt/issues/9677
    const betterTarget = event.target.closest(this._dragDrop[0].dropSelector);
    if ( !betterTarget ) return;
    Object.defineProperty(event, 'target', {writable: false, value: betterTarget});

    return await super._onDropItem(event, data);
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

    context.enrichedDescription = await TextEditor.enrichHTML(context.system.description, {async: true});
    context.enrichedDiary = await TextEditor.enrichHTML(context.system.diary, {async: true});
    context.enrichedHostNotes = await TextEditor.enrichHTML(context.system.hostNotes, {async: true});

    // Call getters explicitly & affect to containers
    let abilities = [];
    let weapons = [];
    let possessions = [];
    let spells = [];
    for (let i of context.items) {
      const elWithDM = context.actor.items.get(i._id);
      if (i.type == "ability") {
        i.system.prefixedDisplayName = elWithDM.system.prefixedDisplayName;
        i.system.levelI18nKey = elWithDM.system.levelI18nKey;
        i.system.levelValue = elWithDM.system.levelValue;
        i.system.suit = elWithDM.system.suit;
        i.system.suitSymbol = elWithDM.system.suitSymbol;
        abilities.push(i);
      } else if (i.type == "weapon") {
        weapons.push(i);
      } else if (i.type == "possession") {
        possessions.push(i);
      } else if (i.type == "spell") {
        i.system.suitSymbol = elWithDM.system.suitSymbol;
        spells.push(i);
      }
    }
    context.abilities = abilities;
    context.weapons = weapons;
    context.possessions = possessions;
    context.spells = spells;

    // Conditionals
    context.userHasObserverOrOwnerAccess = game.user.isGM || (this.actor.visible && !this.actor.limited);
    context.userIsHost = game.user.isGM;

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
 
    html.find('.fortune-hand-show').click(async (ev) => {
      const hand = await this.actor.hand("fortune");
      hand.sheet.render(true, { focus: true });
    });

    html.find('.sorcery-hand-show').click(async (ev) => {
      const hand = await this.actor.hand("sorcery");
      hand.sheet.render(true, { focus: true });
    });

    html.find('.item-show').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.showOthers();
    });

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true, { focus: true });
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
    });

    // Rollable items
    html.find('.rollable').click(this._onRoll.bind(this));

    // Weapon ammunition
    html.find('.weapon-ammunition-current').change(ev => {
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
      type: type
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
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

}

Hooks.on("renderCastleFalkensteinActorSheet", (app, html, data) => CastleFalkensteinActorSheet.onRender(app, html, data));
