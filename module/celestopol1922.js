import { CEL1922Actor } from "./actor/actor.js";
import { CEL1922Item } from "./item/item.js";

import { CEL1922CharacterSheet } from "./actor/character-sheet.js";
import { CEL1922PNJSheet } from "./actor/npc-sheet.js";
import { CEL1922TinJiSheet } from "./actor/tinji-sheet.js";
import { CEL1922LoksyuSheet } from "./actor/loksyu-sheet.js";
import { CEL1922ItemSheet } from "./item/item-sheet.js";
import { CEL1922AnomalySheet } from "./item/anomaly-sheet.js";
import { CEL1922AspectSheet } from "./item/aspect-sheet.js";

import { CEL1922 } from "./config.js";
import { preloadHandlebarsTemplates } from "./templates.js";
// import { registerHandlebarsHelpers } from "./helpers.js";


/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function () {
  console.log(`CELESTOPOL1922 System | Initializing`);


   /**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
  /*
	CONFIG.Combat.initiative = {
        formula: "@initiative",
        decimals: 0
      };
*/

  game.system.CONST = CEL1922;

  // Define custom Document classes
  CONFIG.Actor.documentClass = CEL1922Actor;
  CONFIG.Item.documentClass = CEL1922Item;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("celestopol1922", CEL1922CharacterSheet, { types: ["character"], makeDefault: true }); // ligne modifiée selon directives de LeRatierBretonnien
  Actors.registerSheet("celestopol1922", CEL1922PNJSheet, { types: ["npc"], makeDefault: true });
  Actors.registerSheet("celestopol1922", CEL1922TinJiSheet, { types: ["tinji"], makeDefault: true });
  Actors.registerSheet("celestopol1922", CEL1922LoksyuSheet, { types: ["loksyu"], makeDefault: true });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("celestopol1922", CEL1922ItemSheet, { types: ["item"], makeDefault: true });
  Items.registerSheet("celestopol1922", CEL1922AnomalySheet, { types: ["anomaly"], makeDefault: true });
  Items.registerSheet("celestopol1922", CEL1922AspectSheet, { types: ["aspect"], makeDefault: true });

  // Preload template partials
  await preloadHandlebarsTemplates();

  // Register Handlebars Helpers
  // registerHandlebarsHelpers();

  // Modify Runtime configuration settings / Added by MMFO
  await modifyConfigurationSettings();

  console.log(`CELESTOPOL1922 System | Initialized`);
});

async function modifyConfigurationSettings() {
  /**
   * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
   * aspects of the software behaves.
   *
   * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
   * session or modified by system and module developers to adjust how the application behaves.
   *
   **/

  /**
   * Configuration for the Actor document
   */
  CONFIG.Actor.compendiumBanner = "/systems/celestopol1922/images/banners/actor-banner.webp";

  /**
   * Configuration for the Adventure document
   */
  CONFIG.Adventure.compendiumBanner = "/systems/celestopol1922/images/banners/adventure-banner.webp";

  /**
   * Configuration for the Cards primary Document type
   */
  CONFIG.Cards.compendiumBanner = "ui/banners/cards-banner.webp";

  /**
   * Configuration for Item document
   */
  CONFIG.Item.compendiumBanner = "/systems/celestopol1922/images/banners/item-banner.webp";

  /**
   * Configuration for the JournalEntry document
   */
  CONFIG.JournalEntry.compendiumBanner = "/systems/celestopol1922/images/banners/journalentry-banner.webp";

  /**
   * Configuration for the Macro document
   */
  CONFIG.Macro.compendiumBanner = "ui/banners/macro-banner.webp";

  /**
   * Configuration for the Playlist document
   */
  CONFIG.Playlist.compendiumBanner = "ui/banners/playlist-banner.webp";

  /**
   * Configuration for RollTable random draws
   */
  CONFIG.RollTable.compendiumBanner = "ui/banners/rolltable-banner.webp";

  /**
   * Configuration for the Scene document
   */
  CONFIG.Scene.compendiumBanner = "/systems/celestopol1922/images/banners/scene-banner.webp";
}

Hooks.once("i18nInit", function () {
  // Prélocalisation des objets de configuration
  preLocalizeConfig();
});

function preLocalizeConfig() {
  const localizeConfigObject = (obj, keys) => {
    for (let o of Object.values(obj)) {
      for (let k of keys) {
        o[k] = game.i18n.localize(o[k]);
      }
    }
  };

  localizeConfigObject(CEL1922.SUBTYPES, ["label"]);
}