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
        dragSelector: ".items-list .item .item-drag",
        dropSelector: ".items-list"
      }],
      scrollY: [".items-list"]
    });
  }

  /* -------------------------------------------- */

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
    const context = super.getData(options);

    // Add the actor's system data to context.system for easier access
    context.system = context.actor.system;
    context.enrichedDescription = await TextEditor.enrichHTML(context.system.description);
    context.enrichedDiary = await TextEditor.enrichHTML(context.system.diary);
    context.enrichedHostNotes = await TextEditor.enrichHTML(context.system.hostNotes);

    this._prepareItems(context);

    // Conditionals
    context.userHasObserverOrOwnerAccess = game.user.isGM || (this.actor.visible && !this.actor.limited);
    context.userIsHost = game.user.isGM;

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const abilities = [];
    const weapons = [];
    const possessions = [];
    const spells = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      // Append to abilities.
      if (i.type === 'ability') {
        i.computed = i.computed || {};
        i.computed.levelI18nKey = CASTLE_FALKENSTEIN.abilityLevels[i.system.level].full;
        i.computed.levelValue = CASTLE_FALKENSTEIN.abilityLevels[i.system.level].value;
        i.computed.suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[i.system.suit];
        abilities.push(i);
      }
      // Append to weapons.
      else if (i.type === 'weapon') {
        weapons.push(i);
      }
      // Append to possessions.
      else if (i.type === 'possession') {
        possessions.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        i.computed = i.computed || {};
        i.computed.suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[i.system.suit];
        spells.push(i);
      }
    }

    // Assign and return
    context.abilities = abilities;
    context.weapons = weapons;
    context.possessions = possessions;
    context.spells = spells;
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
