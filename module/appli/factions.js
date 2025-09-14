import { CEL1922 } from "../config.js";

/**
 * Une application pour gérer les factions
 * @extends ApplicationV2
 * @mixes HandlebarsApplication
 **/



/*
export class GMManager extends Application {
*/
export class CEL1922Factions extends Application {
  static CEL1922_FACTIONS = "celestopol1922-factions";
  static CEL1922_FACTIONS_TEMPLATE = "systems/celestopol1922/templates/appli/factions.html";

  constructor() {
    super({ id: CEL1922Factions.CEL1922_FACTIONS });  
    Hooks.on("updateSetting", async (setting, update, options, id) => this.updateManager(setting, update, options, id));
    // Hooks.on("updateActor", async (setting, update, options, id) => this.updateManager(setting, update, options, id));
    // Hooks.on("renderPlayerList", async (setting, update, options, id) => this.updateManager(setting, update, options, id));
    Hooks.once("ready", () => this.onReady());
  }


  async updateManager(setting, update, options, id) {
    // game.celestopol1922.celestopol1922Factions.render(false);
    CEL1922.celestopol1922Factions.render(false);
  }



  onReady() {
    if (game.user.isGM) {
      CEL1922.celestopol1922Factions.render(true);
    }
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: CEL1922Factions.CEL1922_FACTIONS_TEMPLATE,
      classes: ["celestopol1922", "celestopol1922-factions"],
      title: game.i18n.localize("CEL1922.FACTIONS.Title"),
      top: 5,
      left: 35,
      width: 450,
      height: "auto",
      resizable: false,
    });
    
  };

/*
export default class CEL1922Factions extends HandlebarsApplicationMixin(ApplicationV2) {






    
  /** @inheritDoc */
  /*
  static DEFAULT_OPTIONS = {
    id: "cell1922-factions",
    tag: "form",
    window: {
      contentClasses: ["celestopol1922-factions-content"],
      title: "CEL1922.Factions.title",
      controls: [],
    },
    position: {
      width: 585,
      top: 80,
      left: 150,
    },
    form: {
      closeOnSubmit: true,
    },
    actions: {
      cercle: CEL1922Factions.#onClicCercle,
    },
  }
  */

  /** @inheritDoc */
  /*
  _initializeApplicationOptions(options) {
    const applicationOptions = super._initializeApplicationOptions(options)
    // applicationOptions.window.resizable = game.settings.get("celestopol1922", "taille") !== "demo"
    return applicationOptions
  }
*/

  /** @override */
  /*
  static PARTS = {
    main: {
      template: "systems/celestopol1922/templates/appli/factions.html",
    },
  }
  */ 


  /** @override */
  async _prepareContext(_options = {}) {
    /*
    const styleJeu = await game.settings.get("penombre", "styleJeu")
    */

    return {
      userId: game.user.id,
      isGM: game.user.isGM,
      /*
      jetons: await game.settings.get(SYSTEM.ID, "reserveCollegiale").jetons,

      isStyleJeuStandard: styleJeu === "standard",
      isStyleJeuAvance: styleJeu === "avance",
      */
    }

  }

  /**
   * Handle clicking on Document's elements.
   * @param {Event} event The click event triggered by the user.
   * @param {HTMLElement} target The HTML element that was clicked, containing dataset information.
   * @returns {Promise<void>}
   **/
  static async #onClicCercle(event, target) {
    /*
    event.preventDefault()
    const dataset = target.dataset
    const index = dataset.index // Commence à 1

    // Le MJ peut modifier les settings
    if (game.user.isGM) {
      const reserveCollegiale = foundry.utils.duplicate(game.settings.get(SYSTEM.ID, "reserveCollegiale"))
      reserveCollegiale.jetons[index].valeur = !reserveCollegiale.jetons[index].valeur
      await game.settings.set(SYSTEM.ID, "reserveCollegiale", reserveCollegiale)
    }
    // C'est un joueur : utilisation de la requête
    else {
      await game.users.activeGM.query("penombre.updateReserveCollegiale", { index })
    }

    this.render({ force: true })
    */
  }

  /**
   * Updates the "reserveCollegiale" setting by setting a specified number of jetons' "valeur" property from true to false.
   *
   * @async
   * @param {Object} params  The parameters object.
   * @param {number} params.index The index of the jeton to update.
   * @returns {Promise<void>} Resolves when the reserveCollegiale setting has been updated.
   */
  /*
  static _handleQueryUpdateReserveCollegiale = async ({ index }) => {
    const reserveCollegiale = foundry.utils.duplicate(game.settings.get(SYSTEM.ID, "reserveCollegiale"))
    reserveCollegiale.jetons[index].valeur = !reserveCollegiale.jetons[index].valeur
    await game.settings.set(SYSTEM.ID, "reserveCollegiale", reserveCollegiale)
  }
  */

  /**
   * Updates the "reserveCollegiale" setting by setting a specified number of jetons' "valeur" property from true to false.
   *
   * @async
   * @param {Object} params  The parameters object.
   * @param {number} params.nbJetons The number of jetons to update from true to false.
   * @returns {Promise<void>} Resolves when the reserveCollegiale setting has been updated.
   */

  /*
  static _handleQueryUpdateReserveCollegialeFromRoll = async ({ nbJetons }) => {
    const reserveCollegiale = foundry.utils.duplicate(game.settings.get(SYSTEM.ID, "reserveCollegiale"))

    // Parcours de l'objet pour mettre à jour nbJetons
    let nbJetonsModifies = 0
    for (const [index, jeton] of Object.entries(reserveCollegiale.jetons)) {
      if (jeton.valeur === true && nbJetonsModifies < nbJetons) {
        reserveCollegiale.jetons[index].valeur = false
        nbJetonsModifies++
      }
    }

    await game.settings.set(SYSTEM.ID, "reserveCollegiale", reserveCollegiale)
  }
  */
}
