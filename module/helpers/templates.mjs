/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/castle-falkenstein/templates/actor/parts/actor-abilities.hbs",
    "systems/castle-falkenstein/templates/actor/parts/actor-spells.hbs",
    "systems/castle-falkenstein/templates/actor/parts/actor-items.hbs",
    "systems/castle-falkenstein/templates/actor/parts/actor-effects.hbs",
  ]);
};
