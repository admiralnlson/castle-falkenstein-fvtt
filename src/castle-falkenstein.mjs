import { CASTLE_FALKENSTEIN } from "./config.mjs";
import { CastleFalkensteinActorDataModel } from "./documents/actor-datamodel.mjs";
import { CastleFalkensteinActorSheet } from "./documents/actor-sheet.mjs";
import { CastleFalkensteinActor } from "./documents/actor.mjs";
import { CastleFalkensteinCombatant } from "./documents/combatant.mjs";
import { CastleFalkensteinCombat } from "./documents/combat.mjs";
import { CastleFalkensteinCards } from "./documents/cards.mjs";
import { CastleFalkensteinDeckSheet } from "./documents/deck-sheet.mjs";
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
import { CastleFalkensteinDefineSpell } from "./forms/define-spell.mjs";

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
    info: (msg) => { this.log._log("info", msg); ui.notifications.info(msg, {console: false}); },
    warn: (msg) => { this.log._log("warn", msg); ui.notifications.warn(msg, {console: false}); },
    error: (msg) => { this.log._log("error", msg); ui.notifications.error(msg, {console: false}); }
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
    },
    set: async function (target, key, value) {
      try {
        await game.settings.set(CastleFalkenstein.id, key, value);
        return true;
      }
      catch (err) {
        CastleFalkenstein.log.error(err);
        return false;
      };
    }
  });

  static get fortuneDeck() {
    return this.deck("fortune");
  }

  static get sorceryDeck() {
    return this.deck("sorcery");
  }

  static deck(type) {
    const setting = this.settings[`${type}Deck`];

    if (!setting) {
      // invalid setting has already generated foundry native log error
      return;
    }

    const deck = game.cards.get(setting);

    if (!deck) {
      CastleFalkenstein.notif.error(game.i18n.localize("castle-falkenstein.notifications.deckNotFound"));
    }

    return deck;
  }

  static async hostFortuneHand() {
    let hand = game.cards.filter(stack => stack.type === "hand" &&
      stack.getFlag(this.id, "type") === "fortune" &&
      stack.getFlag(this.id, "actor") === "host");

    if (hand.length > 0)
      return hand[0];

    if (!game.users.activeGM) {
      // planning to use executeAsGM below
      CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.cannotCarryOutActionWithoutHost"));
      return;
    }
    hand = await this.socket.executeAsGM("createHand", "fortune", "host");
    return hand;
  }

  static i18nAbility(ability) {
    this.settings[ability + "Ability"] = this.settings[ability + "Ability"].trim();

    if (this.settings[ability + "Ability"] != "")
      return this.settings[ability + "Ability"];

    return game.i18n.localize(`castle-falkenstein.settings.${ability}Ability.default`);
  }

  static async folder(documentType, flagType, name) {

    // Flags for the folder
    const folderFlag = {
      type: flagType
    };

    // Does the folder already exist?
    const existingFolder = game.folders.find(f => {
      if (f.type != documentType) { return false; }

      const flag = f.flags['castle-falkenstein'] ?? {};
      return flag?.type == folderFlag.type;
    });

    if (existingFolder) {
      return existingFolder;
    }

    // Create a new folder
    const newFolder = await Folder.create({
      name: name,
      type: documentType,
      sorting: 'm',
      "flags.castle-falkenstein": folderFlag
    });
    return newFolder;
  }

  static async cardsFolder(flagType, name) {
    return CastleFalkenstein.folder("Cards", flagType, name);
  }

  static async diariesFolder(name) {
    return CastleFalkenstein.folder("JournalEntry", "character-diaries", name);
  }

  static translateCardStack(stack) {

    // if a deck but not a system-provided deck, then don't translate it.
    if (stack.type == "deck" && !stack.getFlag("castle-falkenstein", "type"))
      return;

    const translateCard = (card) => {
      // if the card does not belong to a system-provided deck, then don't translate it.
      if (card.origin && !card.origin.getFlag("castle-falkenstein", "type"))
        return;

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
  }

  static async createPresetDeck(type) {
    const response = await fetch(`systems/castle-falkenstein/src/cards/deck-preset-${type}.json`);
    const deckData = await response.json();

    // change the deck name to match its actual type 
    deckData.name = game.i18n.localize(`castle-falkenstein.settings.${type}Deck.name`);

    // add Limited ownership on the Deck so that players may draw from it but not see its contents.
    deckData.ownership = deckData.ownership || {};
    deckData.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;

    deckData.folder = (await this.cardsFolder("decks-and-piles", game.i18n.localize("castle-falkenstein.cardsDirectory.decksFolder"))).id;
    deckData.flags[this.id] = {
      type: type
    };

    const deck = await Cards.create(deckData);

    return deck;
  }

  static async prepareCardStacks() {

    if (game.user.isGM) {
      // Delete discard piles used in previous versions
      await game.cards.filter(stack => stack.type === "pile").forEach(async (stack) => {
        const type = stack.getFlag(CastleFalkenstein.id, "type");
        if (type) {
          // This should return cards they contain to their origin decks.
          await stack.delete();
        }
      });

      // Create Fortune/Sorcery Decks which are missing

      let cardsCreatedI18n = "";

      if (!game.cards.get(this.settings.fortuneDeck)) {
        const deck = await this.createPresetDeck("fortune");
        this.settings.fortuneDeck = deck.id;
        cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.fortuneDeck.name");
      }

      if (!game.cards.get(this.settings.sorceryDeck)) {
        const deck = await this.createPresetDeck("sorcery");
        this.settings.sorceryDeck = deck.id;
        cardsCreatedI18n += "<br/>  - " + game.i18n.localize("castle-falkenstein.settings.sorceryDeck.name");
      }

      // Create Host Fortune hand if missing
      await this.hostFortuneHand();

      // TBC Create PC-owned actors' hands if missing

      // Notify the user (Host)

      if (cardsCreatedI18n)
        CastleFalkenstein.notif.info(game.i18n.localize("castle-falkenstein.notifications.created") + cardsCreatedI18n);
    }
  }

  static searchUniqueHand(handType, actor, searchDedicatedFortuneHand=false) {

    const actorFlag = searchDedicatedFortuneHand
                      ? actor.id
                      : (handType === "fortune" && !actor.hasPlayerOwner ? "host" : actor.id);

    const search = game.cards.filter(stack => stack.type === "hand" &&
                                     stack.getFlag(this.id, "type") === handType &&
                                     stack.getFlag(this.id, "actor") === actorFlag);

    if (search.length > 1) {
      const name = (actorFlag === "host") ? "host" : actor.name;
      CastleFalkenstein.notif.error("Multiple " + handType + " hands found for " + name);
      return null;
    }
    
    if (search.length == 1)
      return search[0];

    return null;
  }

  static searchUniqueDiary(actor) {

    if (!actor || actor.isToken)
      return;

    const actorFlag = actor.id;

    const search = game.journal.filter(je => je.getFlag(this.id, "type") === "diary" && je.getFlag(this.id, "actor") === actorFlag);

    if (search.length > 1) {
      CastleFalkenstein.notif.error("Multiple " + handType + " hands found for " + actor.name);
      return;
    }
    
    if (search.length == 1)
      return search[0];

    return;
  }

  static async onRenderPlayerList(application, html, data) {
    this.checkOwnershipsOnDecks();
  }

  static async onRenderPlayerList(application, html, data) {
    this.checkOwnershipsOnDecks();
  }

  static async checkOwnershipsOnDecks() {
    if (game.user.isGM) {
      game.users.contents.forEach((user) => {
        if (user.active && !user.isGM) {
          let stacks = "";
          [this.fortuneDeck, this.sorceryDeck].forEach((deck) => {
            if (deck && !deck.testUserPermission(user, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)) {
              stacks += `<br/>- ${deck.name}`;
            }
          });
          if (stacks) {
            CastleFalkenstein.notif.warn(game.i18n.format("castle-falkenstein.notifications.playerHasInsufficientOwnershipOnCardStacks", {
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

    if (nbCardsActuallyDrawn > 0) {
      cardsDrawn = cardsDrawn.concat(await destStack.draw(deck, nbCardsActuallyDrawn, { how: CONST.CARD_DRAW_MODES.RANDOM, chatNotification: false }));
    }

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

  static async createHand(handType, actorFlag) {
    let handData = null;

    let actor;
    if (actorFlag != "host") {
      actor = game.actors.get(actorFlag);
      if (!actor)
        return;
      if (!actor.hasPlayerOwner)
        actorFlag = "host";
    }

    if (actorFlag == "host" && handType == "fortune") {
      // create host hand
      handData = {
        type: "hand",
        name: game.i18n.format(`castle-falkenstein.fortune.hand.name`, { character: game.i18n.localize("castle-falkenstein.host") }),
        displayCount: true,
        folder: null, // the GM may freely move the hand to whatever folder they wish afterwards
        "flags.castle-falkenstein": { type: handType, actor: "host" }
      };
    } else {
      // create character fortune or sorcery hand
      handData = {
        type: "hand",
        name: actor.computeHandName(handType),
        displayCount: true,
        ownership: actor.ownership, // hands inherit the ownership from the actor they belong to
        folder: (await CastleFalkenstein.cardsFolder("character-hands", game.i18n.localize("castle-falkenstein.cardsDirectory.characterHandsFolder"))).id,
        "flags.castle-falkenstein": { type: handType, actor: actor.id }
      };
    }

    if (handData) {
      const hand = await Cards.create(handData);

      if (hand) {
        CastleFalkenstein.notif.info(game.i18n.localize("castle-falkenstein.notifications.created") + "<br/>  - " + hand.name);
      }

      return hand;
    }
  }

  static async createDiary(actorFlag) {

    const actor = game.actors.get(actorFlag);
    if (!actor)
      return;
 
    // create diary
    const diaryData = {
      name: actor.computeDiaryName(),
      ownership: actor.ownership, // diary inherit the ownership from the actor they belong to
      folder: (await CastleFalkenstein.diariesFolder(game.i18n.localize("castle-falkenstein.journalDirectory.characterDiariesFolder"))).id,
      "flags.castle-falkenstein": { type: "diary", actor: actor.id }
    };

    if (diaryData) {
      const diary = await JournalEntry.create(diaryData);

      if (!diary) {
        CastleFalkenstein.log.error(`Could not generate diary for character '${actor.name}' (${actor.id})`);
        return;
      }

      if (actor.system.diary) {

        if (actor.system.diary != "") {
          const pageData = {
            name: "---",
            type: "text",
            text: {
              content: actor.system.diary,
              format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML
            },
            sort: CONST.SORT_INTEGER_DENSITY,
            flags: {
              ["castle-falkenstein"]: {
                "copiedFromLegacyDiary": true
              }
            }
          };
          await JournalEntryPage.create(pageData, {parent: diary});
        }

        // whoever is creating the diary associated to this actor has ownership on the ACtor, otherwise they would not be able to click the button that opens it.
        await actor.update({
          ["system.diary"]: null
        });
      }
      
      CastleFalkenstein.notif.info(game.i18n.localize("castle-falkenstein.notifications.created") + "<br/>  - " + diary.name);

      CastleFalkenstein.log.info("createDiary():");
      CastleFalkenstein.log.info(diary);
      return diary;
    }
  }

  static usingRTGCardVisuals(deck) {
    return deck?.img == "systems/castle-falkenstein/src/cards/back-square.png";
  }

  static computeCardHeight(deck) {
    const cardWidth = CastleFalkenstein.settings.cardWidth;

    if (deck?.img == "systems/castle-falkenstein/src/cards/back-square.png") {
      return cardWidth * 670 / 470;
    }
    else if (deck && deck.width > 0 && deck.height > 0) {
      return cardWidth * deck.height / deck.width;
    }
    else {
      return cardWidth * 3 / 2;
    }
  }

  static smallCardImg(card, classes) {
    const suit = card.suit;
    const value = card.suit == "joker" ? (card.name == game.i18n.localize("castle-falkenstein.cards.blackJoker") ? "black" : "red") : card.value;
    return `<img class="${classes}" src="systems/castle-falkenstein/src/cards/small/${suit}-${value}.svg" alt="${card.name}"></img>`;
  }

  static cardSuitHTML(suit) {
    const suitSymbol = CASTLE_FALKENSTEIN.cardSuitsSymbols[suit];
    return `[<span class="suit-symbol-${suit}">${suitSymbol}</span>]`;
  }

  static abilityLevelAsSentenceHtml(abilityItem, includeAbilitySuit = true) {
    const levelI18nKey = game.i18n.localize(CASTLE_FALKENSTEIN.abilityLevels[abilityItem.system.level].full);
    const levelValue = CASTLE_FALKENSTEIN.abilityLevels[abilityItem.system.level].value;

    const level = `${game.i18n.localize(levelI18nKey)} [${levelValue}]`;
    let ability = `<b>${abilityItem.system.displayName}</b>`;
    if (includeAbilitySuit)
      ability += ' ' + CastleFalkenstein.cardSuitHTML(abilityItem.system.suit);

    const html = game.i18n.format("castle-falkenstein.ability.levelAsSentence", {
      level: level,
      ability: ability
    });

    return html;
  }

  static createChatMessage(actor, flavor, content) {

    const messageData = {
      flavor: flavor,
      content: content,
      "flags.castle-falkenstein": { type: flavor }
    };

    if (actor != "gm") {
      messageData.speaker = ChatMessage.getSpeaker({ actor: actor });
      messageData.borderColor = game.user.color.css;
    }

    if (game.release.generation >= 12) {
      messageData.type = messageData.speaker ? CONST.CHAT_MESSAGE_STYLES.IC : CONST.CHAT_MESSAGE_STYLES.OOC;
    } else {
      messageData.type = messageData.speaker ? CONST.CHAT_MESSAGE_TYPES.IC : CONST.CHAT_MESSAGE_TYPES.OOC;
    }

    return ChatMessage.create(messageData);
  }

  static onInit() {
    game.CastleFalkenstein = CastleFalkenstein;

    // Add custom constants for configuration.
    CONFIG.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;

    // Define custom Document classes
    CONFIG.Actor.documentClass = CastleFalkensteinActor;
    CONFIG.Item.documentClass = CastleFalkensteinItem;
    CONFIG.Combatant.documentClass = CastleFalkensteinCombatant;
    CONFIG.Combat.documentClass = CastleFalkensteinCombat;
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

    // Declare Castle Falkenstein deck presets
    CONFIG.Cards.presets.castleFalkensteinFortuneDeck = {
      type: "deck",
      label: "castle-falkenstein.settings.fortuneDeck.name",
      src: "systems/castle-falkenstein/src/cards/deck-preset-fortune.json"
    };
    CONFIG.Cards.presets.castleFalkensteinSorceryDeck = {
      type: "deck",
      label: "castle-falkenstein.settings.sorceryDeck.name",
      src: "systems/castle-falkenstein/src/cards/deck-preset-sorcery.json"
    };

    this.registerSettings();

    this.registerSheets();
  }

  static async onSetup() {

    // Unregister default sheets
    if (CONFIG["Actor"]?.sheetClasses?.base)
      Actors.unregisterSheet("core", ActorSheet, {
        types: ["base"]
      });
    Actors.unregisterSheet("core", ActorSheet, {
      types: ["character"]
    });
    if (CONFIG["Item"]?.sheetClasses?.base)
      Items.unregisterSheet("core", ItemSheet, {
        types: ["base"]
      });
    Items.unregisterSheet("core", ItemSheet, {
      types: ["ability", "possession", "weapon", "spell"]
    });
    CardStacks.unregisterSheet("core", CardsConfig, {
      types: ["deck"]
    });
    // Default sheet still required for Duels for instance.
    //
    //CardStacks.unregisterSheet("core", CardsHand, {
    //  types: ["hand"]
    //});

    if (game.settings.get("core", "language") != "en") {
      game.babele?.setSystemTranslationsDir("lang/babele");
    }

    await this.preLoadTemplates();

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

    // game.user is not defined early enough to be able to set this in CastleFalkensteinActorDataModel.defineSchema
    if (game.release.generation >= 11) {
      CONFIG.Actor.dataModels.character.schema.fields.hostNotes.textSearch = game.user.isGM;
    }
  
    CONFIG.Cards.sheetClasses.hand["core.CardsHand"].canBeDefault = false;

    await this.prepareCardStacks();

    const userLanguage = game.settings.get("core", "language");
    if (userLanguage != "en" && Array.from(game.system.languages.map(el => el.lang)).includes(userLanguage)) {
      const babele = game.modules.get('babele');
      if (!babele) {
        CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.babeleInstallRequired"));
      } else if (!babele.active) {
        CastleFalkenstein.notif.warn(game.i18n.localize("castle-falkenstein.notifications.babeleActivationRequired"));
      }
    }

    await this.iconUpgrade();

    CastleFalkenstein.log.debug("Debug mode active.");
    CastleFalkenstein.log.info("Ready.");
  }

  static async iconUpgrade() {
    // upgrade weapons image
    game.settings.register(this.id, "iconUpgradeDone", {
      scope: 'world',
      config: false,
      type: Boolean,
      default: false
    });
    if (game.user.isGM && !this.settings.iconUpgradeDone) {

      const itemUpdates = (items) => {
        return items.filter(i => i.type == "weapon" && i.img=="icons/svg/item-bag.svg").map(item => {
          return {_id: item.id, img: "systems/castle-falkenstein/src/img/saber-and-pistol.png"};
        }).concat(items.filter(i => (i.type == "ability" || i.type == "spell") && i.img=="icons/svg/item-bag.svg").map(item => {
          return {_id: item.id, img: `systems/castle-falkenstein/src/cards/${item.system.suit}.svg`};
        }));
      };

      // Items in the Items tab
      {
        const itemsToUpdate = itemUpdates(game.items);
        if (itemsToUpdate.length > 0) {
          await Item.updateDocuments(itemsToUpdate);
        }
      }

      // Embedded items in each Actor
      game.actors.forEach(actor => {
        const actoritemsToUpdate = itemUpdates(actor.items);
        if (actoritemsToUpdate.length > 0) {
          actor.updateEmbeddedDocuments("Item", actoritemsToUpdate);
        }
      });

      {
        const macrosToUpdate = game.macros.filter(m => m.img=="icons/svg/item-bag.svg" && m.command?.startsWith('game.CastleFalkenstein.rollItemMacro("weapon",')).map(macro => {
          return {_id: macro.id, img: "systems/castle-falkenstein/src/img/saber-and-pistol.png"};
        });
        // no update for spell and ability macros, because no info on which suit they depend on.
        if (macrosToUpdate.length > 0) {
          Macro.updateDocuments(macrosToUpdate);
        }
      }

      this.settings.iconUpgradeDone = true;
    }
  }

  static async returnBackToDeck(stackId, idsOfCardsPlayed) {
    const stack = game.cards.get(stackId);

    for (let id of idsOfCardsPlayed) {
      const card = stack.cards.find(c => c.id == id);
      card.recall();
    }
  }

  static setupSocket() {
    this.socket = socketlib.registerSystem(this.id);

    // register socket functions
    this.socket.register("showActor", this.showActor);
    this.socket.register("createHand", this.createHand);
    this.socket.register("createDiary", this.createDiary);
    this.socket.register("returnBackToDeck", this.returnBackToDeck)
  }

  static DAMAGE_SYSTEM_OPTIONS = {
    both: "both",
    wounds: "wounds",
    harmRank: "harmRank"
  };
  
  static DIVORCE_VARIATION_OPTIONS = {
    disabled: "disabled",
    halfValue: "halfValue",
    fullValue: "fullValue"
  };

  static HARD_LIMIT_VARIATION_OPTIONS = {
    disabled: {
      str: "disabled",
      maxCards: {
        PR:  4,
        AV:  4,
        GD:  4,
        GR:  4,
        EXC: 4,
        EXT: 4
      }
    },
    option1: {
      str: "option1",
      maxCards: {
        PR:  1,
        AV:  1,
        GD:  2,
        GR:  2,
        EXC: 3,
        EXT: 4
      }
    },
    option2: {
      str: "option2",
      maxCards: {
        PR:  1,
        AV:  2,
        GD:  2,
        GR:  3,
        EXC: 4,
        EXT: 4
      }
    }
  };

  static HALF_OFF_VARIATION_OPTIONS = {
    disabled: "disabled",
    option1: "option1",
    option2: "option2"
  };

  static THAUMIXOLOGY_VARIATION_OPTIONS = {
    disabled: "disabled",
    enabled: "enabled"
  };

  static registerSettings() {

    const deckSelect = (deckType) => {

      const setting = {
        scope: "world",
        default: null,
        requiresReload: true
      };
  
      const choicesLambda = () => ({
        ...Object.fromEntries(
          game?.cards?.filter(stack => stack.type == "deck" && stack.getFlag(CastleFalkenstein.id,"type") != (deckType == "fortune" ? "sorcery" : "fortune"))
                      .map(stack => [stack.id, stack.name])
        )
      });
  
      if (game.release.generation >= 12) {
        setting.type = new foundry.data.fields.DocumentIdField({
          choices: choicesLambda
        });
      } else {
        setting.type = String;
        setting.choices = choicesLambda;
      }
  
      return setting;
    };
  

    const settingsDefinitions = {

      // Host settings
      fortuneDeck: deckSelect("fortune"),
      sorceryDeck: deckSelect("sorcery"),
      sorceryAbility: {
        scope: "world",
        type: String,
        default: "",
        requiresReload: true
      },
      perceptionAbility: {
        scope: "world",
        type: String,
        default: "",
        requiresReload: true
      },
      damageSystem: {
        scope: "world",
        choices: {
          [this.DAMAGE_SYSTEM_OPTIONS.both]: "castle-falkenstein.settings.damageSystem.both",
          [this.DAMAGE_SYSTEM_OPTIONS.wounds]: "castle-falkenstein.settings.damageSystem.wounds",
          [this.DAMAGE_SYSTEM_OPTIONS.harmRank]: "castle-falkenstein.settings.damageSystem.harmRank"
        },
        default: this.DAMAGE_SYSTEM_OPTIONS.both,
        requiresReload: true
      },
      divorceVariation: {
        scope: "world",
        choices: {
          [this.DIVORCE_VARIATION_OPTIONS.disabled]: "castle-falkenstein.settings.divorceVariation.disabled",
          [this.DIVORCE_VARIATION_OPTIONS.halfValue]: "castle-falkenstein.settings.divorceVariation.halfValue",
          [this.DIVORCE_VARIATION_OPTIONS.fullValue]: "castle-falkenstein.settings.divorceVariation.fullValue"
        },
        default: this.DIVORCE_VARIATION_OPTIONS.disabled,
        requiresReload: false,
        onChange: value => {
          for (const window of Object.values(ui.windows)) {
            if (window instanceof CastleFalkensteinHandSheet) {
              if (window.rendered) window.render();
            }
          }
        }
      },
      hardLimitVariation: {
        scope: "world",
        choices: {
          [this.HARD_LIMIT_VARIATION_OPTIONS.disabled.str]: "castle-falkenstein.settings.hardLimitVariation.disabled",
          [this.HARD_LIMIT_VARIATION_OPTIONS.option1.str]: "castle-falkenstein.settings.hardLimitVariation.option1",
          [this.HARD_LIMIT_VARIATION_OPTIONS.option2.str]: "castle-falkenstein.settings.hardLimitVariation.option2"
        },
        default: this.HARD_LIMIT_VARIATION_OPTIONS.disabled.str,
        requiresReload: false,
        onChange: value => {
          for (const window of Object.values(ui.windows)) {
            if (window instanceof CastleFalkensteinHandSheet) {
              if (window.rendered) window.render();
            }
          }
        }
      },
      halfOffVariation: {
        scope: "world",
        choices: {
          [this.HALF_OFF_VARIATION_OPTIONS.disabled]: "castle-falkenstein.settings.halfOffVariation.disabled",
          [this.HALF_OFF_VARIATION_OPTIONS.option1]: "castle-falkenstein.settings.halfOffVariation.option1",
          [this.HALF_OFF_VARIATION_OPTIONS.option2]: "castle-falkenstein.settings.halfOffVariation.option2"
        },
        default: this.HALF_OFF_VARIATION_OPTIONS.disabled,
        requiresReload: false,
        onChange: value => {
          for (const window of Object.values(ui.windows)) {
            if (window instanceof CastleFalkensteinHandSheet) {
              if (window.rendered) window.render();
            }
          }
        }
      },
      thaumixologyVariation: {
        scope: "world",
        choices: {
          [this.THAUMIXOLOGY_VARIATION_OPTIONS.disabled]: "castle-falkenstein.settings.thaumixologyVariation.disabled",
          [this.THAUMIXOLOGY_VARIATION_OPTIONS.enabled]: "castle-falkenstein.settings.thaumixologyVariation.enabled"
        },
        config: true,
        default: this.THAUMIXOLOGY_VARIATION_OPTIONS.disabled,
        requiresReload: false,
        onChange: value => {
          for (const window of Object.values(ui.windows)) {
            if (window instanceof CastleFalkensteinDefineSpell) {
              if (window.rendered) window.render();
            }
          }
        }
      },
      // Player settings
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
          game.cards.filter(stack => stack.type == "hand" && stack.sheet?.rendered).forEach(stack => stack.sheet.render());
        }
      }
    };

    Object.entries(settingsDefinitions).forEach(([key, def]) => {
      game.settings.register(this.id, key, {
        ...def,
        config: typeof(def.config) == "undefined" ? true : def.config,
        name: `castle-falkenstein.settings.${key}.name`,
        hint: `castle-falkenstein.settings.${key}.hint`
      });
    });
    
  }

  static registerSheets() {

    Actors.registerSheet(this.id, CastleFalkensteinActorSheet, {
      label: "castle-falkenstein.sheets.character",
      makeDefault: true
    });

    Items.registerSheet(this.id, CastleFalkensteinAbilitySheet, {
      types: ["ability"],
      label: "castle-falkenstein.sheets.ability",
      makeDefault: true
    });
    Items.registerSheet(this.id, CastleFalkensteinPossessionSheet, {
      types: ["possession"],
      label: "castle-falkenstein.sheets.possession",
      makeDefault: true
    });
    Items.registerSheet(this.id, CastleFalkensteinWeaponSheet, {
      types: ["weapon"],
      label: "castle-falkenstein.sheets.weapon",
      makeDefault: true
    });
    Items.registerSheet(this.id, CastleFalkensteinSpellSheet, {
      types: ["spell"],
      label: "castle-falkenstein.sheets.spell",
      makeDefault: true
    });
    
    CardStacks.registerSheet(this.id, CastleFalkensteinDeckSheet, {
      types: ["deck"],
      label: "castle-falkenstein.sheets.deck",
      makeDefault: true
    });
    
    CardStacks.registerSheet(this.id, CastleFalkensteinHandSheet, {
      types: ["hand"],
      label: "castle-falkenstein.sheets.hand",
      makeDefault: true
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
    // make the 'success ranges' section expand/collapse on click
    html.find(".feat-chat-ranges-button")?.click(event => {
      let button = event.currentTarget;
      var content = button.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });

    // make the overall message have the same color as its author
    html[0].style.borderColor = messageData.author?.color.css;
  }

  static async addMacroAtHotbarSlot(name, img, command, slot) {
    const macro = await Macro.create({
      name: name,
      type: CONST.MACRO_TYPES.SCRIPT,
      img: img,
      command: command
    });
    game.user.assignHotbarMacro(macro, slot);
  }

  static onHotbarDrop(hotbar, data, slot) {
    if (!data.uuid) return true;
    const doc = fromUuidSync(data.uuid);
    if (!doc)
      return;

    if (doc instanceof CastleFalkensteinItem && doc.parent instanceof CastleFalkensteinActor) {
      const macroName = `${doc.rollType.i18nLabel} ${doc.name} ${game.user.isGM ? "(" + doc.parent.name + ")" : ""}`;
      CastleFalkenstein.addMacroAtHotbarSlot(macroName, doc.img, `fromUuidSync("${doc.uuid}").roll();`, slot);
      return false;
    } else {
      const macroName = `${doc.name}`;
      if (!doc.img) {
        if (doc instanceof JournalEntry) {
          if (doc.getFlag("castle-falkenstein", "type") == "diary")
            doc.img = 'systems/castle-falkenstein/src/img/secret-book-white.svg';
          else
            doc.img = 'icons/svg/book.svg';
        }
      }
      CastleFalkenstein.addMacroAtHotbarSlot(macroName, doc.img, `await Hotbar.toggleDocumentSheet("${doc.uuid}");`, slot);
      return false;
    }

    //return true;
  }

  // kept so pre-v3.8.0 actor item macros continue to work
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

  static openDocument(documentUuid) {
    fromUuidSync(documentUuid)
  }

  static onRenderSidebarTab(app, html, data) {
    if (app.tabName !== "chat")
      return;

    const diceIcon = html.find("#chat-controls .chat-control-icon i");
    if (diceIcon) {
      diceIcon[0].classList = "cf-poker-hand";
    }

    // hijack of "Roll Mode" into something which makes more sense for a card-based system like Castle Falkenstein

    const optgroup = html.find("#chat-controls .roll-type-select optgroup");
    if (optgroup)
      optgroup[0].label = game.i18n.localize("castle-falkenstein.chat.messageVisibility");

    const optionReplacements = {
      [CONST.DICE_ROLL_MODES.PUBLIC]: game.i18n.localize("castle-falkenstein.chat.publicMessage"),
      [CONST.DICE_ROLL_MODES.PRIVATE]: game.i18n.localize("castle-falkenstein.chat.privateHostMessage"),
      [CONST.DICE_ROLL_MODES.BLIND]: null, // Remove this option
      [CONST.DICE_ROLL_MODES.SELF]: null   // Remove this option
    };

    // Select the <select> element
    const select = document.querySelector('#chat-controls .roll-type-select');

    // Loop through options in the optgroup (in reverse order because we're removing some options)
    for (let i = select.options.length - 1; i >= 0; --i) {
      const option = select.options[i];

      // Check if the option should be renamed or removed
      if (optionReplacements[option.value] !== undefined) {
        if (optionReplacements[option.value] === null) {
            // Remove the option
            select.remove(i);
        } else {
            // Rename the option
            option.text = optionReplacements[option.value];
        }
      }
    }
  }

  static onPreCreateChatMessage(message, options, userId) {
    // Alter the visibility of both system-generated and manually-created messages.
    //
    // See onRenderSidebarTab(): only 2 modes are allowed: PUBLIC and PRIVATE. BLIND and SELF have been disabled.
    //
    const messageVisibility = game.settings.get("core", "rollMode");
    if (messageVisibility == CONST.DICE_ROLL_MODES.PRIVATE && (!message.whisper || message.whisper.length == 0)) {
      message.updateSource({
        whisper: ChatMessage.getWhisperRecipients("GM").map(u => u.id),
        speaker: null
      });
    }
    
  }

  static refreshActorSheetIfDiary(sheet) {
    // if a Diary, refresh the matching (not Token) Actor's sheet if open
    const journalEntry = sheet.object;
    if (!journalEntry.getFlag("castle-falkenstein", "type") == "diary")
      return;
    const actorId = journalEntry.getFlag("castle-falkenstein", "actor");
    game.actors.get(actorId)?.sheet.render(false);
  }

  static onRenderJournalSheet(sheet, html, data) {
    CastleFalkenstein.refreshActorSheetIfDiary(sheet);
  }

  static onCloseJournalSheet(sheet, html) {
    CastleFalkenstein.refreshActorSheetIfDiary(sheet);
  }
}

/* -------------------------------------------- */
/*  Declare Hooks                               */
/* -------------------------------------------- */

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(CastleFalkenstein.id);
});

Hooks.on("init", () => CastleFalkenstein.onInit());
Hooks.on("setup", () => CastleFalkenstein.onSetup());
Hooks.on("ready", () => CastleFalkenstein.onReady());

Hooks.on("renderChatMessage", (chatMessage, html, messageData) => CastleFalkenstein.onRenderChatMessage(chatMessage, html, messageData));

Hooks.on("hotbarDrop", (hotbar, data, slot) => { return CastleFalkenstein.onHotbarDrop(hotbar, data, slot) });

Hooks.on("renderPlayerList", (application, html, data) => CastleFalkenstein.onRenderPlayerList(application, html, data));

Hooks.on("PopOut:popout", (app, popout) => { return CastleFalkensteinHandSheet.onPopout(app, popout) });

Hooks.once("socketlib.ready", () => CastleFalkenstein.setupSocket());

Hooks.on("renderCombatTracker", (app, html, options) => game.combat?.onRenderCombatTracker(app, html, options));

Hooks.on("renderSidebarTab", (app, html, data) => CastleFalkenstein.onRenderSidebarTab(app, html, data));

Hooks.on("preCreateChatMessage", (message, options, userId) => CastleFalkenstein.onPreCreateChatMessage(message, options, userId));

Hooks.on("passCards", (from, to, options) => CastleFalkensteinCards.onPassCards(from, to, options));

Hooks.on("renderCastleFalkensteinActorSheet", (app, html, data) => CastleFalkensteinActorSheet.onRender(app, html, data));

Hooks.on("renderJournalSheet", (sheet, html, data) => CastleFalkenstein.onRenderJournalSheet(sheet, html, data));

Hooks.on("closeJournalSheet", (sheet, html) =>  CastleFalkenstein.onCloseJournalSheet(sheet, html));

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
