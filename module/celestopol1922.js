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
import { registerHandlebarsHelpers } from "./helpers.js";


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
  registerHandlebarsHelpers();

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

Hooks.on("renderChatMessage", (app, html, data,) => {

  const rerollButton = html[0].querySelector("[class='smart-green-button reroll-click']");
  const moonrollButton = html[0].querySelector("[class='smart-green-button moon-click']");
  const woundscalculateButton = html[0].querySelector("[class='smart-green-button wounds-calculate-click']");
  const woundsapplytoNPCButton = html[0].querySelector("[class='smart-green-button wounds-apply-to-NPC-click']");
  const woundsapplytoPCButton = html[0].querySelector("[class='smart-green-button wounds-apply-to-PC-click']");

  
  if (woundsapplytoPCButton != undefined && woundsapplytoPCButton != null) {
    woundsapplytoPCButton.addEventListener('click', () => {

    // La joueuse applique depuis le Tchat les blessures infiligées à son PJ par le PNJ
    // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans woundsapplytoPCButton')

    const typeofthrow = html[0].querySelector("div[class='typeofthrow']").textContent;

    const youwin = html[0].querySelector("div[class='youwin']").textContent;
    const yourplayerid = html[0].querySelector("div[class='yourplayerid']").textContent;
    const youractorid = html[0].querySelector("div[class='youractorid']").textContent;
    const yourdamage = html[0].querySelector("div[class='yourdamage']").textContent;
    const yourprotection = html[0].querySelector("div[class='yourprotection']").textContent;
    const youropponent = html[0].querySelector("div[class='youropponent']").textContent;
    const youropponentid = html[0].querySelector("div[class='youropponentid']").textContent;
    const youropponentdamage = html[0].querySelector("div[class='youropponentdamage']").textContent;
    const youropponentprotection = html[0].querySelector("div[class='youropponentprotection']").textContent;

    const myUser = game.user;
    console.log("game.user.id = ", game.user.id);
    console.log("yourplayerid = ", yourplayerid);
    if (!(game.user.id == yourplayerid)) {console.log("TADAM !") ;return;}; // Pas le bon utilisateur !

    const myActor = game.actors.get(youractorid);

    let wounds = 0;
    if (myActor != null) {
      wounds = 1 + parseInt(youropponentdamage) - parseInt(yourprotection);
      if (wounds < 0) {
        wounds = 0;
      };
      _updateActorSheetWoundsJauge (myActor, wounds);

      let typeOfThrow = parseInt(typeofthrow);
;
      let smartTemplate = 'systems/celestopol1922/templates/form/dice-result-apply-wounds.html'

      let smartData = {};

      _showCalculateWoundsInChat (myActor, typeOfThrow, smartTemplate, smartData);
    };
  
    })
  }


  if (woundsapplytoNPCButton != undefined && woundsapplytoNPCButton != null) {
    woundsapplytoNPCButton.addEventListener('click', () => {

    // Le MJ applique depuis le Tchat les blessures infligées à son PNJ par le PJ
    // On vérifie d'abord que c'est bien le MJ, sinon on ne fait rien

    console.log('Je suis dans woundsapplytoNPCButton')

    const typeofthrow = html[0].querySelector("div[class='typeofthrow']").textContent;

    const youwin = html[0].querySelector("div[class='youwin']").textContent;
    const yourdamage = html[0].querySelector("div[class='yourdamage']").textContent;
    const yourprotection = html[0].querySelector("div[class='yourprotection']").textContent;
    const youropponent = html[0].querySelector("div[class='youropponent']").textContent;
    const youropponentid = html[0].querySelector("div[class='youropponentid']").textContent;
    const youropponentdamage = html[0].querySelector("div[class='youropponentdamage']").textContent;
    const youropponentprotection = html[0].querySelector("div[class='youropponentprotection']").textContent;

    if (!(game.user.isGM)) {console.log("TADAM !") ;return}; // Pas le bon utilisateur !


  const myActor = game.actors.get(youropponentid);

  let wounds = 0;
  if (myActor != null) {
    wounds = 1 + parseInt(yourdamage) - parseInt(youropponentprotection);
    if (wounds < 0) {
      wounds = 0;
    };
    _updateActorSheetWoundsJauge (myActor, wounds);

    let typeOfThrow = 3; // juste pour le MJ utilisateur

    let smartTemplate = 'systems/celestopol1922/templates/form/dice-result-apply-wounds.html'

    let smartData = {};

    _showCalculateWoundsInChat (myActor, typeOfThrow, smartTemplate, smartData);

  };

  })
  }
  

  if (woundscalculateButton != undefined && woundscalculateButton != null) {
    woundscalculateButton.addEventListener('click', () => {

    // La joueuse effectue depuis le Tchat le calcul des blessures infligées
    // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans woundscalculateButton')

    const typeofthrow = html[0].querySelector("div[class='typeofthrow']").textContent;

    const numberofdice = html[0].querySelector("div[class='numberofdice']").textContent;
    const skill = html[0].querySelector("div[class='skill']").textContent;
    const bonus = html[0].querySelector("div[class='bonus']").textContent;
    const rolldifficulty = html[0].querySelector("div[class='rolldifficulty']").textContent;

    const youwin = html[0].querySelector("div[class='youwin']").textContent;
    const yourplayerid = html[0].querySelector("div[class='yourplayerid']").textContent;
    const youractorid = html[0].querySelector("div[class='youractorid']").textContent;
    const yourdamage = html[0].querySelector("div[class='yourdamage']").textContent;
    const yourprotection = html[0].querySelector("div[class='yourprotection']").textContent;
    const youropponent = html[0].querySelector("div[class='youropponent']").textContent;
    const youropponentid = html[0].querySelector("div[class='youropponentid']").textContent;
    const youropponentdamage = html[0].querySelector("div[class='youropponentdamage']").textContent;
    const youropponentprotection = html[0].querySelector("div[class='youropponentprotection']").textContent;

    let NPCwoundedtotal = 1+parseInt(yourdamage)-parseInt(youropponentprotection);
    if (NPCwoundedtotal < 0) {NPCwoundedtotal = 0};
    let PCwoundedtotal = 1+parseInt(youropponentdamage)-parseInt(yourprotection);
    if (PCwoundedtotal < 0) {PCwoundedtotal = 0};
    let autoWoundsNPC = game.settings.get("celestopol1922", "autoWoundsNPC");

    console.log("autoWoundsNPC = ", autoWoundsNPC);

    const myUser = game.user;
    console.log("game.user.id = ", game.user.id);
    console.log("yourplayerid = ", yourplayerid);
    if (!(game.user.id == yourplayerid)) {console.log("TADAM !") ;return;}; // Pas le bon utilisateur !

    const myActor = game.actors.get(youractorid);
    if (myActor == null) {console.log("TADAM !") ;return;};

    const myTypeOfThrow = parseInt(typeofthrow);

    // Smart Message
    const smartTemplate = 'systems/celestopol1922/templates/form/dice-result-wounds.html';
    const smartData = 
    {
      typeofthrow: myTypeOfThrow,

      youwin: (youwin == 'true'),
      yourplayerid: yourplayerid,
      youractorid: youractorid,
      yourdamage: yourdamage,
      yourprotection: yourprotection,
      youropponent: youropponent,
      youropponentid: youropponentid,
      youropponentdamage: youropponentdamage,
      youropponentprotection: youropponentprotection,

      NPCwoundedtotal: NPCwoundedtotal,
      PCwoundedtotal: PCwoundedtotal,
      autoWoundsNPC: autoWoundsNPC
    };

    // console.log("smartData = ", smartData);

    _showCalculateWoundsInChat (myActor, myTypeOfThrow, smartTemplate, smartData);

  })
  }


  if (moonrollButton != undefined && moonrollButton != null) {
    moonrollButton.addEventListener('click', async () => {

    // La joueuse lance un dé de Lune depuis le Tchat
    // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans moonrollButton')

    const typeofthrow = html[0].querySelector("div[class='typeofthrow']").textContent;

    const yourplayerid = html[0].querySelector("div[class='yourplayerid']").textContent;
    const youractorid = html[0].querySelector("div[class='youractorid']").textContent;

    const myUser = game.user;
    console.log("game.user.id = ", game.user.id);
    console.log("yourplayerid = ", yourplayerid);

    if (!(game.user.id == yourplayerid)) {console.log("TADAM ! Pas le bon utilisateur !") ;return;}; // Pas le bon utilisateur !


    console.log("youractorid = ", youractorid);
    const myActor = game.actors.get(youractorid);
    if (myActor == null) {console.log("TADAM ! Pas le bon acteur !") ;return;};


    const myTypeOfThrow = parseInt(typeofthrow);
    
    let rMoon = new Roll('1d8');
    await rMoon.roll();


    const theResult = rMoon.result;
    console.log("rMoon.result = ", rMoon.result);

    const mySmartMoonTemplate = 'systems/celestopol1922/templates/form/dice-result-moon.html';
    const mySmartMoonData =
    {
      moonname: game.i18n.localize(myActor.system.skill.moondicetypes[theResult - 1]),
      theresult: parseInt(theResult)
    };
  
    const titleSmartRMoon = "Joli message à venir";
    const mySmartRMoonTemplate = 'systems/celestopol1922/templates/form/dice-result-just-title-moon.html';
    const mySmartRMoonData = {
      title: titleSmartRMoon
      //
    }

    await _showMessagesInChat (myActor, myTypeOfThrow, rMoon, mySmartRMoonTemplate, mySmartRMoonData, mySmartMoonTemplate, mySmartMoonData, 1);
  


    // concerne le tirage de la Lune sur la Table de la Lune
    const myResolvedUUIDMoonRollTableCompend = await parseUuid("Compendium.celestopol1922.tables.RollTable.lAwtswfdDSflSBTk", {});
    // const myResolvedUUIDMoonRollTableChanceCompend = await parseUuid("Compendium.celestopol1922.tables.RollTable.7evwGjQ0GWgb8pBc", {});
    console.log("myResolvedUUIDMoonRollTableCompend = ", myResolvedUUIDMoonRollTableCompend);
    console.log("game = ", game);
    
    const moonRollCompendiumName = "celestopol1922.tables";
    // C'est le nom du compendium à récupérer
  
    const moonRollCompendium = await game.packs.get(moonRollCompendiumName);
    // On récupère le compendium
    console.log("moonRollCompendium = ", moonRollCompendium);
  
  
    const moonRollTable = await moonRollCompendium.getDocument(myResolvedUUIDMoonRollTableCompend.id);
    // On récupère ce doc précis du compendium
    // console.log("myMoonRollTable = ", myMoonRollTable);
  
    // const myMoonRollTableCompend = await game.collections.fromCompendium(myMoonRollTable, { addFlags: false, clearSort: false, clearOwnership: false, keepId: true });
    // Comme on veut récupérer le doc du compendium pour le mettre dans le Monde (avec le même Id), on le prépare
    // si on passait par importFromCompendium(), on n'aurait pas la main sur les paramètres
  
    // context.moonRollTable = await new RollTable(myMoonRollTableCompend, {});
    // On crée une nouvelle table dans le Monde à partir du doc récupéré du compendium
  
  
    // const moonRollTableChance = await moonRollCompendium.getDocument(myResolvedUUIDMoonRollTableChanceCompend.id);
  
    // const myMoonRollTableChanceCompend = await game.collections["RollTable"].fromCompendium(myMoonRollTableChance, { addFlags: false, clearSort: false, clearOwnership: false, keepId: true });
  
    // context.moonRollTableChance = await new RollTable(myMoonRollTableChanceCompend, {});
  
  


    let rollModeTable = "";

    switch ( myTypeOfThrow ) {
      case 0: rollModeTable = 'roll';                     // Public Roll
      break;
      case 1: rollModeTable = 'gmroll'                    // Private Roll
      break;
      case 2: rollModeTable = 'blindroll'                 // Blind GM Roll
      break;
      case 3: rollModeTable = 'selfroll'                  // Self Roll
      break;
      default: console.log("C'est bizarre !");
    };

    const rMoonTotalOnTable = rMoon._total.toString();

    const myRollOnTable = new Roll(rMoonTotalOnTable, myActor.getRollData());
                                                          // Force le tirage de la table à la valeur tirée précédemment au d8
                                                          // Tirage de Lune normal
    const customResults = await moonRollTable.roll({myRollOnTable});
                                                          // Fait le tirage sur la table
    const drawTable = moonRollTable.draw({roll: myRollOnTable, recursive: false, results: customResults, displayChat: true, rollMode : rollModeTable});
                                                          // Affiche le résultat du tirage dans le Tchat


  })
  }


  if (rerollButton != undefined && rerollButton != null) {
    rerollButton.addEventListener('click', () => {

    // La joueuse relance les dés depuis le Tchat
    // On vérifie d'abord que c'est la bonne joueuse, sinon on ne fait rien

    console.log('Je suis dans rerollButton')

    const typeofthrow = html[0].querySelector("div[class='typeofthrow']").textContent;

    const numberofdice = html[0].querySelector("div[class='numberofdice']").textContent;
    const skill = html[0].querySelector("div[class='skill']").textContent;
    const bonus = html[0].querySelector("div[class='bonus']").textContent;
    const rolldifficulty = html[0].querySelector("div[class='rolldifficulty']").textContent;

    const youwin = html[0].querySelector("div[class='youwin']").textContent;
    const yourplayerid = html[0].querySelector("div[class='yourplayerid']").textContent;
    const youractorid = html[0].querySelector("div[class='youractorid']").textContent;
    const yourdamage = html[0].querySelector("div[class='yourdamage']").textContent;
    const yourprotection = html[0].querySelector("div[class='yourprotection']").textContent;
    const youropponent = html[0].querySelector("div[class='youropponent']").textContent;
    const youropponentid = html[0].querySelector("div[class='youropponentid']").textContent;
    const youropponentdamage = html[0].querySelector("div[class='youropponentdamage']").textContent;
    const youropponentprotection = html[0].querySelector("div[class='youropponentprotection']").textContent;
    
    const dataNbrDice = html[0].querySelector("td[class='dataNbrDice']").textContent;
    const titleDomain = html[0].querySelector("th[class='titleDomain']").textContent;
    const dataDomain = html[0].querySelector("td[class='dataDomain']").textContent;
    const titleSpeciality = html[0].querySelector("th[class='titleSpeciality']").textContent;
    const dataSpeciality = html[0].querySelector("td[class='dataSpeciality']").textContent;
    const titleAnomaly = html[0].querySelector("th[class='titleAnomaly']").textContent;
    const dataAnomaly = html[0].querySelector("td[class='dataAnomaly']").textContent;
    const titleAspect = html[0].querySelector("th[class='titleAspect']").textContent;
    const dataAspect = html[0].querySelector("td[class='dataAspect']").textContent;
    const titleAttribute = html[0].querySelector("th[class='titleAttribute']").textContent;
    const dataAttribute = html[0].querySelector("td[class='dataAttribute']").textContent;
    const dataBonus = html[0].querySelector("td[class='dataBonus']").textContent;
    const dataMalus = html[0].querySelector("td[class='dataMalus']").textContent;
    const dataMoreBonusMalus = html[0].querySelector("td[class='dataMoreBonusMalus']").textContent;
    const titleArmor = html[0].querySelector("th[class='titleArmor']").textContent;
    const dataArmor = html[0].querySelector("td[class='dataArmor']").textContent;
    const titleWounds = html[0].querySelector("th[class='titleWounds']").textContent;
    const dataWounds = html[0].querySelector("td[class='dataWounds']").textContent;
    const titleDestiny = html[0].querySelector("th[class='titleDestiny']").textContent;
    const dataDestiny = html[0].querySelector("td[class='dataDestiny']").textContent;
    const titleSpleen = html[0].querySelector("th[class='titleSpleen']").textContent;
    const dataSpleen = html[0].querySelector("td[class='dataSpleen']").textContent;

    const myUser = game.user;
    console.log("game.user.id = ", game.user.id);
    console.log("yourplayerid = ", yourplayerid);
    if (!(game.user.id == yourplayerid)) {console.log("TADAM ! Pas le bon utilisateur !") ;return;}; // Pas le bon utilisateur !


    /*
    mySmartRData = {
      typeofthrow: myData.myTypeOfThrow,
      numberofdice: myData.myNumberOfDice,
      skill: myData.mySkill,
      bonus: myData.totalBoni,
      rolldifficulty: parseInt(myOpposition),

      youwin: youWin,
      egality: thereisEgality,

      yourplayerid: myData.myUserID,
      youractorid: myData.myActorID,
      yourdamage: myData.myWeaponVal,
      yourprotection: myData.myArmorVal,

      youropponent: myData.opponentName,
      youropponentid: myData.opponentID,
      youropponentdamage: myData.weaponOpponentVal,
      youropponentprotection: myData.armorOpponentVal,

      mymodifier: myModifier, 
      title: titleSmartR,
      dataNbrDice: myData.myNumberOfDice,
      titleDomain: "",
      dataDomain: "",
      titleSpeciality: "",
      dataSpeciality: "",
      titleAnomaly: "",
      dataAnomaly: NaN,
      titleAspect: "",
      dataAspect: NaN,
      titleAttribute: "",
      dataAttribute: NaN,
      dataBonus: myData.myBonus,
      dataMalus: myData.myMalus,
      titleMoreBonusMalus: "Bonus/Malus supplémentaire (re-tirage)",
      dataMoreBonusMalus: 0,
      titleArmor: "",
      dataArmor: NaN,
      titleWounds: "",
      dataWounds: NaN,
      titleDestiny: "",
      dataDestiny: NaN,
      titleSpleen: "",
      dataSpleen: NaN,
      numSpeciality: myData.mySkill
    }
    */








  })
  }


})


/* -------------------------------------------- */

async function _showCalculateWoundsInChat (myActor, myTypeOfThrow, smartTemplate, smartData) {
  
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  switch ( myTypeOfThrow ) {
    case 0:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'roll'                          // Public Roll
      });

    break;
    case 1:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'gmroll'                        // Private Roll
      });

    break;
    case 2:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'blindroll'                       // Blind GM Roll
      });

    break;
    case 3:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'selfroll'                        // Self Roll
      });

    break;
    default: console.log("C'est bizarre !");
  };
}

/* -------------------------------------------- */

async function _showMessagesInChat (myActor, myTypeOfThrow, r, mySmartRTemplate, mySmartRData, mySmartTemplate, mySmartData, myMoon) {

  let msg = "";

  const typeOfThrow = myTypeOfThrow;

  switch ( typeOfThrow ) {
    case 0: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'roll'                      // Public Roll
      });
    break;
    case 1: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'gmroll'                    // Private Roll
      });
    break;
    case 2: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'blindroll'                 // Blind GM Roll
    });
    break;
    case 3: msg = await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: myActor }),
      rollMode: 'selfroll'                      // Self Roll
    });
    break;
    default: console.log("C'est bizarre !");


    if (game.modules.get("dice-so-nice")?.active) {
      await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
    };

  }

  // Smart Message
  const smartTemplate = mySmartTemplate;
  const smartData = mySmartData;
  const smartHtml = await renderTemplate(smartTemplate, smartData);

  switch ( typeOfThrow ) {
    case 0:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'roll'                          // Public Roll
      });

    break;
    case 1:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'gmroll'                        // Private Roll
      });

    break;
    case 2:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'blindroll'                       // Blind GM Roll
      });

    break;
    case 3:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: myActor }),
        content: smartHtml,
        rollMode: 'selfroll'                        // Self Roll
      });

    break;
    default: console.log("C'est bizarre !");
  };

  if (!myMoon) {
    // SmartR Message
    const smartRTemplate = mySmartRTemplate;
    const smartRData = mySmartRData;
    const smartRHtml = await renderTemplate(smartRTemplate, smartRData);
  
    switch ( typeOfThrow ) {
      case 0:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: myActor }),
          content: smartRHtml,
          rollMode: 'roll'                          // Public Roll
        });

      break;
      case 1:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: myActor }),
          content: smartRHtml,
          rollMode: 'gmroll'                        // Private Roll
        });

      break;
      case 2:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: myActor }),
          content: smartRHtml,
          rollMode: 'blindroll'                       // Blind GM Roll
        })

      break;
      case 3:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: myActor }),
          content: smartRHtml,
          rollMode: 'selfroll'                        // Self Roll
        });

      break;
      default: console.log("C'est bizarre !");
    };

  }

}

/* -------------------------------------------- */

async function _updateActorSheetWoundsJauge (myActor, wounds) {

  const oldLevelBlessures = await myActor.system.blessures.lvl;

  console.log("oldLevelBlessures = ", oldLevelBlessures);

  let newLevelBlessures = oldLevelBlessures + wounds;

  if (newLevelBlessures > 8) {
    newLevelBlessures = 8;
  };

  console.log("newLevelBlessures = ", newLevelBlessures);

  if (oldLevelBlessures < 1 && newLevelBlessures >= 1) {
    myActor.update({ "system.blessures.blessure_1.check": true });
  };
  if (oldLevelBlessures < 2 && newLevelBlessures >= 2) {
    myActor.update({ "system.blessures.blessure_2.check": true });
  };
  if (oldLevelBlessures < 3 && newLevelBlessures >= 3) {
    myActor.update({ "system.blessures.blessure_3.check": true });
  };
  if (oldLevelBlessures < 4 && newLevelBlessures >= 4) {
    myActor.update({ "system.blessures.blessure_4.check": true });
  };
  if (oldLevelBlessures < 5 && newLevelBlessures >= 5) {
    myActor.update({ "system.blessures.blessure_5.check": true });
  };
  if (oldLevelBlessures < 6 && newLevelBlessures >= 6) {
    myActor.update({ "system.blessures.blessure_6.check": true });
  };
  if (oldLevelBlessures < 7 && newLevelBlessures >= 7) {
    myActor.update({ "system.blessures.blessure_7.check": true });
  };
  if (oldLevelBlessures < 8 && newLevelBlessures >= 8) {
    myActor.update({ "system.blessures.blessure_8.check": true });
  };


  myActor.update({ "system.blessures.lvl": newLevelBlessures });

}