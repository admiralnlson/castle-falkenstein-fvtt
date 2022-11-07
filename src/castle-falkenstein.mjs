import { CASTLE_FALKENSTEIN } from "./config.mjs";
import { CastleFalkensteinActor } from "./documents/actor.mjs";
import { CastleFalkensteinItem } from "./documents/item.mjs";
import { CastleFalkensteinCards } from "./documents/cards.mjs";
import { CastleFalkensteinActorSheet } from "./documents/actor-sheet.mjs";
import { CastleFalkensteinAbilitySheet } from "./documents/item-ability-sheet.mjs";
import { CastleFalkensteinPossessionSheet } from "./documents/item-possession-sheet.mjs";
import { CastleFalkensteinSpellSheet } from "./documents/item-spell-sheet.mjs";
import { CastleFalkensteinWeaponSheet } from "./documents/item-weapon-sheet.mjs";
import { CastleFalkensteinHandSheet } from "./documents/hand-sheet.mjs";
import CastleFalkensteinMonarchConfig from "./monarch-config.mjs";
import CastleFalkensteinPerformFeat from "./forms/perform-feat.mjs";

export default class CastleFalkenstein {

  static get id() { return "castle-falkenstein"; }

  static get debugMode() {
    const api = game.modules.get("_dev-mode")?.api;
    if (!api) {
      return false;
    }
    return api.getPackageDebugValue(this.id);
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
      try { return game.settings.get(CastleFalkenstein.id, key); }
      catch (err) {
        CastleFalkenstein.consoleError(err);
        return undefined;
      };
    }
  });

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

  static async hostFortuneHand() {
    let hand = game.cards.filter(stack => stack.type === "hand" &&
      stack.getFlag(this.id, "type") === "fortune" &&
      stack.getFlag(this.id, "actor") === "host");

    if (hand.length > 0)
      return hand[0];

    hand = await this.socket.executeAsGM("createHand", "fortune", "host");
    return hand;
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
      if (f.type != "Cards") { return false; }

      const flag = f.flags['castle-falkenstein'] ?? {};
      return flag?.type == folderFlag.type;
    });

    if (existingFolder) {
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

  static async translateCardStack(stack) {
    const translateCard = (card) => {
      if (card.suit == "joker") {
        card.name = card.faces[0].name = game.i18n.localize("castle-falkenstein.cards.joker");
      } else {
        card.name = card.faces[0].name = game.i18n.format("castle-falkenstein.cards.nonJokerCardName", {
          value: game.i18n.localize("castle-falkenstein.cards." + card.value),
          suit: game.i18n.localize("castle-falkenstein.cards." + card.suit)
        });
      }
    };

    if (stack.cards)
      stack.cards.forEach((card) => translateCard(card));
    
    if (stack.availableCards)
      stack.availableCards.forEach((card) => translateCard(card));

    if (stack.drawnCards)
      stack.drawnCards.forEach((card) => translateCard(card));

    if (stack._source.cards)
      stack._source.cards.forEach((card) => translateCard(card));
  }

  static async createPresetDeck(type) {
    const response = await fetch("systems/castle-falkenstein/src/cards/deck-preset.json");
    const deckData = await response.json();
    // change the deck name to match its actual type and 
    // add Limited permission on the Dec so that plays may draw from it but not see its contents.
    deckData.name = game.i18n.localize(`castle-falkenstein.settings.${type}Deck.name`);
    deckData.ownership = deckData.ownership || {};
    deckData.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;
    deckData.folder = (await this.cardsFolder("decks-and-piles", game.i18n.localize("castle-falkenstein.cardsDirectory.decksAndPilesFolder"))).id;
    deckData.flags[this.id] = {
      type: type
    };

    this.translateCardStack(deckData);

    const deck = await Cards.create(deckData);

    await deck.shuffle();

    return deck;
  }

  static async createDiscardPile(type) {
    const pileData = {
      name: game.i18n.localize(`castle-falkenstein.settings.${type}DiscardPile.name`),
      type: "pile",
      folder: (await this.cardsFolder("decks-and-piles", game.i18n.localize("castle-falkenstein.cardsDirectory.decksAndPilesFolder"))).id,
      ownership: {
        default: CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER
      },
      "flags.castle-falkenstein": { type: type }
    }
    const pile = await Cards.create(pileData);
    return pile;
  }

  static async createMissingCards() {

    // Create Fortune/Sorcery Decks/Piles if missing

    let cardsCreatedI18n = "";

    if (!this.fortuneDeck) {
      const deck = await this.createPresetDeck("fortune");
      await game.settings.set(this.id, "fortuneDeck", deck.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.fortuneDeck.name");
    }

    if (!this.fortuneDiscardPile) {
      const pile = await this.createDiscardPile("fortune");
      await game.settings.set(this.id, "fortuneDiscardPile", pile.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.fortuneDiscardPile.name");
    }

    if (!this.sorceryDeck) {
      const deck = await this.createPresetDeck("sorcery");
      await game.settings.set(this.id, "sorceryDeck", deck.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.sorceryDeck.name");
    }

    if (!this.sorceryDiscardPile) {
      const pile = await this.createDiscardPile("sorcery");
      await game.settings.set(this.id, "sorceryDiscardPile", pile.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.sorceryDiscardPile.name");
    }

    // TBC Create Host Fortune hand if missing
    await this.hostFortuneHand();

    // TBC Create PC-owned actors' hands if missing

    // Notify the user

    if (cardsCreatedI18n)
      ui.notifications.info(game.i18n.localize("castle-falkenstein.notifications.createdCards") + cardsCreatedI18n);
  }

  static onReturnCards(stack, returned, { fromDelete, toUpdate } = {}) {
    if (returned.length > 0) {
      // shuffle the fortune (resp. sorcery) deck when cards from cards in a fortune/sorcery discard pile are recalled.
      const handType = stack.getFlag(this.id, "type");
      if (handType) {
        if (stack.type == "pile") {
          // shuffle the decks to which cards are being recalled
          for (const deckId in toUpdate) {
            const deck = game.cards.get(deckId);
            deck?.shuffle(); // no 'await' so that the shuffle happens after the actual return of the cards
          }
        }
      }
    }
  }

  static searchUniqueHand(handType, actorOrHost) {
    const actorFlag = actorOrHost === "host" ? "host" : actorOrHost.id;

    const search = game.cards.filter(stack => stack.type === "hand" &&
      stack.getFlag(this.id, "type") === handType &&
      stack.getFlag(this.id, "actor") === actorFlag);

    if (search.length > 1) {
      const name = actorOrHost === "host" ? "host" : actorOrHost.name;
      this.consoleError("Multiple " + handType + " hands found for " + name);
    }

    if (search.length > 0)
      return search[0];

    return null;
  }

  static async onRenderPlayerList(application, html, data) {
    this.checkPermissionsOnDecksAndPiles();
  }

  static async checkPermissionsOnDecksAndPiles() {
    if (game.user.isGM) {
      game.users.contents.forEach((user) => {
        if (user.active && !user.isGM) {
          let stacks = "";
          [this.fortuneDeck, this.sorceryDeck].forEach((deck) => {
            if (deck && !deck.testUserPermission(user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED)) {
              stacks += `<br/>- ${deck.name}`;
            }
          });
          [this.fortuneDiscardPile, this.sorceryDiscardPile].forEach((pile) => {
            if (pile && !pile.testUserPermission(user, CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER)) {
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

    let nbCardsDrawn = Math.min(nbCardsToDraw, nbCardsLeftInDeck);

    if (nbCardsDrawn > 0)
      cardsDrawn = cardsDrawn.concat(await destStack.draw(deck, nbCardsDrawn, { chatNotification: false }));

    nbCardsLeftInDeck -= nbCardsDrawn;

    if (nbCardsLeftInDeck <= 0) {
      await this.socket.executeAsGM("shuffleDiscardPile", deckType);

      // draw cards now that there should be some available.
      if (nbCardsDrawn < nbCardsToDraw) {
        // resurive call would be imaginable, but all cards from the decks may already be distributed in hands (e.g. too many NPC hands non-emptied).
        cardsDrawn = cardsDrawn.concat(await destStack.draw(deck, nbCardsToDraw - nbCardsDrawn, { chatNotification: false }));
      }
    }

    return cardsDrawn;
  }

  static async shuffleDiscardPile(deckType) {
    if (!game.user.isGM)
      CastleFalkenstein.consoleError("Unauthorized call to 'shuffleDiscardPile' from non-GM player");

    const discardPile = CastleFalkenstein.discardPile(deckType);
    if (game.release.generation == 9)
      await discardPile.reset();
    else
      await discardPile.recall();

    const deck = CastleFalkenstein.deck(deckType);
    await deck.shuffle();
  }

  static showActor(actorId) {
    const actor = game.actors.get(actorId);
    actor.sheet.render(true, { focus: true });
  }

  static async createHand(handType, actorId) {
    let handData = {};
    if (actorId === "host") {
      // create host hand
      handData = {
        type: "hand",
        name: game.i18n.format(`castle-falkenstein.fortune.hand.name`, { character: game.i18n.localize("castle-falkenstein.host") }),
        displayCount: true,
        // permission: ??? // no special permissions (limited to GM)
        folder: null, // the GM may freely move the hand to whatever folder they wish afterwards
        "flags.castle-falkenstein": { type: handType, actor: actorId }
      };
    } else {
      // create character fortune or sorcery hand
      const actor = game.actors.get(actorId);
      handData = {
        type: "hand",
        name: actor.computeHandName(handType),
        displayCount: true,
        ownership: actor.ownership, // hands inherit the ownership from the actor they belong to
        folder: (await CastleFalkenstein.cardsFolder("character-hands", game.i18n.localize("castle-falkenstein.cardsDirectory.characterHandsFolder"))).id,
        "flags.castle-falkenstein": { type: handType, actor: actor.id }
      };
    }

    const hand = await Cards.create(handData);

    if (hand) {
      ui.notifications.info(game.i18n.localize("castle-falkenstein.notifications.createdCards") +
        "<br/>  - " + hand.name);
    }

    return hand;
  }

  static smallCardImg(card, classes) {
    const suit = card.suit;
    const value = card.suit == "joker" ? (card.name == "Black Joker" ? "black" : "red") : card.value;
    return `<img class="${classes}" src="systems/castle-falkenstein/src/cards/small/${suit}-${value}.svg" alt="${card.name}" title="${card.name}"></img>`;
  }

  static abilityLevelAsSentenceHtml(abilityItem, includeAbilitySuit = true) {
    const levelI18nKey = game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[abilityItem.system.level].full);
    const levelValue = CASTLE_FALKENSTEIN.abilityLevels[abilityItem.system.level].value;
    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[abilityItem.system.suit];

    const level = `${game.i18n.localize(levelI18nKey)} [${levelValue}]`;
    let ability = `${abilityItem.name}`;
    if (includeAbilitySuit)
      ability += ` [<span class="suit-symbol-${abilityItem.system.suit}">${suitSymbol}</span>]`;

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
      type: CONST.CHAT_MESSAGE_TYPES.OOC,
      flavor: flavor,
      content: content,
      "flags.castle-falkenstein": { type: flavor }
    });
  }


  static onInit() {

    // Disable deprecation warnings if the v9 track is used with v10
    if (game.release.generation == 10 && (game.system.version >= '1.0.0' && game.system.version < '2.0.0')) {
      CONFIG.compatibility.mode = CONST.COMPATIBILITY_MODES.SILENT;
    }

    game.CastleFalkenstein = CastleFalkenstein;

    // Add custom constants for configuration.
    CONFIG.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;

    // Define custom Document classes
    CONFIG.Actor.documentClass = CastleFalkensteinActor;
    CONFIG.Item.documentClass = CastleFalkensteinItem;
    CONFIG.Cards.documentClass = CastleFalkensteinCards;

    // Declare Castle Falkenstein deck preset
    CONFIG.Cards.presets.castleFalkensteinDeck = {
      type: "deck",
      label: "castle-falkenstein.system",
      src: "systems/castle-falkenstein/src/cards/deck-preset.json"
    };

    if (game.modules.get('babele')?.active) {
      Babele.get().setSystemTranslationsDir("lang/babele");
    }

    this.registerSettings();

    this.registerSheets();
  }

  static async onReady() {

    await this.preLoadTemplates();

    if (CONFIG["Cards"].sheetClasses.hand["monarch.MonarchHand"])
      CONFIG["Cards"].sheetClasses.hand["monarch.MonarchHand"].default = (this.cardsUi == this.CARDS_UI_OPTIONS.monarch);

    if (CONFIG["Cards"].sheetClasses.hand["castle-falkenstein.CastleFalkensteinHandSheet"])
      CONFIG["Cards"].sheetClasses.hand["castle-falkenstein.CastleFalkensteinHandSheet"].default = (this.cardsUi == this.CARDS_UI_OPTIONS.default);

    const userLanguage = game.settings.get("core", "language");
    if (userLanguage != "en" && Array.from(game.system.languages.map(el => el.lang)).includes(userLanguage)) {
      if (!game.modules.get('babele')?.active) {
        ui.notifications.warn(game.i18n.localize("castle-falkenstein.notifications.babeleRequired"));
      }
    }

    if (game.user.isGM) {
      this.createMissingCards();
    }

    await game.cards.updateAll(this.translateCardStack, (stack) => {
      return stack.flags[CastleFalkenstein.id];
    });

    CastleFalkenstein.consoleDebug("Debug mode active.");
    CastleFalkenstein.consoleInfo("Ready.");
  }

  static setupSocket() {
    this.socket = socketlib.registerSystem(this.id);

    // register socket functions
    this.socket.register("shuffleDiscardPile", this.shuffleDiscardPile);
    this.socket.register("showActor", this.showActor);
    this.socket.register("createHand", this.createHand);
  }

  static get cardsUi() {
    return game.modules.get('monarch')?.active ? this.settings.cardsUi : this.CARDS_UI_OPTIONS.default;
  }

  static _cardStackSelect = (stackType) => {
    return {
      scope: "world",
      type: String,
      default: "",
      requiresReload: true,
      choices: () => ({
        "": "",
        ...Object.fromEntries(
          game.cards
            .filter(stack => stack.type === stackType)
            .map(stack => [stack.id, stack.name])
        )
      })
    }
  };

  static CARDS_UI_OPTIONS = {
    default: "default",
    monarch: "monarch"
  };

  static SETTING_DEFINITIONS = {

    // Host settings
    fortuneDeck: this._cardStackSelect("deck"),
    fortuneDiscardPile: this._cardStackSelect("pile"),
    sorceryDeck: this._cardStackSelect("deck"),
    sorceryDiscardPile: this._cardStackSelect("pile"),
    sorceryAbility: {
      scope: "world",
      type: String,
      default: "",
      requiresReload: true
    },
    // Player settings
    cardsUi: {
      scope: "client",
      choices: () => ({ // TODO  make it more dynamic (checking that Monarch is active and if not disable the setting)
        [this.CARDS_UI_OPTIONS.default]: game.i18n.localize("castle-falkenstein.settings.cardsUi.valueDefault"),
        [this.CARDS_UI_OPTIONS.monarch]: "🦋 Monarch"
      }),
      default: this.CARDS_UI_OPTIONS.default,
      requiresReload: true
    }
  };

  static registerSettings() {

    Object.entries(this.SETTING_DEFINITIONS).forEach(([key, def]) => {
      game.settings.register(this.id, key, {
        ...def,
        config: true,
        name: `castle-falkenstein.settings.${key}.name`,
        hint: `castle-falkenstein.settings.${key}.hint`
      });
    });

  }

  static registerSheets() {
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet(this.id, CastleFalkensteinActorSheet, {
      label: "castle-falkenstein.character",
      makeDefault: true
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet(this.id, CastleFalkensteinAbilitySheet, {
      types: ["ability"],
      label: "castle-falkenstein.ability.ability",
      makeDefault: true
    });
    Items.registerSheet(this.id, CastleFalkensteinPossessionSheet, {
      types: ["possession"],
      label: "castle-falkenstein.possession.possession",
      makeDefault: true
    });
    Items.registerSheet(this.id, CastleFalkensteinWeaponSheet, {
      types: ["weapon"],
      label: "castle-falkenstein.weapon.weapon",
      makeDefault: true
    });
    Items.registerSheet(this.id, CastleFalkensteinSpellSheet, {
      types: ["spell"],
      label: "castle-falkenstein.spell.spell",
      makeDefault: true
    });

    CardStacks.registerSheet(this.id, CastleFalkensteinHandSheet, {
      types: ["hand"],
      label: "castle-falkenstein.settings.cardsUi.valueDefault",
      makeDefault: this.cardsUi == this.CARDS_UI_OPTIONS.default
    });

  }

  // Load all the templates for handlebars partials.
  static async preLoadTemplates() {
    return loadTemplates([
      // Actor partials
      "systems/castle-falkenstein/src/documents/actor-abilities.hbs",
      "systems/castle-falkenstein/src/documents/actor-possessions.hbs",
      "systems/castle-falkenstein/src/documents/actor-spells.hbs",
      // TODO check is needed:
      "systems/castle-falkenstein/src/documents/hand-sheet.hbs"
    ]);
  }

  static async onRenderChatMessage(chatMessage, html, messageData) {
    CastleFalkensteinPerformFeat.onRenderChatMessage(chatMessage, html, messageData);
  }

  static async addItemMacroAtHotbarSlot(item, slot) {
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
  }

  static hotbarDrop(hotbar, data, slot) {
    // Create a Macro from an Item drop.
    // Get an existing item macro if one exists, otherwise create a new one.
    if (data.type !== "Item") return;
    if (!data.uuid) return;
    const uuidParts = data.uuid.split(".");
    if (uuidParts.length != 4 || uuidParts[0] != "Actor" || uuidParts[2] != "Item") return;
    const actor = game.actors.get(uuidParts[1]);
    if (!actor) return;
    const item = actor.items.get(uuidParts[3]);
    if (!item) return;

    CastleFalkenstein.addItemMacroAtHotbarSlot(item, slot);
    return false;
  }

  static rollItemMacro(itemType, itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    const item = actor ? actor.items.find(i => i.type === itemType && i.name === itemName) : null;
    if (!item) {
      return ui.notifications.warn(game.i18n.format("castle-falkenstein.notifications.noItemNamed", {
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
  registerPackageDebugFlag(CastleFalkenstein.id);
});

Hooks.once("init", () => CastleFalkenstein.onInit());

Hooks.once("ready", () => CastleFalkenstein.onReady());

Hooks.on("renderChatMessage", (chatMessage, html, messageData) => CastleFalkenstein.onRenderChatMessage(chatMessage, html, messageData));

Hooks.on("hotbarDrop", (hotbar, data, slot) => { return CastleFalkenstein.hotbarDrop(hotbar, data, slot) });

Hooks.on("returnCards", (stack, returned, context) => CastleFalkenstein.onReturnCards(stack, returned, context));

Hooks.on("renderPlayerList", (application, html, data) => CastleFalkenstein.onRenderPlayerList(application, html, data));

Hooks.on("getMonarchCardComponents", (monarch, components) => CastleFalkensteinMonarchConfig.onCardDisplay(monarch, components));

Hooks.on("getMonarchHandComponents", (monarch, components) => CastleFalkensteinMonarchConfig.onHandDisplay(monarch, components));

Hooks.on("clickMonarchCard", (event, app, card) => { return CastleFalkensteinMonarchConfig.onCardClick(event, app, card) });

Hooks.once("socketlib.ready", () => CastleFalkenstein.setupSocket());

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

Handlebars.registerHelper('ifequal', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifnotequal', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('times', function (n, block) {
  var accum = '';
  for (var i = 0; i < n; ++i)
    accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('add', function (a, b) {

  return parseInt(a) + parseInt(b);
});

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
