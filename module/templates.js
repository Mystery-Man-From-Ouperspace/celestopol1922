/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    "systems/celestopol1922/templates/actor/parts/character-skills.html",
    "systems/celestopol1922/templates/actor/parts/character-items.html",
    "systems/celestopol1922/templates/actor/parts/character-anomalies.html",
    "systems/celestopol1922/templates/actor/parts/character-aspects.html",
    "systems/celestopol1922/templates/actor/parts/character-attributes.html",

    "systems/celestopol1922/templates/actor/parts/npc-skills.html",
    "systems/celestopol1922/templates/actor/parts/npc-aspects.html",
    "systems/celestopol1922/templates/actor/parts/npc-anomalies.html",
    "systems/celestopol1922/templates/actor/parts/npc-items.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};