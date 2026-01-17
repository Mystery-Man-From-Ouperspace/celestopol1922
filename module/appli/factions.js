// const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api
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
    Hooks.on("updateSetting", async (setting, update, options, id) => CEL1922.celestopol1922Factions.render(false))
    // Hooks.on("updateActor", async (setting, update, options, id) => this.document.updateManager(setting, update, options, id));
    // Hooks.on("renderPlayerList", async (setting, update, options, id) => this.document.updateManager(setting, update, options, id));
    Hooks.once("ready", () => this.onReady());
  }


  async updateManager(setting, update, options, id) {
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
      left: 140,
      width: 360,
      height: "auto",
      resizable: false,
    });
    
  };

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

  /* -------------------------------------------- */
    html.find(".jauge-check").click(this._onClickJaugeCheck.bind(this));
    /*
    html.find(".libel-update").update(this._onUpdateLibel.bind(this));
    */
  }

  /** inheritdoc */
  async getData() {
    const context = {}

    /*
    Initialise les Factions avec les valeurs des settings
    */
    context.userId = game.user.id,
    context.isGM = game.user.isGM,

      context.dispo = await game.settings.get("celestopol1922", "dispo")


    context.pinkerton = await game.settings.get("celestopol1922", "pinkerton")
        context.pinkertondispo = await game.settings.get("celestopol1922", "pinkertondispo")

    context.police = await game.settings.get("celestopol1922", "police")
        context.policedispo = await game.settings.get("celestopol1922", "policedispo")

    context.okhrana = await game.settings.get("celestopol1922", "okhrana")
        context.okhranadispo = await game.settings.get("celestopol1922", "okhranadispo")

    context.lunanovatek = await game.settings.get("celestopol1922", "lunanovatek")
        context.lunanovatekdispo = await game.settings.get("celestopol1922", "lunanovatekdispo")

    context.oto = await game.settings.get("celestopol1922", "oto")
        context.otodispo = await game.settings.get("celestopol1922", "otodispo")

    context.syndicats = await game.settings.get("celestopol1922", "syndicats")
        context.syndicatsdispo = await game.settings.get("celestopol1922", "syndicatsdispo")

    context.vorovskoymir = await game.settings.get("celestopol1922", "vorovskoymir")
        context.vorovskoymirdispo = await game.settings.get("celestopol1922", "vorovskoymirdispo")

    context.cour = await game.settings.get("celestopol1922", "cour")
        context.courdispo = await game.settings.get("celestopol1922", "courdispo")

    context.perso = await game.settings.get("celestopol1922", "perso")
    context.libel = await game.settings.get("celestopol1922", "libel")
        context.persodispo = await game.settings.get("celestopol1922", "persodispo")

    context.perso2 = await game.settings.get("celestopol1922", "perso2")
    context.libel2 = await game.settings.get("celestopol1922", "libel2")
        context.perso2dispo = await game.settings.get("celestopol1922", "perso2dispo")

    
    return context
  }

  /* -------------------------------------------- */
/*
  async _onUpdateLibel(event) {
    const element = event.currentTarget;                        // On récupère la mise à jour
 
  }
*/

  /**
   * Listen for clicks on Jauge.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickJaugeCheck(event) {

    console.log("J'entre dans _onClickJaugeCheck()");

    const element = event.currentTarget;                        // On récupère le clic
    const whatIsIt = element.dataset.libelId;                   // Va récupérer 'blessure-1' par exemple
    // console.log("whatIsIt = ", whatIsIt);
    const whatIsItTab = whatIsIt.split('-');
    const jaugeType = whatIsItTab[0];                           // Va récupérer 'blessure'
    // .log("jaugeType = ", jaugeType);
    const jaugeNumber = whatIsItTab[1];                         // Va récupérer '1'
    // console.log("jaugeNumber = ", jaugeNumber);
    let whichCheckBox ="";
    let myActor = this.actor;
    switch (jaugeType) {
      case "pinkerton":
      case "police":
      case "okhrana":
      case "lunanovatek":
      case "oto":
      case "syndicats":
      case "vorovskoymir":
      case "cour":
      case "perso":
      case "perso2":
        switch (jaugeNumber) {
            case "m4": whichCheckBox = "-4";
            break;
            case "m3": whichCheckBox = "-3";
            break;
            case "m2": whichCheckBox = "-2";
            break;
            case "m1": whichCheckBox = "-1";
            break;
            case "0": whichCheckBox = "0";
            break;
            case "p1": whichCheckBox = "1";
            break;
            case "p2": whichCheckBox = "2";
            break;
            case "p3": whichCheckBox = "3";
            break;
            case "p4": whichCheckBox = "4";
            break;
            default:
            console.log("C'est bizarre mp !");
        }
      break;
      default:
        console.log("C'est bizarre faction !");
    }

    console.log("jaugeNumber = ", jaugeNumber)
    console.log("whichCheckBox = ", whichCheckBox)

      // Le MJ peut modifier les settings
      let oldFaction
      if (game.user.isGM) {
        oldFaction = await game.settings.get("celestopol1922", jaugeType)
        await game.settings.set("celestopol1922", jaugeType, parseInt(whichCheckBox))

        console.log("oldFaction = ", oldFaction)
        // console.log("jaugeNumber = ", jaugeNumber)
        console.log("whichCheckBox = ", whichCheckBox)
        console.log("jaugeType = ", jaugeType)

      }
      // C'est un joueur : utilisation de la requête
      // Kristov ***********************************
      else {
        const token = jaugeType + "|" + whichCheckBox;
        console.log("token = ", token)
        await game.users.activeGM.query("celestopol1922.updateFactions", { token })
      }

      this.render({ force: true })

    };

  /**
   * Updates the "Factions" settings.
   *
   * @async
   * @param {Object} params  The parameters object.
   * @param {number} params.token The value to update.
   * @returns {Promise<void>} Resolves when the Factions setting has been updated.
   */
  static _handleQueryUpdateFactions = async ({ token }) => {
    console.log("Je passe par _handleQueryUpdateFactions()")
    const tokenTab = token.split('|');
    const jaugeType = tokenTab[0];
    const whichCheckBox = tokenTab[1];
    switch (jaugeType) {
        case "pinkerton":
            await game.settings.set("celestopol1922", "pinkerton", whichCheckBox)
        break
        case "police":
            await game.settings.set("celestopol1922", "police", whichCheckBox)
        break
        case "okhrana":
            await game.settings.set("celestopol1922", "okhrana", whichCheckBox)
        break
        case "lunanovatek":
            await game.settings.set("celestopol1922", "lunanovatek", whichCheckBox)
        break
        case "oto":
            await game.settings.set("celestopol1922", "oto", whichCheckBox)
        break
        case "syndicats":
            await game.settings.set("celestopol1922", "syndicats", whichCheckBox)
        break
        case "vorovskoymir":
            await game.settings.set("celestopol1922", "vorovskoymir", whichCheckBox)
        break
        case "cour":
            await game.settings.set("celestopol1922", "cour", whichCheckBox)
        break
        case "perso":
            await game.settings.set("celestopol1922", "perso", whichCheckBox)
        break
        case "perso2":
            await game.settings.set("celestopol1922", "perso2", whichCheckBox)
        break
    default:
        console.log("C'est bizarre !");
    }
  }
}
