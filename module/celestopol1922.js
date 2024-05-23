import { CEL1922Actor } from "./actor/actor.js";
import { CEL1922Item } from "./item/item.js";

import { CEL1922CharacterSheet } from "./actor/character-sheet.js";
import { CEL1922PNJSheet } from "./actor/npc-sheet.js";
import { CEL1922ItemSheet } from "./item/item-sheet.js";
import { CEL1922AnomalySheet } from "./item/anomaly-sheet.js";
import { CEL1922AspectSheet } from "./item/aspect-sheet.js";
import { CEL1922AttributeSheet } from "./item/attribute-sheet.js";

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



  // Game Settings
  function delayedReload() {window.setTimeout(() => location.reload(), 500)}

  game.settings.register("celestopol1922", "autoWoundsNPC", {
    name: game.i18n.localize("CEL1922.Tenir automatiquement le décompte des blessures"),
    hint: game.i18n.localize("CEL1922.Cocher cette option auto"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: delayedReload
  });

  game.settings.register("celestopol1922", "usePromptsForAutomatization", {
    name: game.i18n.localize("CEL1922.AutoPrompt"),
    hint: game.i18n.localize("CEL1922.TakeCareIfAutoPromptUnchecked"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: delayedReload
  });
  
  game.settings.register("celestopol1922", "playersEditItems", {
    name: game.i18n.localize("CEL1922.Autoriser les joueuses à modifer les items"),
    hint: game.i18n.localize("CEL1922.Cocher cette option autorisera les joueuses"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: delayedReload
  });


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

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("celestopol1922", CEL1922ItemSheet, { types: ["item"], makeDefault: true });
  Items.registerSheet("celestopol1922", CEL1922AnomalySheet, { types: ["anomaly"], makeDefault: true });
  Items.registerSheet("celestopol1922", CEL1922AspectSheet, { types: ["aspect"], makeDefault: true });
  Items.registerSheet("celestopol1922", CEL1922AttributeSheet, { types: ["attribute"], makeDefault: true });

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


/* -------------------------------------------- */
/*  Chat Message Hooks                          */
/* -------------------------------------------- */

// Hooks for Green Buttons in Chat
Hooks.on("renderChatMessage", (app, html, data) => {

  let rerollButton = html[0].querySelector("[class='smart-green-button reroll-click']");
  let moonrollButton = html[0].querySelector("[class='smart-green-button moon-click']");
  let woundscalculateButton = html[0].querySelector("[class='smart-green-button wounds-calculate-click']");
  let woundsapplytoNPCButton = html[0].querySelector("[class='smart-green-button wounds-apply-to-NPC-click']");
  let woundsapplytoPCButton = html[0].querySelector("[class='smart-green-button wounds-apply-to-PC-click']");


  if (woundsapplytoPCButton != undefined && woundsapplytoPCButton != null) {
    woundsapplytoPCButton.addEventListener('click', () => {

    // La joueuse applique depuis le Tchat les blessures infiligées à son PJ par le PNJ

    // On vérifie que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans woundsapplytoPCButton')


    })
  }

  if (woundsapplytoNPCButton != undefined && woundsapplytoNPCButton != null) {
    woundsapplytoNPCButton.addEventListener('click', () => {

    // Le MJ applique depuis le Tchat les blessures infligées à son PNJ par le PJ

    // On vérifie que c'est bien le MJ, sinon on ne fait rien

    console.log('Je suis dans woundsapplytoNPCButton')


    })
  }
  
  if (woundscalculateButton != undefined && woundscalculateButton != null) {
    woundscalculateButton.addEventListener('click', () => {

    // La joueuse effectue depuis le Tchat le calcul des blessures infligées

    // On vérifie que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans woundscalculateButton')


    })
  }

  if (moonrollButton != undefined && moonrollButton != null) {
    moonrollButton.addEventListener('click', () => {

    // La joueuse lance un dé de Lune depuis le Tchat

    // On vérifie que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans moonrollButton')


    })
  }


  if (rerollButton != undefined && rerollButton != null) {
    rerollButton.addEventListener('click', () => {

    // La joueuse relance les dés depuis le Tchat

    // On vérifie que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans rerollButton')


    })
  }
})

/*
  let chatButton = html[0].querySelector("[data-roll='roll-again']")

  if (chatButton != undefined && chatButton != null) {
      chatButton.addEventListener('click', () => {
          let ruleTag = ''

          if (html[0].querySelector("[data-roll='dice-result']").textContent == 10) {ruleTag = game.i18n.localize("CONX.Rule of Ten Re-Roll")}
          if (html[0].querySelector("[data-roll='dice-result']").textContent == 1)  {ruleTag = game.i18n.localize("CONX.Rule of One Re-Roll")}

          let roll = new Roll('1d10')
          roll.roll({async: false})

          // Grab and Set Values from Previous Roll
          let attributeLabel = html[0].querySelector('h2').outerHTML
          let diceTotal = Number(html[0].querySelector("[data-roll='dice-total']").textContent)
          let rollMod = Number(html[0].querySelector("[data-roll='modifier']").textContent)
          let ruleOfMod = ruleTag === game.i18n.localize("CONX.Rule of Ten Re-Roll") ? Number(roll.result) > 5 ? Number(roll.result) - 5 : 0 : Number(roll.result) > 5 ? 0 : Number(roll.result) - 5
          let ruleOfDiv = ''

          if (roll.result == 10) {
              ruleOfDiv = `<h2 class="rule-of-chat-text">`+game.i18n.localize(`CONX.Rule of 10!`)`</h2>
                          <button type="button" data-roll="roll-again" class="rule-of-ten">`+game.i18n.localize(`CONX.Roll Again`)`</button>`
              ruleOfMod = 5
          }
          if (roll.result == 1) {
              ruleOfDiv = `<h2 class="rule-of-chat-text">`+game.i18n.localize(`CONX.Rule of 1!`)`</h2>
                          <button type="button" data-roll="roll-again" class="rule-of-one">`+game.i18n.localize(`CONX.Roll Again`)`</button>`
              ruleOfMod = -5
          }

          // Create Chat Content
          let tags = [`<div>${ruleTag}</div>`]
          let chatContent = `<form>
                                  ${attributeLabel}

                                  <table class="conspiracyx-chat-roll-table">
                                      <thead>
                                          <tr>
                                              <th>`+game.i18n.localize(`CONX.Roll`)+`</th>
                                              <th>`+game.i18n.localize(`CONX.Modifier`)+`</th>
                                              <th>+</th>
                                              <th>`+game.i18n.localize(`CONX.Result`)+`</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <td data-roll="dice-result">[[${roll.result}]]</td>
                                              <td data-roll="modifier">${rollMod}</td>
                                              <td>+</td>
                                              <td data-roll="dice-total">${diceTotal + ruleOfMod}</td>
                                          </tr>
                                      </tbody>
                                  </table>

                                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                                      ${ruleOfDiv}
                                  </div>
                              </form>`

          ChatMessage.create({
              type: CONST.CHAT_MESSAGE_TYPES.ROLL,
              user: game.user.id,
              speaker: ChatMessage.getSpeaker(),
              flavor: `<div class="conspiracyx-tags-flex-container">${tags.join('')}</div>`,
              content: chatContent,
              roll: roll
          })
      })
  }

*/
