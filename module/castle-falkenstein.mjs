// Import document classes.
import { CastleFalkensteinActor } from "./documents/actor.mjs";
import { CastleFalkensteinItem } from "./documents/item.mjs";
// Import sheet classes.
import { CastleFalkensteinActorSheet } from "./sheets/actor-sheet.mjs";
import { CastleFalkensteinAbilitySheet } from "./sheets/item-ability-sheet.mjs";
import { CastleFalkensteinPossessionSheet } from "./sheets/item-possession-sheet.mjs";
import { CastleFalkensteinSpellSheet } from "./sheets/item-spell-sheet.mjs";
import { CastleFalkensteinWeaponSheet } from "./sheets/item-weapon-sheet.mjs";
// Import helper/utility classes and constants.
import { CASTLE_FALKENSTEIN } from "./helpers/config.mjs";
import CastleFalkensteinSettings from "./helpers/settings.mjs";
import CastleFalkensteinPerformFeat from "./helpers/perform-feat.mjs";

export default class CastleFalkenstein {

  static get name() { return "castle-falkenstein"; }

  /**
   * Convenience proxy getter for CastleFalkenstein settings.
   */
  static settings = new Proxy({}, {
    get: function (target, key) {
      try { return game.settings.get(CastleFalkenstein.name, key); }
      catch (err) {
        console.warn(err);
        return undefined;
      };
    }
  });

  static get settingDefinitions() {

    const cardStackSelect = (stackType) => { return {
      type: String,
      default: "",
      getChoices: () => ({
        "": "",
        ...Object.fromEntries(
          game.cards
            .filter(stack => stack.type === stackType)
            .map(stack => [stack.id, stack.name])
        )
      })
    }};

    return {
      fortuneDeck: cardStackSelect("deck"),
      fortuneDiscardPile: cardStackSelect("pile"),
      sorceryDeck: cardStackSelect("deck"),
      sorceryDiscardPile: cardStackSelect("pile")
    };
  }

  static get fortuneDeck() {
    return game.cards.get(this.settings.fortuneDeck);
  }
  static get fortuneDiscardPile() {
    return game.cards.get(this.settings.fortuneDiscardPile);
  }
  static get sorceryDeck() {
    return game.cards.get(this.settings.sorceryDeck);
  }
  static get sorceryDiscardPile() {
    return game.cards.get(this.settings.sorceryDiscardPile);
  }

  
  /**
   * Re-renders all CastleFalkenstein sheets to allow settings to take effect.
   *
   * @static
   * @memberof CastleFalkenstein
   */
  static refreshSheets() {
    Object.values(ui.windows)
      .filter(window => window.isCastleFalkenstein)
      .forEach(window => window.render(false, { updateClasses: true }));
  }

  /**
   * Refreshes CastleFalkenstein sheets for all players.
   *
   * @static
   * @memberof CastleFalkenstein
   */
  
  static async refreshSheetsAll() {
    if (game.user.isGM) await game.socket.emit(this.socketName, {
      command: "refreshSheets"
    });

    this.refreshSheets();
  }
  
  static onInit() {
    //this.registerSettings();
    //this.registerSheets();

    game.CastleFalkenstein = CastleFalkenstein;

    // Add custom constants for configuration.
    CONFIG.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;

    // Define custom Document classes
    CONFIG.Actor.documentClass = CastleFalkensteinActor;
    CONFIG.Item.documentClass = CastleFalkensteinItem;
  }

  static async onReady() {
    this.registerSettings();
    await this.preLoadTemplates();
    this.registerSheets();

    Hooks.on("hotbarDrop", (hotbar, data, slot) => this.createItemMacro(data, slot));

    Hooks.on("updateActor", (actor, data, options) => actor.onUpdate(data, options));

    Hooks.on("getMonarchCardComponents", (monarch, components) => {

      // Remove Monarch default standalone card components
      while (components.badges.length > 0) { components.badges.pop(); }
      while (components.markers.length > 0) { components.markers.pop(); }
      while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
      while (components.controls.length > 0) { components.controls.pop(); }

    });

    Hooks.on("getMonarchHandComponents", (monarch, components) => {

      // Remove Monarch default components
      while (components.badges.length > 0) { components.badges.pop(); }
      while (components.markers.length > 0) { components.markers.pop(); }
      while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
      while (components.controls.length > 0) { components.controls.pop(); }
      while (components.appControls.length > 0) { components.appControls.pop(); }

      // Add Castle Falkenstein-relevant components

      components.appControls.push({
          label: "castle-falkenstein.cards.draw",
          icon: "fas fa-plus",
          class: "draw-cards",
          onclick: async (event, app, hand) =>  {
            const handProperties = await hand.getFlag("castle-falkenstein", "handProperties");
            if (handProperties.type == "fortune") {
              if (hand.cards.size < 4) {
                hand.draw(CastleFalkenstein.fortuneDeck, 4 - hand.cards.size, {chatNotification: false});
              }
            } else if (handProperties.type == "sorcery") {
              hand.draw(CastleFalkenstein.sorceryDeck, 1);
            }
          }
      });

      components.controls.push({
        tooltip: "castle-falkenstein.cards.discard",
        icon: "cf-card-discard",
        class: "discard-card",
        /* FIXME Cannot 'hide' CardControls in Monarch yet (https://github.com/zeel01/monarch/issues/38).
                 For the time being, the Discard control will be 'disabled' only in Fortune hands.
        hide: (card, container) => {
          const handProperties = container.getFlag("castle-falkenstein", "handProperties");
          return handProperties.type != "sorcery";
        },*/
        disabled: (card, container) => {
          const handProperties = container.getFlag("castle-falkenstein", "handProperties");
          return handProperties.type != "sorcery";
        },
        onclick: async (event, card, container) => {
          const handProperties = await container.getFlag("castle-falkenstein", "handProperties");
          if (handProperties.type == "sorcery") {
            card.pass(CastleFalkenstein.sorceryDiscardPile);
          }
        }
      });

    });

    game.socket.on(this.socketName, this._onSocketMessage.bind(this));

    if (game.user.isGM) {
      // TODO FIXME do not display this always
      // TODO FIXME add i18n
      ui.notifications.warn("Make sure Fortune/Sorcery deck and discard piles are correctly defined in the settings");
    }

    console.log('Castle Falkenstein | Ready.');
  }

  static async onRenderChatMessage(chatMessage, html, messageData) {
    CastleFalkensteinPerformFeat.onRenderChatMessage(chatMessage, html, messageData);
  }

  static registerSettings() {
    Object.entries(this.settingDefinitions).forEach(([key, def]) => {
      game.settings.register(CastleFalkenstein.name, key, {
        ...def,
        scope: def.scope ?? "world",
        config: false,
        name: `castle-falkenstein.settings.${key}.name`,
        hint: `castle-falkenstein.settings.${key}.hint`
      });
    })

    game.settings.registerMenu(this.name, 'settingsMenu', {
      name: game.i18n.localize("castle-falkenstein.settings.name"),
      icon: "fas fa-bars",
      label: game.i18n.localize("castle-falkenstein.settings.label"),
      type: CastleFalkensteinSettings,
    });
  }

  static registerSheets() {
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("castle-falkenstein", CastleFalkensteinActorSheet, { 
      label: game.i18n.localize("castle-falkenstein.system") + " | " + game.i18n.localize("castle-falkenstein.character"),
      makeDefault: true
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("castle-falkenstein", CastleFalkensteinAbilitySheet, {
      types: ["ability"],
      label: game.i18n.localize("castle-falkenstein.system") + " | " + game.i18n.localize("castle-falkenstein.ability.ability"),
      makeDefault: true
    });
    Items.registerSheet("castle-falkenstein", CastleFalkensteinPossessionSheet, {
      types: ["possession"],
      label: game.i18n.localize("castle-falkenstein.system") + " | " + game.i18n.localize("castle-falkenstein.possession.possession"),
      makeDefault: true
    });
    Items.registerSheet("castle-falkenstein", CastleFalkensteinWeaponSheet, {
      types: ["weapon"],
      label: game.i18n.localize("castle-falkenstein.system") + " | " + game.i18n.localize("castle-falkenstein.weapon.weapon"),
      makeDefault: true
    });
    Items.registerSheet("castle-falkenstein", CastleFalkensteinSpellSheet, {
      types: ["spell"],
      label: game.i18n.localize("castle-falkenstein.system") + " | " + game.i18n.localize("castle-falkenstein.spell.spell"),
      makeDefault: true
    });
  }

  // Load all the templates for handlebars partials.
  static async preLoadTemplates() {
    return loadTemplates([
      // Actor partials
      "systems/castle-falkenstein/templates/parts/actor-abilities.hbs",
      "systems/castle-falkenstein/templates/parts/actor-possessions.hbs",
      "systems/castle-falkenstein/templates/parts/actor-spells.hbs",
      "systems/castle-falkenstein/templates/parts/actor-weapons.hbs"
    ]);
  }

  /**
   * Create a Macro from an Item drop.
   * Get an existing item macro if one exists, otherwise create a new one.
   * @param {Object} data     The dropped data
   * @param {number} slot     The hotbar slot to use
   * @returns {Promise}
   */
  static async createItemMacro(data, slot) {
    if (data.type !== "Item") return;
    if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
    const item = data.data;

    // Create the macro command
    const command = `game.CastleFalkenstein.rollItemMacro("${item.name}");`;
    let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
    if (!macro) {
      macro = await Macro.create({
        name: item.name,
        type: "script",
        img: item.img,
        command: command,
        flags: { "CastleFalkenstein.itemMacro": true }
      });
    }
    game.user.assignHotbarMacro(macro, slot);
    return false;
  }
  
  /**
   * Create a Macro from an Item drop.
   * Get an existing item macro if one exists, otherwise create a new one.
   * @param {string} itemName
   * @return {Promise}
   */
  static rollItemMacro(itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    const item = actor ? actor.items.find(i => i.name === itemName) : null;
    if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

    // Trigger the item roll
    return item.roll();
  }

  /**
   * The name of the web socket for this system
   *
   * @static
   * @memberof CastleFalkenstein
   */
  static get socketName() {
    return `system.${this.name}`;
  }

  /**
   * Handles socket messages.
   *
   * Delegates the message to the appropriate handler.
   *
   * @static
   * @param {Object} message
   * @param {String} message.command - The command to handle.
   * @param {Object} message.data    - The data for the command.
   * @memberof CastleFalkenstein
   */
  static async _onSocketMessage({ command, data }) {
    if (!this[command]) return;
    await this[command](data);
  }
}

/* -------------------------------------------- */
/*  Declare Hooks                               */
/* -------------------------------------------- */

Hooks.on("init", CastleFalkenstein.onInit.bind(CastleFalkenstein));

Hooks.on("ready", CastleFalkenstein.onReady.bind(CastleFalkenstein));

Hooks.on("renderChatMessage", CastleFalkenstein.onRenderChatMessage.bind(CastleFalkenstein));

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function () {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});
