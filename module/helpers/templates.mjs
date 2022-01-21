/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/castle-falkenstein/templates/parts/actor-abilities.hbs",
    "systems/castle-falkenstein/templates/parts/actor-possessions.hbs",
    "systems/castle-falkenstein/templates/parts/actor-spells.hbs",
    "systems/castle-falkenstein/templates/parts/actor-weapons.hbs",
  ]);
};
