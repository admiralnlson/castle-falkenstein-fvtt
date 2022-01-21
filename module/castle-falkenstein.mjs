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
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { CASTLE_FALKENSTEIN } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.CastleFalkenstein = {
    CastleFalkensteinActor,
    CastleFalkensteinItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.CASTLE_FALKENSTEIN = CASTLE_FALKENSTEIN;

  // Define custom Document classes
  CONFIG.Actor.documentClass = CastleFalkensteinActor;
  CONFIG.Item.documentClass = CastleFalkensteinItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("castle-falkenstein", CastleFalkensteinActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("castle-falkenstein", CastleFalkensteinAbilitySheet, { types: ["ability"], makeDefault: true });
  Items.registerSheet("castle-falkenstein", CastleFalkensteinPossessionSheet, { types: ["possession"], makeDefault: true });
  Items.registerSheet("castle-falkenstein", CastleFalkensteinSpellSheet, { types: ["spell"], makeDefault: true });
  Items.registerSheet("castle-falkenstein", CastleFalkensteinWeaponSheet, { types: ["weapon"], makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
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
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}