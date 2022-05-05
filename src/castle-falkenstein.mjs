import { CASTLE_FALKENSTEIN } from "./config.mjs";
import CastleFalkensteinMonarchConfig from "./monarch-config.mjs";
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
        CastleFalkenstein.consoleError(err);
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

  static get sorceryDeck() {
    return game.cards.get(this.settings.sorceryDeck);
  }

  static deck(type) {
    if (type == "fortune") {
      return this.fortuneDeck;
    } else if (type == "sorcery") {
      return this.sorceryDeck;
    } else {
      this.consoleError(`Unknown deck type '${type}'`);
      return;
    }
  }

  static get fortuneDiscardPile() {
    return game.cards.get(this.settings.fortuneDiscardPile);
  }

  static get sorceryDiscardPile() {
    return game.cards.get(this.settings.sorceryDiscardPile);
  }

  static discardPile(type) {
    if (type == "fortune") {
      return this.fortuneDiscardPile;
    } else if (type == "sorcery") {
      return this.sorceryDiscardPile;
    } else {
      this.consoleError(`Unknown discard pile type '${type}'`);
      return;
    }
  }

  static get i18nSorceryAbility() {
    this.settings.sorceryAbility = this.settings.sorceryAbility.trim();

    if (this.settings.sorceryAbility != "")
      return this.settings.sorceryAbility;

    return game.i18n.localize("castle-falkenstein.sorcery.ability");
  }

  static async cardsFolder(type, name) {

    // Flags which should be owned by the folder
    const folderFlag = { 
        type: type
    };

    // Does the folder already exist?
    const existingFolder = game.folders.find(f => {
        if( f.data.type != "Cards" ) { return false; } 
        
        const flag = f.data.flags['castle-falkenstein'] ?? {};
        return flag?.type == folderFlag.type;
    });

    if( existingFolder ) {
        return existingFolder;
    }

    // Create a new folder
    const newFolder = await Folder.create({
        name: name,
        type: 'Cards',
        sorting: 'm',
        "flags.castle-falkenstein": folderFlag
    });
    return newFolder;
}

  static async createPresetDeck(type) {
    const response = await fetch("systems/castle-falkenstein/src/cards/deck-preset.json");
    const deckData = await response.json();
    // change the deck name to match its actual type and 
    // add Limited permission on the Dec so that plays may draw from it but not see its contents.
    deckData.name = game.i18n.localize(`castle-falkenstein.settings.${type}Deck.name`);
    deckData.permission = deckData.permission || {};
    deckData.permission.default = CONST.ENTITY_PERMISSIONS.LIMITED;
    deckData.folder = (await this.cardsFolder("decks-and-piles", game.i18n.localize("castle-falkenstein.cardsDirectory.decksAndPilesFolder"))).id;
    deckData.flags["castle-falkenstein"] = {
      type: type
    };

    // i18n'ize card names within the deck
    deckData.cards.forEach( (card) => {
      if (card.name == "Black Joker") {
        card.name = game.i18n.localize("castle-falkenstein.cards.blackJoker");
      }
      else if (card.name == "Red Joker") {
        card.name = game.i18n.localize("castle-falkenstein.cards.redJoker");
      } else {
        card.name = game.i18n.format("castle-falkenstein.cards.nonJokerCardName", {
          value: game.i18n.localize("castle-falkenstein.cards." + card.value),
          suit: game.i18n.localize("castle-falkenstein.cards." + card.suit)
        });
      }
    });

    
    const deck = await Cards.create(deckData);

    await deck.shuffle();

    return deck;
  }

  static async createDiscardPile(type) {
    const pileData = {
      name: game.i18n.localize(`castle-falkenstein.settings.${type}DiscardPile.name`),
      type: "pile",
      folder: (await this.cardsFolder("decks-and-piles", game.i18n.localize("castle-falkenstein.cardsDirectory.decksAndPilesFolder"))).id,
      permission: {
        default: CONST.ENTITY_PERMISSIONS.OBSERVER
      },
      "flags.castle-falkenstein": { type: type }
    }
    const pile = await Cards.create(pileData);
    return pile;
  }

  static async createMissingCards() {

    // Create missing Fortune/Sorcery Decks/Piles

    let cardsCreatedI18n = "";

    if (!this.fortuneDeck) {
      const deck = await this.createPresetDeck("fortune");
      await game.settings.set(CastleFalkenstein.name, "fortuneDeck", deck.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.fortuneDeck.name");
    }

    if (!this.fortuneDiscardPile) {
      const pile = await this.createDiscardPile("fortune");
      await game.settings.set(CastleFalkenstein.name, "fortuneDiscardPile", pile.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.fortuneDiscardPile.name");
    }

    if (!this.sorceryDeck) {
      const deck = await this.createPresetDeck("sorcery");
      await game.settings.set(CastleFalkenstein.name, "sorceryDeck", deck.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.sorceryDeck.name");
    }

    if (!this.sorceryDiscardPile) {
      const pile = await this.createDiscardPile("sorcery");
      await game.settings.set(CastleFalkenstein.name, "sorceryDiscardPile", pile.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.sorceryDiscardPile.name");
    }

    // TODO Create missing PC hands

    // TODO Create missing Host Fortune hand


    // Notify the user

    if (cardsCreatedI18n)
      ui.notifications.info(game.i18n.localize("castle-falkenstein.notifications.createdCards") + cardsCreatedI18n);
  }


  static async onPreDeleteCards(cards, options, user) {
    // In Foundry v9.255,
    //   If you delete a deck, it recalls all cards from hands and piles.
    //   However, if you delete a hand or pile, it does not recall the cards it contained to the origin deck.
    const type = cards.getFlag("castle-falkenstein", "type");
    if (type) {
      if (cards.type == "hand" || cards.type == "pile") {
        const toUpdate = {};
        const returned = [];

        for ( const card of cards.cards ) {
          if ( card.isHome ) continue;
    
          // Return drawn cards to their origin deck.
          if ( !toUpdate[card.data.origin] ) toUpdate[card.data.origin] = [];
          const update = {_id: card.id, drawn: false};
          toUpdate[card.data.origin].push(update);
          returned.push(card.id);
        }

        const fromDelete = [];
        const allowed = Hooks.call("returnCards", cards, returned.map(id => cards.cards.get(id)), {toUpdate, fromDelete});
        if ( allowed === false ) {
          CastleFalkenstein.consoleDebug(`The Cards#return operation was prevented by a hooked function.`);
          return cards;
        }

        // Perform database operations.
        const updates = await Object.entries(toUpdate).map(async ([origin, u]) => {
          await game.cards.get(origin).updateEmbeddedDocuments("Card", u);
        });
      }
    }
  }

  static async onDeleteCards(cards, options, user) {
    const type = cards.getFlag("castle-falkenstein", "type");
    if (type) {
      if (cards.type == "hand" || cards.type == "pile") {
        let origins = [];
        cards.cards.forEach((card) => {
          const origin = card.data.origin;
          if (!origins.includes(origin))
            origins.push(origin);
        });
        await origins.forEach(async (origin) => {
          const deck = game.cards.get(origin);
          await deck?.shuffle();
        });
        origins.forEach(async (origin) => {
          const deck = game.cards.get(origin);
          deck?.sheet?.render(false); // refresh the deck sheet if it's opened.
        });
      }
    }
  }

  static async onRenderPlayerList(application, html, data) {
    this.checkPermissionsOnDecksAndPiles();
  }

  static async checkPermissionsOnDecksAndPiles() {
    if (game.user.isGM) {
      game.users.contents.forEach((user) => {
        if (user.active && !user.isGM) {
          let stacks = "";
          [ this.fortuneDeck, this.sorceryDeck ].forEach((deck) => {
            if (deck && !deck.testUserPermission(user, CONST.ENTITY_PERMISSIONS.LIMITED)) {
              stacks += `<br/>- ${deck.name}`;
            }
          });
          [ this.fortuneDiscardPile, this.sorceryDiscardPile ].forEach((pile) => {
            if (pile && !pile.testUserPermission(user, CONST.ENTITY_PERMISSIONS.OBSERVER)) {
              stacks += `<br/>- ${pile.name}`;
            }
          });
          if (stacks) {
            ui.notifications.warn(game.i18n.format("castle-falkenstein.notifications.playerHasInsufficientPermissionsOnCardStacks", {
              player: user.name
            }) + stacks);
          }
        }
      });
    }
  }
  
  static async draw(deckType, destStack, nbCardsToDraw) {
    let cardsDrawn = [];

    const deck = CastleFalkenstein.deck(deckType);

    let nbCardsLeftInDeck = deck.cards.size - deck.drawnCards.length;

    let nbCardsDrawn = Math.min(nbCardsToDraw,nbCardsLeftInDeck);

    if (nbCardsDrawn > 0)
      cardsDrawn = cardsDrawn.concat(await destStack.draw(deck, nbCardsDrawn, {chatNotification: false}));

    nbCardsLeftInDeck -= nbCardsDrawn;

    if (nbCardsLeftInDeck <= 0) {
      await this.socket.executeAsGM("shuffleDiscardPile", deckType);

      // draw cards now that there should be some available.
      if (nbCardsDrawn < nbCardsToDraw) {
        // resurive call would be imaginable, but all cards from the decks may already be distributed in hands (e.g. too many NPC hands non-emptied).
        cardsDrawn = cardsDrawn.concat(await destStack.draw(deck, nbCardsToDraw - nbCardsDrawn, {chatNotification: false}));
      }
    }

    return cardsDrawn;
  }

  static async shuffleDiscardPile(deckType) {
    if (!game.user.isGM)
      CastleFalkenstein.consoleError("Unauthorized call to 'shuffleDiscardPile' from non-GM player");

    const discardPile = CastleFalkenstein.discardPile(deckType);
    await discardPile.reset();

    const deck = CastleFalkenstein.deck(deckType);
    await deck.shuffle();
  }

  static showActor(actorId) {
    const actor = game.actors.get(actorId);
    actor.sheet.render(true, { focus: true });
  }
  
  static async createHand(handType, actorId) {
    const actor = game.actors.get(actorId);
    const handData = {
      type: "hand",
      name: actor.computeHandName(handType),
      displayCount: true,
      folder: null, // the GM may freely moved the hand to whatever folder they wish afterwards. This probably does not deserve a system Setting.
      permission: actor.data.permission, // hands inherit the permissions from the actor they belong to
      folder: (await CastleFalkenstein.cardsFolder("character-hands", game.i18n.localize("castle-falkenstein.cardsDirectory.characterHandsFolder"))).id,
      "flags.castle-falkenstein": { type: handType, actor: actor.id }
    };

    const hand = await Cards.create(handData);

    await actor.update({
      [`data.hands.${handType}`]: hand.id
    });

    return hand;
  }

  static smallCardImg(card, classes) {
    const suit = card.data.suit;
    const value = card.data.suit == "joker" ? (card.name == "Black Joker" ? "black" : "red") : card.data.value;
    return `<img class="${classes}" src="systems/castle-falkenstein/src/cards/small/${suit}-${value}.svg" alt="${card.name}" title="${card.name}"></img>`;
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

  static createChatMessage(actor, flavor, content) {
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get('core', 'rollMode'),
      flavor: flavor,
      content: content,
      "flags.castle-falkenstein": { type: flavor }
    });
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
      src: "systems/castle-falkenstein/src/cards/deck-preset.json"
    };

    if(game.modules.get('babele')?.active) {
      Babele.get().setSystemTranslationsDir("lang/babele");
    }

    this.registerSettings();

    this.registerSheets();
  }

  static async onReady() {
    await this.preLoadTemplates();

    const userLanguage = game.settings.get("core", "language");
    if (userLanguage != "en" && game.system.languages.map(el => el.lang).includes(userLanguage)) {
      if(!game.modules.get('babele')?.active) {
        ui.notifications.warn(game.i18n.localize("castle-falkenstein.notifications.babeleRequired"));
      }
    }

    if (game.user.isGM) {
      this.createMissingCards();
    }

    // only Monarch fully supported for now
    if(!game.modules.get('monarch')?.active) {
      this.warnCardUiIsMissing();
    }

    CastleFalkenstein.consoleDebug("Debug mode active.");
    CastleFalkenstein.consoleInfo("Ready.");
  }

  static warnCardUiIsMissing() {
    
    const i18nSystem = game.i18n.localize("castle-falkenstein.system");
    const MESSAGE = `
      <p><b>${game.i18n.localize("castle-falkenstein.notifications.cardUiRequired")}</b></p>
      <small><p>${game.i18n.localize("castle-falkenstein.notifications.cardUiInstallDetails")}</p></small>`;

    // Settings key used for the "Don't remind me again" setting
    const DONT_REMIND_AGAIN_KEY = "libwrapper-dont-remind-again";

    // Dialog code
    CastleFalkenstein.consoleWarn(`No Card UI module present.`);
    game.settings.register(this.name, DONT_REMIND_AGAIN_KEY, { name: '', default: false, type: Boolean, scope: 'world', config: false });
    if(game.user.isGM && !game.settings.get(this.name, DONT_REMIND_AGAIN_KEY)) {
      new Dialog({
        title: game.i18n.localize("castle-falkenstein.system"),
        options: { top: 100 },
        content: MESSAGE, buttons: {
          ok: { icon: '<i class="fas fa-check"></i>', label: 'Understood' },
          dont_remind: { icon: '<i class="fas fa-times"></i>', label: "Don't remind me again", callback: () => game.settings.set(PACKAGE_ID, DONT_REMIND_AGAIN_KEY, true) }
        }
      }).render(true);
    }
  }

  static setupSocket() {
    this.socket = socketlib.registerSystem("castle-falkenstein");

    // register socket functions
	  this.socket.register("shuffleDiscardPile", this.shuffleDiscardPile);
    this.socket.register("showActor", this.showActor);
    this.socket.register("createHand", this.createHand);
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
      label: "castle-falkenstein.character",
      makeDefault: true
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("castle-falkenstein", CastleFalkensteinAbilitySheet, {
      types: ["ability"],
      label: "castle-falkenstein.ability.ability",
      makeDefault: true
    });
    Items.registerSheet("castle-falkenstein", CastleFalkensteinPossessionSheet, {
      types: ["possession"],
      label: "castle-falkenstein.possession.possession",
      makeDefault: true
    });
    Items.registerSheet("castle-falkenstein", CastleFalkensteinWeaponSheet, {
      types: ["weapon"],
      label: "castle-falkenstein.weapon.weapon",
      makeDefault: true
    });
    Items.registerSheet("castle-falkenstein", CastleFalkensteinSpellSheet, {
      types: ["spell"],
      label: "castle-falkenstein.spell.spell",
      makeDefault: true
    });

    // register Monarch Hand & Card sheets by default.
    const settings = game.settings.get("core", "sheetClasses") || {};
		foundry.utils.mergeObject(settings, {
      "Cards.base": "monarch.MonarchCard",
      "Cards.hand": "monarch.MonarchHand"
    });
		game.settings.set("core", "sheetClasses", settings);
  }

  // Load all the templates for handlebars partials.
  static async preLoadTemplates() {
    return loadTemplates([
      // Actor partials
      "systems/castle-falkenstein/src/documents/actor-abilities.hbs",
      "systems/castle-falkenstein/src/documents/actor-possessions.hbs",
      "systems/castle-falkenstein/src/documents/actor-spells.hbs"
    ]);
  }
  
  static async onRenderChatMessage(chatMessage, html, messageData) {
    CastleFalkensteinPerformFeat.onRenderChatMessage(chatMessage, html, messageData);
  }

  static async hotbarDrop(hotbar, data, slot) {
    // Create a Macro from an Item drop.
    // Get an existing item macro if one exists, otherwise create a new one.
    if (data.type !== "Item") return;
    if (!("data" in data)) return ui.notifications.warn("macroForOwnedItems");
    const item = data.data;

    // Create the macro command
    const command = `game.CastleFalkenstein.rollItemMacro("${item.type}", "${item.name}");`;
    let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
    if (!macro) {
      macro = await Macro.create({
        name: item.name,
        type: "script",
        img: item.img,
        command: command,
        "flags.castle-falkenstein": { itemMacro: true }
      });
    }
    game.user.assignHotbarMacro(macro, slot);
    return false;
  }
  
  static rollItemMacro(itemType, itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    const item = actor ? actor.items.find(i => i.type === itemType && i.name === itemName) : null;
    if (!item) {
      return ui.notifications.warn(game.i18n.format("castle-falkenstein.notifications.noItemNamed",{
        name: itemName,
        type: itemType
      }));
    }

    // Trigger the item roll
    return item.roll();
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

Hooks.on("renderChatMessage", (chatMessage, html, messageData) => CastleFalkenstein.onRenderChatMessage(chatMessage, html, messageData));

Hooks.on("hotbarDrop", (hotbar, data, slot) => CastleFalkenstein.hotbarDrop(hotbar, data, slot));

Hooks.on("preDeleteCards", (cards, options, user) => CastleFalkenstein.onPreDeleteCards(cards, options, user));

Hooks.on("deleteCards", (cards, options, user) => CastleFalkenstein.onDeleteCards(cards, options, user));

Hooks.on("renderPlayerList", (application, html, data) => CastleFalkenstein.onRenderPlayerList(application, html, data));

Hooks.on("getMonarchCardComponents", (monarch, components) => CastleFalkensteinMonarchConfig.onCardDisplay(monarch, components));

Hooks.on("getMonarchHandComponents", (monarch, components) => CastleFalkensteinMonarchConfig.onHandDisplay(monarch, components));

Hooks.on("clickMonarchCard", (event, app, card) => {return CastleFalkensteinMonarchConfig.onCardClick(event, app, card) });

Hooks.once("socketlib.ready", () => CastleFalkenstein.setupSocket());

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
