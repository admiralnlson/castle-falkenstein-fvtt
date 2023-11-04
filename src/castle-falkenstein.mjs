import { CASTLE_FALKENSTEIN } from "./config.mjs";
import { CastleFalkensteinActorDataModel } from "./documents/actor-datamodel.mjs";
import { CastleFalkensteinActorSheet } from "./documents/actor-sheet.mjs";
import { CastleFalkensteinActor } from "./documents/actor.mjs";
import { CastleFalkensteinCards } from "./documents/cards.mjs";
import { CastleFalkensteinHandSheet } from "./documents/hand-sheet.mjs";
import { CastleFalkensteinAbilityDataModel } from "./documents/item-datamodel-ability.mjs";
import { CastleFalkensteinWeaponDataModel } from "./documents/item-datamodel-weapon.mjs";
import { CastleFalkensteinPossessionDataModel } from "./documents/item-datamodel-possession.mjs";
import { CastleFalkensteinSpellDataModel } from "./documents/item-datamodel-spell.mjs";
import { CastleFalkensteinAbilitySheet } from "./documents/item-sheet-ability.mjs";
import { CastleFalkensteinWeaponSheet } from "./documents/item-sheet-weapon.mjs";
import { CastleFalkensteinPossessionSheet } from "./documents/item-sheet-possession.mjs";
import { CastleFalkensteinSpellSheet } from "./documents/item-sheet-spell.mjs";
import { CastleFalkensteinItem } from "./documents/item.mjs";
import { CastleFalkensteinMonarchConfig } from "./monarch-config.mjs";
import { CastleFalkensteinPerformFeat } from "./forms/perform-feat.mjs";

export class CastleFalkenstein {

  static get id() { return "castle-falkenstein"; }

  static debug = false;

  static log = {
    _log: (logLevel, msg, ...args) => {
      const color = "background: #ffda87; color: #000;";
      if (typeof msg === "string") {
        console[logLevel](`%c Castle Falkenstein | [${logLevel.toUpperCase()}] ${msg}`, color, ...args);
      } else {
        console[logLevel](`%c Castle Falkenstein | [${logLevel.toUpperCase()}] ${typeof msg} display:`, color);
        console[logLevel](msg);
      }
    },
    debug: (msg, ...args) => { if (this.debug) { this.log._log("debug", msg, ...args); } },
    info: (msg, ...args) => { this.log._log("info", msg, ...args); },
    warn: (msg, ...args) => { this.log._log("warn", msg, ...args); },
    error: (msg, ...args) => { this.log._log("error", msg, ...args); ui.notifications.error("Internal Castle Falkenstein system error (see console for details)"); }
  };

  static notif = {
    info: (msg, ...args) => { this.log._log("info", msg, ...args); ui.notifications.info(msg, ...args); },
    warn: (msg, ...args) => { this.log._log("warn", msg, ...args); ui.notifications.warn(msg, ...args); },
    error: (msg, ...args) => { this.log._log("error", msg, ...args); ui.notifications.error(msg, ...args); }
  };

  /**
   * Convenience proxy getter for CastleFalkenstein settings.
   */
  static settings = new Proxy({}, {
    get: function (target, key) {
      try { return game.settings.get(CastleFalkenstein.id, key); }
      catch (err) {
        CastleFalkenstein.log.error(err);
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
      CastleFalkenstein.log.error(`Unknown deck type '${type}'`);
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
        if (card.faces[0].img == "systems/castle-falkenstein/src/cards/53.png")
          card.name = card.faces[0].name = game.i18n.localize("castle-falkenstein.cards.blackJoker");
        else if (card.faces[0].img == "systems/castle-falkenstein/src/cards/54.png")
          card.name = card.faces[0].name = game.i18n.localize("castle-falkenstein.cards.redJoker");
        else // just in case
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
    deckData.folder = (await this.cardsFolder("decks-and-piles", game.i18n.localize("castle-falkenstein.cardsDirectory.decksFolder"))).id;
    deckData.flags[this.id] = {
      type: type
    };

    this.translateCardStack(deckData);

    const deck = await Cards.create(deckData);

    await deck.shuffle();

    return deck;
  }

  static async prepareCardStacks() {

    // Delete discard piles used in previous versions
    await game.cards.filter(stack => stack.type === "pile").forEach(async (stack) => {
      const type = stack.getFlag(CastleFalkenstein.id, "type");
      if (type) {
        // This should return cards they contain to their origin decks but also reshuffle these decks. See CastleFalkensteinCards.onReturnCards() override.
        await stack.delete();
      }
    });

    // Create Fortune/Sorcery Decks which are missing

    let cardsCreatedI18n = "";

    if (!this.fortuneDeck) {
      const deck = await this.createPresetDeck("fortune");
      await game.settings.set(this.id, "fortuneDeck", deck.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.fortuneDeck.name");
    }

    if (!this.sorceryDeck) {
      const deck = await this.createPresetDeck("sorcery");
      await game.settings.set(this.id, "sorceryDeck", deck.id);
      cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.sorceryDeck.name");
    }

    // TBC Create Host Fortune hand if missing
    await this.hostFortuneHand();

    // TBC Create PC-owned actors' hands if missing

    // Notify the user

    if (cardsCreatedI18n)
      CastleFalkenstein.notif.info(game.i18n.localize("castle-falkenstein.notifications.createdCards") + cardsCreatedI18n);
  }

  static onReturnCards(stack, returned, { fromDelete, toUpdate } = {}) {
    if (returned.length > 0) {
      // shuffle the fortune (resp. sorcery) deck when cards are recalled to it
      const stackType = stack.getFlag(this.id, "type");
      if (stackType) {
        this.deck(stackType)?.shuffle(); // no 'await' so that the shuffle happens after the actual return of the cards
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
      CastleFalkenstein.log.error("Multiple " + handType + " hands found for " + name);
    }

    if (search.length > 0)
      return search[0];

    return null;
  }

  static async onRenderPlayerList(application, html, data) {
    this.checkPermissionsOnDecks();
  }

  static async onPopout(app, popout) {

    if (app?.options?.template == "systems/castle-falkenstein/src/documents/hand-sheet.hbs") {
      const cardWidth = CastleFalkenstein.settings.cardWidth;

      const hand = app.object;
      const deckType = hand.getFlag(CastleFalkenstein.id, "type");
      const deck = CastleFalkenstein.deck(deckType);

      // cards in the hand besides the first overlap each other by 0.4x their width (the fact they rotate should not influence the overall width much).
      const innerWidth = cardWidth * (1 + (app.object.cards.size > 0 ? app.object.cards.size - 1 : 0) * 0.41);
      // cards typically have a 2x3 ratio (width *1.5), may be focused (scale: 1.5) and there is a button to return sorcery cards underneath them
      const innerHeight = CastleFalkenstein.computeCardHeight(deck) + 60 + 50;

      popout.resizeTo(innerWidth + popout.outerWidth - app.options.width,
                      innerHeight + popout.outerHeight - app.options.height);
    }
  }

  static async onRenderPlayerList(application, html, data) {
    this.checkPermissionsOnDecks();
  }

  static async checkPermissionsOnDecks() {
    if (game.user.isGM) {
      game.users.contents.forEach((user) => {
        if (user.active && !user.isGM) {
          let stacks = "";
          [this.fortuneDeck, this.sorceryDeck].forEach((deck) => {
            if (deck && !deck.testUserPermission(user, CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED)) {
              stacks += `<br/>- ${deck.name}`;
            }
          });
          if (stacks) {
            CastleFalkenstein.notif.warn(game.i18n.format("castle-falkenstein.notifications.playerHasInsufficientPermissionsOnCardStacks", {
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

    const nbCardsLeftInDeck = deck.cards.size - deck.drawnCards.length;

    if (nbCardsLeftInDeck <= 0 && nbCardsToDraw > 0) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.cannotDraw"));
      return 0;
    }

    const nbCardsActuallyDrawn = Math.min(nbCardsToDraw, nbCardsLeftInDeck);

    if (nbCardsActuallyDrawn > 0)
      cardsDrawn = cardsDrawn.concat(await destStack.draw(deck, nbCardsActuallyDrawn, { chatNotification: false }));

    if (nbCardsActuallyDrawn < nbCardsToDraw) {
      CastleFalkenstein.notif.warn(game.i18n.format("castle-falkenstein.notifications.incompleteDraw", {
        nb1: nbCardsActuallyDrawn,
        nb2: nbCardsToDraw
      }));
    } else if (nbCardsActuallyDrawn == nbCardsLeftInDeck) {
      CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.lastCardDrawn"));
    }

    return cardsDrawn;
  }

  static showActor(actorId) {
    const actor = game.actors.get(actorId);
    actor.sheet.render(true);
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
      CastleFalkenstein.notif.info(game.i18n.localize("castle-falkenstein.notifications.createdCards") + "<br/>  - " + hand.name);
    }

    return hand;
  }

  static usingRTGCardVisuals(deck) {
    return deck?.img == "systems/castle-falkenstein/src/cards/back-square.png";
  }

  static computeCardHeight(deck) {
    const cardWidth = CastleFalkenstein.settings.cardWidth;

    if (deck?.img == "systems/castle-falkenstein/src/cards/back-square.png") {
      return cardWidth * 670 / 470;
    }
    else if (deck?.width > 0 && deck?.height > 0) {
      return cardWidth * deck.height / deck.width;
    }
    else {
      return cardWidth * 3 / 2;
    }
  }

  static smallCardImg(card, classes) {
    const suit = card.suit;
    const value = card.suit == "joker" ? (card.name == game.i18n.localize("castle-falkenstein.cards.blackJoker") ? "black" : "red") : card.value;
    return `<img class="${classes}" src="systems/castle-falkenstein/src/cards/small/${suit}-${value}.svg" alt="${card.name}" title="${card.name}"></img>`;
  }

  static abilityLevelAsSentenceHtml(abilityItem, includeAbilitySuit = true) {
    const levelI18nKey = game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[abilityItem.system.level].full);
    const levelValue = CASTLE_FALKENSTEIN.abilityLevels[abilityItem.system.level].value;
    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[abilityItem.system.suit];

    const level = `${game.i18n.localize(levelI18nKey)} [${levelValue}]`;
    let ability = `${abilityItem.system.displayName}`;
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

    if (game.release.generation >= 11) {
      CONFIG.Actor.dataModels.character = CastleFalkensteinActorDataModel;
      // the system does not have Actor packs, but users might.
      CONFIG.Actor.compendiumIndexFields = ["name", "system.description"];
      
      CONFIG.Item.dataModels.ability = CastleFalkensteinAbilityDataModel;
      CONFIG.Item.dataModels.weapon = CastleFalkensteinWeaponDataModel;
      CONFIG.Item.dataModels.possession = CastleFalkensteinPossessionDataModel;
      CONFIG.Item.dataModels.spell = CastleFalkensteinSpellDataModel;
      CONFIG.Item.compendiumIndexFields = ["name", "system.description"];

      game.packs.forEach(p => p.getIndex({fields: ["name", "system.description"]}));
    }

    // Declare Castle Falkenstein deck preset
    CONFIG.Cards.presets.castleFalkensteinDeck = {
      type: "deck",
      label: "castle-falkenstein.system",
      src: "systems/castle-falkenstein/src/cards/deck-preset.json"
    };

    this.registerSettings();

    this.registerSheets();
  }

  static async onSetup() {
    if (game.settings.get("core", "language") != "en" && game.modules.get('babele')?.active) {
      Babele.get().setSystemTranslationsDir("lang/babele");
    }

    await this.preLoadTemplates();

    if (CONFIG["Cards"].sheetClasses.hand["monarch.MonarchHand"])
    CONFIG["Cards"].sheetClasses.hand["monarch.MonarchHand"].default = (this.cardsUi == this.CARDS_UI_OPTIONS.monarch);

    if (CONFIG["Cards"].sheetClasses.hand["castle-falkenstein.CastleFalkensteinHandSheet"])
      CONFIG["Cards"].sheetClasses.hand["castle-falkenstein.CastleFalkensteinHandSheet"].default = (this.cardsUi == this.CARDS_UI_OPTIONS.native);

      
    if (game.user.isGM) {
      await this.prepareCardStacks();
    }

    const userLanguage = game.settings.get("core", "language");
    if (userLanguage != "en" && Array.from(game.system.languages.map(el => el.lang)).includes(userLanguage)) {
      await game.cards.updateAll(this.translateCardStack, (stack) => {
        return stack.flags[CastleFalkenstein.id];
      });
    }

    // align "Harm Rank" spell definition labels to the chosen damageSystem setting 
    const harmRankDef = CASTLE_FALKENSTEIN.spellDefinitions["harmRank"];
    for (let level in harmRankDef.levels) {
      if (level != "-") {
        harmRankDef.levels[level].label = game.i18n.localize(`castle-falkenstein.spell.definition.harmRank.${level}`);
        if (this.settings.damageSystem != this.DAMAGE_SYSTEM_OPTIONS.harmRank)
          harmRankDef.levels[level].label += ": " + harmRankDef.levels[level].wounds;
      }
    }
  }

  static async onReady() {

    const userLanguage = game.settings.get("core", "language");
    if (userLanguage != "en" && Array.from(game.system.languages.map(el => el.lang)).includes(userLanguage)) {
      const babele = game.modules.get('babele');
      if (!babele) {
        CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.babeleInstallRequired"));
      } else if (!babele.active) {
        CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.babeleActivationRequired"));
      }
    }

    CastleFalkenstein.log.debug("Debug mode active.");
    CastleFalkenstein.log.info("Ready.");
  }

  static async shuffleBackToDeck(stackId, idsOfCardsPlayed) {
    const stack = game.cards.get(stackId);
    const type = stack.getFlag(CastleFalkenstein.id, "type");
    if (type) {
      const deck = CastleFalkenstein.deck(type);
      await stack.pass(deck, idsOfCardsPlayed, {chatNotification: false});
      await deck.shuffle({ chatNotification: false });
    }
  }

  static setupSocket() {
    this.socket = socketlib.registerSystem(this.id);

    // register socket functions
    this.socket.register("showActor", this.showActor);
    this.socket.register("createHand", this.createHand);
    this.socket.register("shuffleBackToDeck", this.shuffleBackToDeck)
  }

  static get cardsUi() {
    return game.modules.get('monarch')?.active ? this.settings.cardsUi : this.CARDS_UI_OPTIONS.native;
  }

  static _cardStackSelect = (stackType) => {
    return {
      scope: "world",
      type: String,
      default: "",
      requiresReload: true,
      choices: () => ({
        ...Object.fromEntries(
          game.cards
            .filter(stack => stack.type === stackType)
            .map(stack => [stack.id, stack.name])
        )
      })
    }
  };

  static CARDS_UI_OPTIONS = {
    native: "native",
    monarch: "monarch"
  };

  static DAMAGE_SYSTEM_OPTIONS = {
    both: "both",
    wounds: "wounds",
    harmRank: "harmRank"
  };

  static SETTING_DEFINITIONS = {

    // Host settings
    fortuneDeck: this._cardStackSelect("deck"),
    sorceryDeck: this._cardStackSelect("deck"),
    sorceryAbility: {
      scope: "world",
      type: String,
      default: "",
      requiresReload: true
    },
    damageSystem: {
      scope: "world",
      choices: () => ({
        [this.DAMAGE_SYSTEM_OPTIONS.both]: game.i18n.localize("castle-falkenstein.settings.damageSystem.both"),
        [this.DAMAGE_SYSTEM_OPTIONS.wounds]: game.i18n.localize("castle-falkenstein.settings.damageSystem.wounds"),
        [this.DAMAGE_SYSTEM_OPTIONS.harmRank]: game.i18n.localize("castle-falkenstein.settings.damageSystem.harmRank")
      }),
      default: this.DAMAGE_SYSTEM_OPTIONS.both,
      requiresReload: true
    },
    // Player settings
    cardsUi: {
      scope: "client",
      choices: () => ({ // TODO  make it more dynamic (checking that Monarch is active and if not disable the setting)
        [this.CARDS_UI_OPTIONS.native]: game.i18n.localize("castle-falkenstein.settings.cardsUi.valueNative"),
        [this.CARDS_UI_OPTIONS.monarch]: "🦋 Monarch"
      }),
      default: this.CARDS_UI_OPTIONS.native,
      requiresReload: true
    },
    cardWidth: {
      scope: "client",
      type: Number,
      range: {
        min: 100,
        max: 400,
        step: 10
      },
      default: 200,
      requiresReload: false,
      onChange: value => {
        game.cards.filter(stack => stack.type == "hand" && stack.sheet.rendered).forEach(stack => stack.render());
      }

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

    // transparent migration from old setting value "default" to new value "native"
    if (CastleFalkenstein.settings.cardsUi == "default")
      game.settings.set(CastleFalkenstein.id, "cardsUi", CastleFalkenstein.CARDS_UI_OPTIONS.native);
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
      label: "castle-falkenstein.settings.cardsUi.valueNative",
      makeDefault: this.cardsUi == this.CARDS_UI_OPTIONS.native
    });

  }

  // Load all the templates for handlebars partials.
  static async preLoadTemplates() {
    return loadTemplates([
      // Actor partials
      "systems/castle-falkenstein/src/documents/actor-sheet-abilities.hbs",
      "systems/castle-falkenstein/src/documents/actor-sheet-possessions.hbs",
      "systems/castle-falkenstein/src/documents/actor-sheet-spells.hbs",
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
      return CastleFalkenstein.notif.warn(game.i18n.format("castle-falkenstein.notifications.noItemNamed", {
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
Hooks.once("setup", () => CastleFalkenstein.onSetup());
Hooks.once("ready", () => CastleFalkenstein.onReady());

Hooks.on("renderChatMessage", (chatMessage, html, messageData) => CastleFalkenstein.onRenderChatMessage(chatMessage, html, messageData));

Hooks.on("hotbarDrop", (hotbar, data, slot) => { return CastleFalkenstein.hotbarDrop(hotbar, data, slot) });

Hooks.on("returnCards", (stack, returned, context) => CastleFalkenstein.onReturnCards(stack, returned, context));

Hooks.on("renderPlayerList", (application, html, data) => CastleFalkenstein.onRenderPlayerList(application, html, data));

Hooks.on("PopOut:popout", (app, popout) => { return CastleFalkenstein.onPopout(app, popout) });

Hooks.once("socketlib.ready", () => CastleFalkenstein.setupSocket());

Hooks.on("getMonarchCardComponents", (monarch, components) => CastleFalkensteinMonarchConfig.onCardDisplay(monarch, components));

Hooks.on("getMonarchHandComponents", (monarch, components) => CastleFalkensteinMonarchConfig.onHandDisplay(monarch, components));

Hooks.on("clickMonarchCard", (event, app, card) => { return CastleFalkensteinMonarchConfig.onCardClick(event, app, card) });


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

Handlebars.registerHelper('or', function() {
  return Array.prototype.slice.call(arguments, 0, arguments.length - 1).some(Boolean);
});

Handlebars.registerHelper('isNumber', function(a) {
  return typeof a == 'number';
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
