import { CASTLE_FALKENSTEIN } from "./config.mjs";
import { CastleFalkensteinActor } from "./documents/actor.mjs";
import { CastleFalkensteinItem } from "./documents/item.mjs";
import { CastleFalkensteinActorSheet } from "./documents/actor-sheet.mjs";
import { CastleFalkensteinAbilitySheet } from "./documents/item-ability-sheet.mjs";
import { CastleFalkensteinPossessionSheet } from "./documents/item-possession-sheet.mjs";
import { CastleFalkensteinSpellSheet } from "./documents/item-spell-sheet.mjs";
import { CastleFalkensteinWeaponSheet } from "./documents/item-weapon-sheet.mjs";
import CastleFalkensteinSettings from "./forms/settings.mjs";
import CastleFalkensteinPerformFeat from "./forms/perform-feat.mjs";

export default class CastleFalkenstein {

  static get name() { return "castle-falkenstein"; }

	static get debugMode() {
		const api = game.modules.get("_dev-mode")?.api;
		if (!api) {
       return false;
    }
		return api.getPackageDebugValue(this.name);
	}

  static _consoleLog(logLevel, msg, ...args) {
    const color = "background: #ffda87; color: #000;";
    if (typeof msg === "string") {
      console[logLevel](`%c Castle Falkenstein | [${logLevel.toUpperCase()}] ${msg}`, color, ...args);
    } else {
      console[logLevel](`%c Castle Falkenstein | [${logLevel.toUpperCase()}] ${typeof msg} display:`, color);
      console[logLevel](msg);
    }
  }

  static consoleDebug(msg, ...args) { if (this.debugMode) { this._consoleLog("debug", msg, ...args); } }
  static consoleInfo(msg, ...args) { this._consoleLog("info", msg, ...args); }
  static consoleWarn(msg, ...args) { this._consoleLog("warn", msg, ...args); }
  static consoleError(msg, ...args) { this._consoleLog("error", msg, ...args); ui.notifications.error("Internal Castle Falkenstein system error (see console for details)"); }

  /**
   * Convenience proxy getter for CastleFalkenstein settings.
   */
  static settings = new Proxy({}, {
    get: function (target, key) {
      try { return game.settings.get(CastleFalkenstein.name, key); }
      catch (err) {
        CastleFalkenstein.consoleWarn(err);
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
      // GM settings
      fortuneDeck: cardStackSelect("deck"),
      fortuneDiscardPile: cardStackSelect("pile"),
      sorceryDeck: cardStackSelect("deck"),
      sorceryDiscardPile: cardStackSelect("pile"),
      sorceryAbility: {
        type: String,
        "default": ""
      }
      // Player settings
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

  static get i18nSorceryAbility() {
    this.settings.sorceryAbility = this.settings.sorceryAbility.trim();

    if (this.settings.sorceryAbility != "")
      return this.settings.sorceryAbility;

    return game.i18n.localize("castle-falkenstein.sorcery.ability");
  }
  
  static abilityLevelAsSentenceHtml(abilityItem, includeAbilitySuit = true) {
    const levelI18nKey = game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[abilityItem.data.data.level].full);
    const levelValue = CASTLE_FALKENSTEIN.abilityLevels[abilityItem.data.data.level].value;
    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[abilityItem.data.data.suit];

    const level = `${game.i18n.localize(levelI18nKey)} [${levelValue}]`;
    let ability = `${abilityItem.name}`;
    if (includeAbilitySuit)
      ability += `[<span class="suit-symbol-${abilityItem.data.data.suit}">${suitSymbol}</span>]`;

    const html = game.i18n.format("castle-falkenstein.ability.levelAsSentence", {
      level: level,
      ability: ability
    });

    return html;
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
    game.CastleFalkenstein = CastleFalkenstein;

    // Add custom constants for configuration.
    CONFIG.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;

    // Define custom Document classes
    CONFIG.Actor.documentClass = CastleFalkensteinActor;
    CONFIG.Item.documentClass = CastleFalkensteinItem;

    // Declare Castle Falkenstein deck preset
    CONFIG.Cards.presets.castleFalkensteinDeck = {
      type: "deck",
      label: "castle-falkenstein.system",
      src: "systems/castle-falkenstein/cards/deck-preset.json"
    };
  }

  static async onReady() {
    this.registerSettings();
    await this.preLoadTemplates();
    this.registerSheets();

    game.socket.on(this.socketName, this._onSocketMessage.bind(this));

    if (game.user.isGM) {
      // TODO FIXME do not display this always
      // TODO FIXME add i18n
      ui.notifications.warn("Make sure Fortune/Sorcery deck and discard piles are correctly defined in the settings");
    }

    CastleFalkenstein.consoleDebug("Debug mode active.");
    CastleFalkenstein.consoleInfo("Ready.");
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
      "systems/castle-falkenstein/system/documents/actor-abilities.hbs",
      "systems/castle-falkenstein/system/documents/actor-possessions.hbs",
      "systems/castle-falkenstein/system/documents/actor-spells.hbs",
      "systems/castle-falkenstein/system/documents/actor-weapons.hbs"
    ]);
  }
  
  static configureMonarchCard(monarch, components) {
    CastleFalkenstein.consoleDebug("configureMonarchCard");
    // Remove Monarch default standalone card components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }
  }

  static configureMonarchHand(monarch, components) {
    CastleFalkenstein.consoleDebug("configureMonarchHand");
    // Remove Monarch default components
    while (components.badges.length > 0) { components.badges.pop(); }
    while (components.markers.length > 0) { components.markers.pop(); }
    while (components.contextMenu.length > 0) { components.contextMenu.pop(); }
    while (components.controls.length > 0) { components.controls.pop(); }
    while (components.appControls.length > 0) { components.appControls.pop(); }

    // Add Castle Falkenstein-relevant components

    // Fortune + Sorcery Hands - Draw
    components.appControls.push({
        label: "castle-falkenstein.cards.draw",
        icon: "fas fa-plus",
        class: "draw-cards",
        disabled: (card, hand) => {
          const handProperties = hand.getFlag("castle-falkenstein", "handProperties");
          CastleFalkenstein.consoleDebug(handProperties);
          CastleFalkenstein.consoleDebug(hand);
          CastleFalkenstein.consoleDebug(handProperties.type == "fortune" && hand.cards.size >= 4);
          return handProperties.type == "fortune" && hand.cards.size >= 4;
        },
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

    // Sorcery cards only - Release unaligned power (/ Discard)
    components.controls.push({
      tooltip: "castle-falkenstein.cards.discard",
      icon: "cf-card-discard",
      class: "discard-card",
      hide: (card, container) => {
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
  }

  static async onRenderChatMessage(chatMessage, html, messageData) {
    CastleFalkensteinPerformFeat.onRenderChatMessage(chatMessage, html, messageData);
  }

  static async hotbarDrop(hotbar, data, slot) {
    // Create a Macro from an Item drop.
    // Get an existing item macro if one exists, otherwise create a new one.
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
        flags: { "castle-falkenstein.itemMacro": true }
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

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(CastleFalkenstein.name);
});

Hooks.once("init", () => CastleFalkenstein.onInit());

Hooks.once("ready", () => CastleFalkenstein.onReady());

Hooks.on("getMonarchCardComponents", (monarch, components) => CastleFalkenstein.configureMonarchCard(monarch, components));

Hooks.on("getMonarchHandComponents", (monarch, components) => CastleFalkenstein.configureMonarchHand(monarch, components));

Hooks.on("renderChatMessage", (chatMessage, html, messageData) => CastleFalkenstein.onRenderChatMessage(chatMessage, html, messageData));

Hooks.on("hotbarDrop", (hotbar, data, slot) => CastleFalkenstein.hotbarDrop(hotbar, data, slot));

Hooks.on("updateActor", (actor, data, options, userId) => actor.onUpdate(data, options, userId));


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
