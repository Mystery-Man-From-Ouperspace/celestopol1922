import { CEL1922ActorSheet } from "./actor-sheet.js";
import { CEL1922 } from "../config.js";
import { ModifiedDialog } from "../modified-dialog.js";
/**
 * @extends {CEL1922ActorSheet}
 */
export class CEL1922CharacterSheet extends CEL1922ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "actor", "character"],
      template: "systems/celestopol1922/templates/actor/character-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biography", ".items", ".attributes", ".aspects", ".anomalies"],
      dragDrop: [{dragSelector: ".item-list .item .attribute .aspect .anomaly", dropSelector: null}]
    });
  }


  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.equipments = context.items.filter(item => item.type === "item");
    context.attributes = context.items.filter(item => item.type === "attribute");
    context.aspects = context.items.filter(item => item.type === "aspect");
    context.anomalies = context.items.filter(item => item.type === "anomaly");

    context.playersEditItems = game.settings.get("celestopol1922", "playersEditItems");

    context.usePromptsForAutomatization = game.settings.get("celestopol1922", "usePromptsForAutomatization");

    context.autoWoundsNPC = game.settings.get("celestopol1922", "autoWoundsNPC");

    context.isGM = game.user.isGM;
    // context.isGM = false; // Pour tester la fonction

    context.CEL1922 = CEL1922;
    return context;
  }


  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".click").click(this._onClickDieRoll.bind(this));
    html.find(".moon-click").click(this._onClickMoonDieRoll.bind(this));
    html.find(".click-prefs").click(this._onClickPrefs.bind(this));
    html.find(".jauge-check").click(this._onClickJaugeCheck.bind(this));
    // html.find(".tromblon-click").click(this._onClickInitiative.bind(this));
    html.find(".check-sheet-click").click(this._onClickCheckSheet.bind(this));
  }


  /* -------------------------------------------- */

  /**
   * Listen for click on Eye. Auto-tests.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickCheckSheet (event) {

    const myActor = this.actor;

    ui.notifications.info(game.i18n.localize("CEL1922.Info1"));

    let erreurNbr = 0; // Nbr d'erreurs cumulé
    let souciNbr = 0; // Nbr de soucis cumulé

    const maxRESTotalScore = 99999; // Score maxi de la somme des RES
    const minRESTotalScore = 0; // Score mini de la somme des RES
    const maxRESScore = 4; // Score maxi d'une RES
    const minRESScore = 0; // Score minji d'une RES
    const maxSpecialTotalScore = 99999; // Score maxi de la somme des Speciality
    const minSpecialTotalScore = 0; // Score mini de la somme des Speciality
    const maxSpecialScore = 8; // Score maxi d'une Spéciality
    const minSpecialScore = 0; // Score mini d'une Speciality

    let rESTotalScore = 0; // Scores cumulés des RES
    let rESScoreTestMax = 0; // Maximum des valeurs des RES
    let rESScoreTestMin = 0; // Minimum des valeurs des RES
    let specialTotalScore = 0; // Scores cumulés des Speciality
    let specialScoreTestMax = 0; // Maximum des valeurs des Speciality
    let specialScoreTestMin = 0; // Minimum des valeurs des Speciality

    const maxAspectNbr = 4; // Nbr maxi d'Aspect
    const maxAspectTotalScore = 4; // Score maxi de la somme des Aspects
    const maxAspectScore = 4; // Score maxi d'un Aspect
    const minAspectScore = 1; // Score mini d'un Aspect

    let aspectNbr = 0; // Nbr d'Aspects cumulé
    let myAspectNbr = 0; // Nbr d'Aspects pris en compte
    let aspectTotalScore = 0; // Somme totale des Aspects
    let aspectScoreTestMax = 0; // Maximum des valeurs d'Aspect 
    let aspectScoreTestMin = 0; // Minimum des valeurs d'Aspect

    const maxAnomalyNbr = 1; // Nbr maxi d'Anomaly
    const maxAnomalyScore = 4; // Score maxi d'une Anomaly
    const minAnomalyScore = 1; // Score mini d'une Anomaly

    let anomalyNbr = 0; // Nbr d'Anomaly cumulé
    let anomalyScoreTest = 0; // Score de l'unique Anomaly prise en compte

    const menuSkill = myActor.system.skill.skilltypes;

    // Skills (RES)/Specialities
    let mySkill = {};
    let myString;
    let myValue = 0;

    function myObject(id, label, value)
    {
      this.id = id;
      this.label = label;
      this.value = value;
    };

    for (let i=0; i<20; i++) {
      switch (i) {
        case 0: myString = myActor.system.skill.ame.res;
        break;
        case 1: myString = myActor.system.skill.ame.attraction.value;
        break;
        case 2: myString = myActor.system.skill.ame.artifice.value;
        break;
        case 3: myString = myActor.system.skill.ame.coercition.value;
        break;
        case 4: myString = myActor.system.skill.ame.faveur.value;
        break;

        case 5: myString = myActor.system.skill.corps.res;
        break;
        case 6: myString = myActor.system.skill.corps.echauffouree.value;
        break;
        case 7: myString = myActor.system.skill.corps.effacement.value;
        break;
        case 8: myString = myActor.system.skill.corps.prouesse.value;
        break;
        case 9: myString = myActor.system.skill.corps.mobilite.value;
        break;

        case 10: myString = myActor.system.skill.coeur.res;
        break;
        case 11: myString = myActor.system.skill.coeur.appreciation.value;
        break;
        case 12: myString = myActor.system.skill.coeur.arts.value;
        break;
        case 13: myString = myActor.system.skill.coeur.inspiration.value;
        break;
        case 14: myString = myActor.system.skill.coeur.traque.value;
        break;

        case 15: myString = myActor.system.skill.esprit.res;
        break;
        case 16: myString = myActor.system.skill.esprit.instruction.value;
        break;
        case 17: myString = myActor.system.skill.esprit.mtechnologique.value;
        break;
        case 18: myString = myActor.system.skill.esprit.raisonnement.value;
        break;
        case 19: myString = myActor.system.skill.esprit.traitement.value;
        break;
      };
      myValue = parseInt(myString);
      if (myString == null) myValue = 0;
      mySkill[i.toString()] = new myObject(i.toString(), menuSkill[i], myValue);
    }
    console.log("mySkill : ", mySkill);
    for (let skill=0; skill<20; skill++) {
      if (skill % 5 == 0) {
        rESTotalScore += parseInt(mySkill[skill.toString()].value);
        if (parseInt(mySkill[skill.toString()].value) > rESScoreTestMax) {
          rESScoreTestMax = parseInt(mySkill[skill.toString()].value);
        };
        if (parseInt(mySkill[skill.toString()].value) < rESScoreTestMin) {
          rESScoreTestMin = parseInt(mySkill[skill.toString()].value);
        };
      } else {
        specialTotalScore += parseInt(mySkill[skill.toString()].value);
        if (parseInt(mySkill[skill.toString()].value) > specialScoreTestMax) {
          specialScoreTestMax = parseInt(mySkill[skill.toString()].value);
        };
        if (parseInt(mySkill[skill.toString()].value) < specialScoreTestMin) {
          specialScoreTestMin = parseInt(mySkill[skill.toString()].value);
        };
      };
    }

    // console.log ("rESTotalScore : ", rESTotalScore);
    // console.log ("rESScoreTestMax : ", rESScoreTestMax);
    // console.log ("specialScoreTestMax : ", specialScoreTestMax);

    // console.log ("specialTotalScore : ", specialTotalScore);
    // console.log ("specialScoreTestMax : ", specialScoreTestMax);
    // console.log ("specialScoreTestMin : ", specialScoreTestMin);


    // Aspects/Anomalies
    for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
      anomalyNbr++;
      if (anomalyNbr == 1) {
        anomalyScoreTest = parseInt(anomaly.system.value);
      };
    };
    // console.log("anomalyNbr : ", anomalyNbr);
    // console.log("anomalyScoreTest : ", anomalyScoreTest);


    for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
      if (aspectNbr < 4) {
        if (parseInt(aspect.system.value) > aspectScoreTestMax) {
          aspectScoreTestMax = parseInt(aspect.system.value);
        };
        if (parseInt(aspect.system.value) < aspectScoreTestMin) {
          aspectScoreTestMin = parseInt(aspect.system.value);
        };
        aspectTotalScore += parseInt(aspect.system.value);
        myAspectNbr++;
      };
      aspectNbr++;
    };
    console.log("aspectNbr : ", aspectNbr);
    console.log("aspectScoreTestMax : ", aspectScoreTestMax);
    console.log("aspectScoreTestMin : ", aspectScoreTestMin);
    console.log("aspectTotalScore : ", aspectTotalScore);

    if (!aspectNbr) { // Aucun Aspect
      ui.notifications.warn(game.i18n.localize("CEL1922.Souci17"));
      souciNbr++;
    }
    if (aspectNbr > maxAspectNbr) { // Nbr d'Aspect supérieur au max
      ui.notifications.warn((game.i18n.localize("CEL1922.Souci3")).replace("^1", maxAspectNbr.toString()).replace("^0", aspectNbr.toString()));
      souciNbr++;
    }
    /*
    if (aspectTotalScore < maxAspectNbr) { // Score total des Aspects inférieur au min
      ui.notifications.error((game.i18n.localize("CEL1922.Error5")).replace("^2", maxAspectNbr.toString()));
      erreurNbr++;
    }
    */
    if (aspectTotalScore > maxAspectTotalScore) { // Score Total des Aspects supérieur au max (nbre )
      ui.notifications.error((game.i18n.localize("CEL1922.Error4")).replace("^2", maxAspectNbr.toString()).replace("^1", maxAspectScore).replace("^0", aspectTotalScore.toString()));
      erreurNbr++;
    }
    if (!anomalyNbr) { // Aucune Anomaly
      ui.notifications.warn(game.i18n.localize("CEL1922.Souci18"));
      souciNbr++;
    }
    if (anomalyNbr > maxAnomalyNbr) { // Plus d'une Anomaly
      ui.notifications.warn((game.i18n.localize("CEL1922.Souci6")).replace("^0", anomalyNbr.toString()));
      souciNbr++;
    }
    if (anomalyScoreTest < minAnomalyScore) { // Un Score d'Anomaly au-dessous du min
      ui.notifications.error((game.i18n.localize("CEL1922.Error8")).replace("^1", minAnomalyScore.toString()).replace("^0", anomalyScoreTest.toString()));;
      erreurNbr++;
    }
    if (anomalyScoreTest > maxAnomalyScore) { // Un Score d'Anomaly au-dessus du max
      ui.notifications.error((game.i18n.localize("CEL1922.Error7")).replace("^1", maxAnomalyScore.toString()).replace("^0", anomalyScoreTest.toString()));
      erreurNbr++;
    }
    if (rESTotalScore < minRESTotalScore) { // Score Total des RES au-dessous du min
      ui.notifications.error((game.i18n.localize("CEL1922.Error9")).replace("^1", minRESTotalScore.toString()).replace("^0", rESTotalScore.toString()));
      erreurNbr++;
    }
    if (rESTotalScore > maxRESTotalScore) { // Score Total des RES au-dessus du max
      ui.notifications.error((game.i18n.localize("CEL1922.Error10")).replace("^1", maxRESTotalScore.toString()).replace("^0", rESTotalScore.toString()));
      erreurNbr++;
    }
    if (rESScoreTestMin < minRESScore) { // Un Score de RES au-dessous du min
      ui.notifications.error((game.i18n.localize("CEL1922.Error11")).replace("^1", minRESScore.toString()));
      erreurNbr++;
    }
    if (rESScoreTestMax > maxRESScore) { // Un Score de RES au-dessus du max
      ui.notifications.error((game.i18n.localize("CEL1922.Error12")).replace("^1", maxRESScore.toString()));
      erreurNbr++;
    }
    if (specialTotalScore < minSpecialTotalScore) { // Score Total des Speciality au-dessous du min
      ui.notifications.error((game.i18n.localize("CEL1922.Error13")).replace("^1", minSpecialTotalScore.toString()).replace("^0", specialTotalScore.toString()));
      erreurNbr++;
    }
    if (specialTotalScore > maxSpecialTotalScore) { // Score Total des Speciality au-dessus du max
      ui.notifications.error((game.i18n.localize("CEL1922.Error14")).replace("^1", maxSpecialTotalScore.toString()).replace("^0", specialTotalScore.toString()));
      erreurNbr++;
    }
    if (specialScoreTestMin < minSpecialScore) { // Un Score de Speciality au-dessous du min
      ui.notifications.error((game.i18n.localize("CEL1922.Error15")).replace("^1", minSpecialScore.toString()));
      erreurNbr++;
    }
    if (specialScoreTestMax > maxSpecialScore) { // Un Score de Speciality au-dessus du max
      ui.notifications.error((game.i18n.localize("CEL1922.Error16")).replace("^1", maxSpecialScore.toString()));
      erreurNbr++;
    }
    // Au moins un Souci
    if (souciNbr) ui.notifications.warn((game.i18n.localize("CEL1922.Souci2")).replace("^0", souciNbr.toString()));
    
    // Au moins une Erreur
    if (erreurNbr) ui.notifications.error((game.i18n.localize("CEL1922.Error1")).replace("^0", erreurNbr.toString()));

    // Ni Erreur, ni souci
    if (!(erreurNbr || souciNbr)) ui.notifications.info(game.i18n.localize("CEL1922.Info2"));

    ui.notifications.info(game.i18n.localize("CEL1922.Info3"));
  }


  /* -------------------------------------------- */

  /**
   * Listen for click on Gear.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickPrefs (event) {
    // Render modal dialog
    const myActor = this.actor;
    const template = 'systems/celestopol1922/templates/form/prefs-prompt.html';
    const title = game.i18n.localize("CEL1922.Preferences");
    let dialogOptions = "";
    let myArmor = {};

    function myObject(id, label)
    {
      this.id = id;
      this.label = label;
    };

    myArmor["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let item of myActor.items.filter(item => item.type === 'item')) {
      if (item.system.subtype == "armor") {
        myArmor[item.id.toString()] = new myObject(item.id.toString(), item.name.toString()+" ["+item.system.protection.toString()+"]");
      };
    };
    var dialogData = {
      choice: myActor.system.prefs.typeofthrow.choice,
      armorchoices: myArmor,
      armor: myActor.system.prefs.lastarmorusedid,
    };
    console.log("dialogData : ", dialogData);

    const html = await renderTemplate(template, dialogData);

    // Create the Dialog window
    let prompt = await new Promise((resolve) => {
      new Dialog(
        {
          title: title,
          content: html,
          buttons: {
            validateBtn: {
              icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Validate')}</span></div>`,
              callback: (html) => resolve(_computeResult(myActor, html))
            },
            cancelBtn: {
              icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Cancel')}</span></div>`,
              callback: (html) => resolve(null)
            }
          },
          default: 'validateBtn',
          close: () => resolve(null)
        },
        dialogOptions
      ).render(true, {
        width: 480,
        height: 203
      });
    });
    async function _computeResult(myActor, myHtml) {
      // console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      // console.log("choice = ", choice);
      await myActor.update({ "system.prefs.lastarmorusedid": myHtml.find("select[name='armor']").val() });
    }
  }


  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on Jauge.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickJaugeCheck(event) {

    // console.log("J'entre dans _onClickJaugeCheck()");

    const element = event.currentTarget;                        // On récupère le clic
    const whatIsIt = element.dataset.libelId;                   // Va récupérer 'blessure-1' par exemple
    // console.log("whatIsIt = ", whatIsIt);
    const whatIsItTab = whatIsIt.split('-');
    const jaugeType = whatIsItTab[0];                           // Va récupérer 'blessure'
    // .log("jaugeType = ", jaugeType);
    const jaugeNumber = whatIsItTab[1];                         // Va récupérer '1'
    // console.log("jaugeNumber = ", jaugeNumber);
    let whichCheckBox ="";
    let whichLevel = 0;
    let myActor = this.actor;
    switch (jaugeType) {
      case "blessure":
        switch (jaugeNumber) {
          case "1":
            whichCheckBox = myActor.system.blessures.blessure_1.check;
            break;
          case "2":
            whichCheckBox = myActor.system.blessures.blessure_2.check;
            break;
          case "3":
            whichCheckBox = myActor.system.blessures.blessure_3.check;
            break;
          case "4":
            whichCheckBox = myActor.system.blessures.blessure_4.check;
            break;
          case "5":
            whichCheckBox = myActor.system.blessures.blessure_5.check;
            break;
          case "6":
            whichCheckBox = myActor.system.blessures.blessure_6.check;
            break;
          case "7":
            whichCheckBox = myActor.system.blessures.blessure_7.check;
            break;
          case "8":
            whichCheckBox = myActor.system.blessures.blessure_8.check;
            break;
          default:
            console.log("C'est bizarre !");                                            }
        break;
      case "destin":
        switch (jaugeNumber) {
          case "1":
            whichCheckBox = myActor.system.destin.destin_1.check;
            break;
          case "2":
            whichCheckBox = myActor.system.destin.destin_2.check;
            break;
          case "3":
            whichCheckBox = myActor.system.destin.destin_3.check;
            break;
          case "4":
            whichCheckBox = myActor.system.destin.destin_4.check;
            break;
          case "5":
            whichCheckBox = myActor.system.destin.destin_5.check;
            break;
          case "6":
            whichCheckBox = myActor.system.destin.destin_6.check;
            break;
          case "7":
            whichCheckBox = myActor.system.destin.destin_7.check;
            break;
          case "8":
            whichCheckBox = myActor.system.destin.destin_8.check;
            break;
          default:
            console.log("C'est bizarre !");                                            }
        break;
      case "spleen":
        whichLevel = parseInt(await myActor.system.spleen.lvl);
        switch (jaugeNumber) {
          case "1":
            whichCheckBox = myActor.system.spleen.spleen_1.check;
            break;
          case "2":
            whichCheckBox = myActor.system.spleen.spleen_2.check;
            break;
          case "3":
            whichCheckBox = myActor.system.spleen.spleen_3.check;
            break;
          case "4":
            whichCheckBox = myActor.system.spleen.spleen_4.check;
            break;
          case "5":
            whichCheckBox = myActor.system.spleen.spleen_5.check;
            break;
          case "6":
            whichCheckBox = myActor.system.spleen.spleen_6.check;
            break;
          case "7":
            whichCheckBox = myActor.system.spleen.spleen_7.check;
            break;
          case "8":
            whichCheckBox = myActor.system.spleen.spleen_8.check;
            break;
          default:
            console.log("C'est bizarre !");                                            }
        break;
      default:
        console.log("C'est bizarre !");
      }


      switch (jaugeType) {
        case "blessure":
          let oldLevelBlessures = myActor.system.blessures.lvl;
          let newLevelBlessures = parseInt(jaugeNumber);
          if (whichCheckBox) {
            newLevelBlessures--;
          }
   
          myActor.update({ "system.blessures.lvl": newLevelBlessures });

          // console.log("oldLevelBlessures (OLD) = ", oldLevelBlessures);
          // console.log("newLevelBlessures (NEW) = ", newLevelBlessures);

          if (newLevelBlessures > oldLevelBlessures) {
            if (newLevelBlessures > 0) {
              myActor.update({ "system.blessures.blessure_1.check": true });
            }
            if (newLevelBlessures > 1) {
              myActor.update({ "system.blessures.blessure_2.check": true });
            }
            if (newLevelBlessures > 2) {
              myActor.update({ "system.blessures.blessure_3.check": true });
            }
            if (newLevelBlessures > 3) {
              myActor.update({ "system.blessures.blessure_4.check": true });
            }
            if (newLevelBlessures > 4) {
              myActor.update({ "system.blessures.blessure_5.check": true });
            }
            if (newLevelBlessures > 5) {
              myActor.update({ "system.blessures.blessure_6.check": true });
            }
            if (newLevelBlessures > 6) {
              myActor.update({ "system.blessures.blessure_7.check": true });
            }
            if (newLevelBlessures > 7) {
              myActor.update({ "system.blessures.blessure_8.check": true });
            }
          } else if (newLevelBlessures < oldLevelBlessures) {
            if (newLevelBlessures > 0) {
              myActor.update({ "system.blessures.blessure_1.check": true });
            }
            if (newLevelBlessures > 1) {
              myActor.update({ "system.blessures.blessure_2.check": true });
            }
            if (newLevelBlessures > 2) {
              myActor.update({ "system.blessures.blessure_3.check": true });
            }
            if (newLevelBlessures > 3) {
              myActor.update({ "system.blessures.blessure_4.check": true });
            }
            if (newLevelBlessures > 4) {
              myActor.update({ "system.blessures.blessure_5.check": true });
            }
            if (newLevelBlessures > 5) {
              myActor.update({ "system.blessures.blessure_6.check": true });
            }
            if (newLevelBlessures > 6) {
              myActor.update({ "system.blessures.blessure_7.check": true });
            }
            if (newLevelBlessures > 7) {
              myActor.update({ "system.blessures.blessure_8.check": true });
            }
            if (newLevelBlessures < 8) {
              myActor.update({ "system.blessures.blessure_8.check": false });
            }
            if (newLevelBlessures < 7) {
              myActor.update({ "system.blessures.blessure_7.check": false });
            }
            if (newLevelBlessures < 6) {
              myActor.update({ "system.blessures.blessure_6.check": false });
            }
            if (newLevelBlessures < 5) {
              myActor.update({ "system.blessures.blessure_5.check": false });
            }
            if (newLevelBlessures < 4) {
              myActor.update({ "system.blessures.blessure_4.check": false });
            }
            if (newLevelBlessures < 3) {
              myActor.update({ "system.blessures.blessure_3.check": false });
            }
            if (newLevelBlessures < 2) {
              myActor.update({ "system.blessures.blessure_2.check": false });
            }
            if (newLevelBlessures < 1) {
              myActor.update({ "system.blessures.blessure_1.check": false });
            };
          }
          break;
        case "destin":
          let oldLevelDestin = myActor.system.destin.lvl;
          let newLevelDestin = parseInt(jaugeNumber);
          if (whichCheckBox) {
            newLevelDestin--;
          }

          myActor.update({ "system.destin.lvl": newLevelDestin});

          // console.log("oldLevelDestin (OLD) = ", oldLevelDestin);
          // console.log("newLevelDestin (NEW) = ", newLevelDestin);

          if (newLevelDestin > oldLevelDestin) {
            if (newLevelDestin > 0) {
              myActor.update({ "system.destin.destin_1.check": true });
            }
            if (newLevelDestin > 1) {
              myActor.update({ "system.destin.destin_2.check": true });
            }
            if (newLevelDestin > 2) {
              myActor.update({ "system.destin.destin_3.check": true });
            }
            if (newLevelDestin > 3) {
              myActor.update({ "system.destin.destin_4.check": true });
            }
            if (newLevelDestin > 4) {
              myActor.update({ "system.destin.destin_5.check": true });
            }
            if (newLevelDestin > 5) {
              myActor.update({ "system.destin.destin_6.check": true });
            }
            if (newLevelDestin > 6) {
              myActor.update({ "system.destin.destin_7.check": true });
            }
            if (newLevelDestin > 7) {
              myActor.update({ "system.destin.destin_8.check": true });
            }
          } else if (newLevelDestin < oldLevelDestin) {
            if (newLevelDestin > 0) {
              myActor.update({ "system.destin.destin_1.check": true });
            }
            if (newLevelDestin > 1) {
              myActor.update({ "system.destin.destin_2.check": true });
            }
            if (newLevelDestin > 2) {
              myActor.update({ "system.destin.destin_3.check": true });
            }
            if (newLevelDestin > 3) {
              myActor.update({ "system.destin.destin_4.check": true });
            }
            if (newLevelDestin > 4) {
              myActor.update({ "system.destin.destin_5.check": true });
            }
            if (newLevelDestin > 5) {
              myActor.update({ "system.destin.destin_6.check": true });
            }
            if (newLevelDestin > 6) {
              myActor.update({ "system.destin.destin_7.check": true });
            }
            if (newLevelDestin > 7) {
              myActor.update({ "system.destin.destin_8.check": true });
            }
            if (newLevelDestin < 8) {
              myActor.update({ "system.destin.destin_8.check": false });
            }
            if (newLevelDestin < 7) {
              myActor.update({ "system.destin.destin_7.check": false });
            }
            if (newLevelDestin < 6) {
              myActor.update({ "system.destin.destin_6.check": false });
            }
            if (newLevelDestin < 5) {
              myActor.update({ "system.destin.destin_5.check": false });
            }
            if (newLevelDestin < 4) {
              myActor.update({ "system.destin.destin_4.check": false });
            }
            if (newLevelDestin < 3) {
              myActor.update({ "system.destin.destin_3.check": false });
            }
            if (newLevelDestin < 2) {
              myActor.update({ "system.destin.destin_2.check": false });
            }
            if (newLevelDestin < 1) {
              myActor.update({ "system.destin.destin_1.check": false });
            };
          }
          break;

        case "spleen":
          let oldLevelSpleen = myActor.system.spleen.lvl;
          let newLevelSpleen = parseInt(jaugeNumber);
          if (whichCheckBox) {
            newLevelSpleen--;
          }

          myActor.update({ "system.spleen.lvl": newLevelSpleen});

          // console.log("oldLevelSpleen (OLD) = ", oldLevelSpleen);
          // console.log("newLevelSpleen (NEW) = ", newLevelSpleen);

          if (newLevelSpleen > oldLevelSpleen) {
            if (newLevelSpleen > 0) {
              myActor.update({ "system.spleen.spleen_1.check": true });
            }
            if (newLevelSpleen > 1) {
              myActor.update({ "system.spleen.spleen_2.check": true });
            }
            if (newLevelSpleen > 2) {
              myActor.update({ "system.spleen.spleen_3.check": true });
            }
            if (newLevelSpleen > 3) {
              myActor.update({ "system.spleen.spleen_4.check": true });
            }
            if (newLevelSpleen > 4) {
              myActor.update({ "system.spleen.spleen_5.check": true });
            }
            if (newLevelSpleen > 5) {
              myActor.update({ "system.spleen.spleen_6.check": true });
            }
            if (newLevelSpleen > 6) {
              myActor.update({ "system.spleen.spleen_7.check": true });
            }
            if (newLevelSpleen > 7) {
              myActor.update({ "system.spleen.spleen_8.check": true });
            }
          } else if (newLevelSpleen < oldLevelSpleen) {
            if (newLevelSpleen > 0) {
              myActor.update({ "system.spleen.spleen_1.check": true });
            }
            if (newLevelSpleen > 1) {
              myActor.update({ "system.spleen.spleen_2.check": true });
            }
            if (newLevelSpleen > 2) {
              myActor.update({ "system.spleen.spleen_3.check": true });
            }
            if (newLevelSpleen > 3) {
              myActor.update({ "system.spleen.spleen_4.check": true });
            }
            if (newLevelSpleen > 4) {
              myActor.update({ "system.spleen.spleen_5.check": true });
            }
            if (newLevelSpleen > 5) {
              myActor.update({ "system.spleen.spleen_6.check": true });
            }
            if (newLevelSpleen > 6) {
              myActor.update({ "system.spleen.spleen_7.check": true });
            }
            if (newLevelSpleen > 7) {
              myActor.update({ "system.spleen.spleen_8.check": true });
            }
            if (newLevelSpleen < 8) {
              myActor.update({ "system.spleen.spleen_8.check": false });
            }
            if (newLevelSpleen < 7) {
              myActor.update({ "system.spleen.spleen_7.check": false });
            }
            if (newLevelSpleen < 6) {
              myActor.update({ "system.spleen.spleen_6.check": false });
            }
            if (newLevelSpleen < 5) {
              myActor.update({ "system.spleen.spleen_5.check": false });
            }
            if (newLevelSpleen < 4) {
              myActor.update({ "system.spleen.spleen_4.check": false });
            }
            if (newLevelSpleen < 3) {
              myActor.update({ "system.spleen.spleen_3.check": false });
            }
            if (newLevelSpleen < 2) {
              myActor.update({ "system.spleen.spleen_2.check": false });
            }
            if (newLevelSpleen < 1) {
              myActor.update({ "system.spleen.spleen_1.check": false });
            };
          }
          break;

        default:
          console.log("C'est bizarre !");
      }
    };

   
  /* -------------------------------------------- */

  /**
   * Listen for click buttons on Tromblon.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickInitiative(event) {
      /*

    let myActor = this.actor;
    let formula = "d0"+myActor.system.initiative.toString();
    myActor.rollInitiative(formula);
  
    if (myActor.inCombat) {
      console.log("Acteur en combat");
      let myCombatant = await getCombatantByActor(myActor);
      const myInitiative = await myActor.system.initiative;
      myCombatant?.update({ initiative: myInitiative });
      
    } else ui.notifications.warn(game.i18n.localize("CEL1922.Error1"));
    */
  };


/* -------------------------------------------- */

/**
 * Listen for roll buttons on Moon-die.
 * @param {MouseEvent} event    The originating left click event
 */
async _onClickMoonDieRoll(event) {

  /*
    const element = event.currentTarget;                        // On récupère le clic
    const whatIsIt = element.dataset.libelId;                   // Va récupérer 'attraction-AME-1' par exemple
    console.log("whatIsIt = ", whatIsIt)
    const whatIsItTab = whatIsIt.split('-');
    const specialityUsedLibel = whatIsItTab[0];                 // Va récupérer 'attraction'
    console.log("specialityUsedLibel = "+specialityUsedLibel)
    const skillUsedLibel = whatIsItTab[1];                      // Va récupérer 'AME'
    console.log("skillUsedLibel = ", skillUsedLibel)
    const skillNumUsedLibel = whatIsItTab[2];                   // Va récupérer '1'
    console.log("skillNumUsedLibel = ", skillNumUsedLibel)
  */
    let myActor = this.actor;
    let myMoon = 0;
    let myTypeOfThrow = parseInt(await myActor.system.prefs.typeofthrow.choice);
    let myData = await _whichMoonTypeOfThrow(myActor, myMoon, myTypeOfThrow);
    // console.log("myTypeOfThrow : ", myTypeOfThrow);
    myMoon = parseInt(myData.moon);
    myTypeOfThrow = parseInt(myData.choice);
    let myRoll;
    var msg;
  
    myRoll = "1d8";
    const rMoon = new Roll(myRoll, this.actor.getRollData());
    await rMoon.evaluate();
    // console.log(rMoon);
    
    const mySmartMoonTemplate = 'systems/celestopol1922/templates/form/dice-result-moon.html';
    const mySmartMoonData =
    {
      moonname: game.i18n.localize(myActor.system.skill.moondicetypes[rMoon._total - 1]),
      theresult: rMoon._total
    };
  
    const titleSmartRMoon = "Joli message à venir";
    const mySmartRMoonTemplate = 'systems/celestopol1922/templates/form/dice-result-just-title-moon.html';
    const mySmartRMoonData = {
      title: titleSmartRMoon
      //
    }

  await _showMessagesInChat (myActor, myTypeOfThrow, rMoon, mySmartRMoonTemplate, mySmartRMoonData, mySmartMoonTemplate, mySmartMoonData);

  }


  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on Clickable d8.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickDieRoll(event) {

    const element = event.currentTarget;                        // On récupère le clic
    const whatIsIt = element.dataset.libelId;                   // Va récupérer 'attraction-AME-1' par exemple
    // console.log("whatIsIt = ", whatIsIt)
    const whatIsItTab = whatIsIt.split('-');
    const specialityUsedLibel = whatIsItTab[0];                 // Va récupérer 'attraction'
    // console.log("specialityUsedLibel = "+specialityUsedLibel)
    const skillUsedLibel = whatIsItTab[1];                      // Va récupérer 'AME'
    // console.log("skillUsedLibel = ", skillUsedLibel)
    const skillNumUsedLibel = whatIsItTab[2];                   // Va récupérer '1'
    // console.log("skillNumUsedLibel = ", skillNumUsedLibel)

    let myActor = this.actor;
    let myTypeOfThrow = parseInt(await myActor.system.prefs.typeofthrow.choice);
    let myPromptPresent = await game.settings.get("celestopol1922", "usePromptsForAutomatization");
    let myRoll;
    var msg;

    
    let template = "";
    let myTitle = game.i18n.localize("CEL1922.ThrowDice");
    let myDialogOptions = {};

    let Skill = parseInt(skillNumUsedLibel);
    let mySkillData = await _getSkillValueData (myActor, Skill);

    let myData = {
      myUserID: game.user.id,
      myActorID: myActor.id,
      myTypeOfThrow: myTypeOfThrow,
      myPromptPresent: myPromptPresent,
      myNumberOfDice: 2,
      mySkill: Skill,
      myAnomaly: 0,
      myBonusAnomaly: 1, // +
      myAspect: 0,
      myBonusAspect: 1, // +
      myAttribute: 0,
      myBonusAttribute: 1, // +
      myBonus: 0,
      myMalus: -0,
      myWounds: myActor.system.blessures.lvl,
      myWoundsMalus: 0,
      myDestiny: myActor.system.destin.lvl,
      mySpleen: myActor.system.spleen.lvl,
      myArmorEncumbrance: myActor.system.prefs.lastarmorusedid,
      myArmorProtection: myActor.system.prefs.lastarmorusedid,

      totalBoni: 0,

      mySpecialityLibel: mySkillData.libel,
      myValue: mySkillData.value,
      myRESValue: mySkillData.rESvalue,

      myWeaponVal: 0,
      myArmorVal: 0,

      opponentName: "",
      opponentID: "0",
      weaponOpponentVal: 0,
      armorOpponentVal: 0,
    }


    myData.myWoundsMalus = parseInt(await myActor.system.skill.woundsmalus[myData.myWounds]);
    if (parseInt(myData.myWounds) === 8) {
      ui.notifications.error(game.i18n.localize("CEL1922.ErrYoureOutOfGame"));
      return;
    }

    console.log("myWoundsMalus = ", myData.myWoundsMalus);


    myData.totalBoni = myData.myValue + myData.myRESValue + myData.myWoundsMalus;

    if (myPromptPresent) {
      let myResultDialog =  await _skillDiceRollDialog(
        myActor, template, myTitle, myDialogOptions, myData.myNumberOfDice,
        myData.mySkill, myData.myAnomaly, myData.myBonusAnomaly, myData.myAspect, myData.myBonusAspect,
        myData.myAttribute, myData.myBonusAttribute, myData.myBonus, myData.myMalus,
        myData.myWounds, myData.myDestiny, myData.mySpleen, myData.myArmorEncumbrance, myData.myTypeOfThrow, myData.totalBoni
      );

      if (myResultDialog === null) { // On a cliqué sur Annuler
        return;
      };

      myData.myNumberOfDice = parseInt(myResultDialog.numberofdice);
      myData.mySkill = parseInt(myResultDialog.skill);
      myData.myAnomaly = parseInt(myResultDialog.anomaly);
      myData.myBonusAnomaly = parseInt(myResultDialog.bonusanomaly);
      myData.myAspect = parseInt(myResultDialog.aspect);
      myData.myBonusAspect = parseInt(myResultDialog.bonusaspect);
      myData.myAttribute = parseInt(myResultDialog.attribute);
      myData.myBonusAttribute = parseInt(myResultDialog.bonusattribute);
      myData.myBonus = parseInt(myResultDialog.bonus);
      myData.myMalus = parseInt(myResultDialog.malus);
      myData.myWounds = parseInt(myResultDialog.jaugewounds);
      myData.myDestiny = parseInt(myResultDialog.jaugedestiny);
      myData.mySpleen = parseInt(myResultDialog.jaugespleen);
      myData.myArmorEncumbrance = parseInt(myResultDialog.armor);
      myData.myTypeOfThrow = parseInt(myResultDialog.typeofthrow);

      // myData.myWoundsMalus = ???????


      let mySkillData = await _getSkillValueData (myActor, myData.mySkill);
      myData.mySpecialityLibel = mySkillData.libel;
      myData.myValue = mySkillData.value;
      myData.myRESValue = mySkillData.rESvalue;
    };


    var opponentActor = null;
    if (myPromptPresent  && myData.mySkill == 6) {
      var myTarget = await _whichTarget (myActor, myData.mySpecialityLibel);

      if (myTarget == null) {return};

      if (game.user.targets.size != 0) {
        for (let targetedtoken of game.user.targets) {
          if (targetedtoken.id == myTarget.selectedtarget) {
            opponentActor = targetedtoken.actor;
          };
        };
      };
    };


    console.log("opponentActor = ", opponentActor);
    

    let myTest;
    let myOpposition = 13;
    let myModifier;

    if (opponentActor && myData.mySkill == 6) {
      myOpposition = parseInt(opponentActor.system.skill.corps.actuel);
    };

    console.log ("myOpposition = ", myOpposition);

    if (myPromptPresent) {
      var myTestData = await _whichTypeOfTest (myActor, myOpposition, myData.myTypeOfThrow, myData.mySpecialityLibel);

      myTest = myTestData.test;
      myOpposition = parseInt(myTestData.opposition);
      console.log('myOpposition = ', myOpposition);
      myModifier = parseInt(myTestData.modifier);
      console.log('myModifier = ', myModifier);
    };

    console.log("myValue = ", myData.myValue);
    console.log("myRESValue = ", myData.myRESValue);

    console.log("myBonus = ", myData.myBonus);
    console.log("myMalus = ", myData.myMalus);

    let isInventory;
    let mySelectedInventory;

    let isInventoryOpponent;
    let selectedInventoryOpponent;
    let armorProtectionOpponent;

    if (myPromptPresent && myData.mySkill == 6) {
      var myDamageData = await _whichTypeOfDamage (myActor, opponentActor, myData.myTypeOfThrow);
      isInventory = myDamageData.isinventory;
      myData.myWeaponVal = parseInt(myDamageData.damage);
      mySelectedInventory = myDamageData.selectedinventory;
      myData.myArmorProtection = myDamageData.selectedarmor;
      if (opponentActor) {
        isInventoryOpponent = myDamageData.isinventoryopponent;
        myData.weaponOpponentVal = parseInt(myDamageData.damageopponent);
        selectedInventoryOpponent = myDamageData.selectedinventoryopponent;
        armorProtectionOpponent = myDamageData.selectedarmoropponent;
      };

      console.log("myDamageData = ", myDamageData);
      console.log("isInventory = ", isInventory);

      if (isInventory) {
        myData.myWeaponVal = 0;
        // myData.myWeaponVal = à récupérer dans les items de la fiche de PJ;
        for (let item of myActor.items.filter(item => item.type === 'item')) {
          if (item.system.subtype == "weapon" && item.id == mySelectedInventory) {
            myData.myWeaponVal = parseInt(item.system.damage);
          };
        };
      };

      if (isInventoryOpponent) {
      // myData.weaponOpponentVal = à récupérer dans les items de la fiche de PNJ;
        if (opponentActor) {
          myData.weaponOpponentVal = 0;
          for (let item of opponentActor.items.filter(item => item.type === 'item')) {
            if (item.system.subtype == "weapon" && item.id == selectedInventoryOpponent) {
              myData.weaponOpponentVal = parseInt(item.system.damage);
            };
          };
        };
      };

      // myData.myArmorVal = à récupérer dans les items de la fiche de PJ;
      myData.myArmorVal = 0;
      for (let item of myActor.items.filter(item => item.type === 'item')) {
        if (item.system.subtype == "armor" && item.id == myData.myArmorProtection) {
          myData.myArmorVal = parseInt(item.system.protection);
        };
      };

      // myData.armorOpponentVal = à récupérer dans les items de la fiche de PNJ;
      if (opponentActor) {
        myData.armorOpponentVal = 0;
        for (let item of opponentActor.items.filter(item => item.type === 'item')) {
          if (item.system.subtype == "armor" && item.id == armorProtectionOpponent) {
            myData.armorOpponentVal = parseInt(item.system.protection);
          };
        };
      };

      console.log(myData.myWeaponVal, " ", myData.myArmorVal, " ", myData.weaponOpponentVal, " ", myData.armorOpponentVal);

    };


    let smartR = "Joli message à venir";


    if (!myPromptPresent) {
      myData.totalBoni = myData.myValue + myData.myWoundsMalus; // Si on a décoché l'automatisation, seules les blessures sont décomptées
      smartR = game.i18n.localize("CEL1922.AutomatizationBlocked");
    } else {
      myData.totalBoni = myData.myValue + myData.myBonus + myData.myMalus + myData.myWoundsMalus + myModifier; // Plus d'autres trucs à venir !
    
      let numberOfErrors = 0;


      // Traiter ici les autres boni / mali et paramètres

      // test, opposition, modifier, myinventory, selectedinventory, damage

      if (numberOfErrors) {
        ui.notifications.error(game.i18n.localize("CEL1922.Error999"));
        return;
      }
      
    };

    console.log("totalBoni : ", myData.totalBoni);


    if (myData.mySkill % 5 != 0) { // S'il ne s'agit pas d'un test de RES pur (càd : c'est un test d'une Spécialité)
      myData.totalBoni += myData.myRESValue;
    };

    console.log("totalBoni : ", myData.totalBoni);

    if (myData.totalBoni == 0) {
      myRoll = myData.myNumberOfDice+"d8";
    } else if (myData.totalBoni > 0) {
      myRoll = myData.myNumberOfDice+"d8+" + (myData.totalBoni).toString();
    } else {
      myRoll = myData.myNumberOfDice+"d8-" + Math.abs(myData.totalBoni).toString();
    };
    let r;
    if (myModifier != 999) {
      r = new Roll(myRoll, this.actor.getRollData());
      await r.evaluate();
    }

    const mySmartTemplate = 'systems/celestopol1922/templates/form/dice-result.html';
    const mySmartData = {
      mymodifier: myModifier, 
      numberofdice: myData.myNumberOfDice,
      speciality: myData.mySpecialityLibel,
    }

    let mySmartRTemplate;
    let mySmartRData;

    if (myPromptPresent) {
      let oppositionText = " ≽ ?";
      let myResult;
      if (myModifier == 999) {
        myResult = -999;
      } else {
        myResult = r.total;
      }
      const myTest = myTestData.test;
      console.log("myTest = ", myTest);

      if (myTest != "blindopposition") oppositionText = " ≽ " + myOpposition;
  
      if (myTest == "blindopposition") oppositionText += game.i18n.localize("CEL1922.OppositionEnAveugle");
      if (myTest == "knownopposition" &&  myResult > myOpposition) {
        oppositionText += game.i18n.localize("CEL1922.OppositionSurpassee");
      } else if (myTest == "knownopposition" && myResult == myOpposition && myData.mySkill != 6) {
        oppositionText += game.i18n.localize("CEL1922.OppositionEgalite");
      } else if (myTest == "knownopposition" && myResult == myOpposition && myData.mySkill == 6) {
        oppositionText += game.i18n.localize("CEL1922.PersonneNestBlesse");
      } else if (myTest == "knownopposition" &&  myResult < myOpposition) {
        oppositionText += game.i18n.localize("CEL1922.OppositionInsurpassee");
      };
      if (myTest == "simpletest" &&  myResult >= myOpposition) {
        oppositionText += game.i18n.localize("CEL1922.SeuilAtteint");
      } else if (myTest == "simpletest" &&  myResult < myOpposition) {
        oppositionText += game.i18n.localize("CEL1922.SeuilNon-atteint");
      };

      let titleSmartR = game.i18n.localize("CEL1922.Test") + myRoll + " (" + myResult + ")" + oppositionText;
      mySmartRTemplate = 'systems/celestopol1922/templates/form/dice-result-comments.html';
      let youWin = false;
      let thereisEgality = false;
      if (myPromptPresent) {
        if (myModifier == 999) {
          youWin = true;
        } else if (myResult >= parseInt(myOpposition)) {
            youWin = true;
            if (myResult == parseInt(myOpposition) && myData.mySkill == 6) {
              thereisEgality = true;
            };
        };
      };
      if (opponentActor) {
        myData.opponentName = opponentActor.name;
        myData.opponentID = opponentActor.id;
      } else {
        myData.opponentName = game.i18n.localize("CEL1922.Missing");
      };

      console.log("game.user = ", game.user);
      console.log("game.user.id = ", game.user.id);

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
        titleNbrDice: "",
        dataNbrDice: "",
        titleDomain: "",
        dataDomain: "",
        titleSpeciality: "",
        dataSpeciality: "",
        titleAnomaly: "",
        dataAnomaly: "",
        titleAspect: "",
        dataAspect: "",
        titleAttribute: "",
        dataSpeciality: "",
        titleBonus: "",
        dataBonus: "",
        titleMalus: "",
        dataMalus: "",
        titleArmor: "",
        dataArmor: "",
        titleWounds: "",
        dataWounds: "",
        titleDestiny: "",
        dataDestiny: "",
        titleSpleen: "",
        dataSpleen: "",
        numSpeciality: myData.mySkill
      }

      console.log("mySmartRData = ", mySmartRData);
  
    } else {
      let titleSmartR = game.i18n.localize("CEL1922.Test") + myRoll;
      mySmartRTemplate = 'systems/celestopol1922/templates/form/dice-result-just-title.html';
      mySmartRData = {
        mymodifier: myModifier, 
        title: titleSmartR,
        numSpeciality: myData.mySkill
      };
    };


    await _showMessagesInChat (myActor, myData.myTypeOfThrow, r, mySmartRTemplate, mySmartRData, mySmartTemplate, mySmartData);

  }
}



/* -------------------------------------------- */

async function _whichTarget (myActor, mySkill) {
  // Render modal dialog
  const template = 'systems/celestopol1922/templates/form/target-prompt.html';
  const title = game.i18n.localize("CEL1922.WhichTarget");
  let dialogOptions = "";

  let myItemTarget = {};

  function myObject(id, label)
  {
    this.id = id;
    this.label = label;
  };

  myItemTarget["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
  console.log('game.user.targets.size = ', game.user.targets.size);
  if (game.user.targets.size != 0) {
    for (let targetedtoken of game.user.targets) {
      myItemTarget[targetedtoken.id.toString()] = new myObject(targetedtoken.id.toString(), targetedtoken.name.toString());
    };
  };

  var dialogData = {
    skill: mySkill,
    you: myActor.name,
    youimg: myActor.img,
    targetchoices: myItemTarget,
    selectedtarget: "0",
    tokenimg: ""
  };
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
    // new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActor, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Cancel')}</span></div>`,
            callback: (html) => resolve(null)
          }
        },
        default: 'validateBtn',
        close: () => resolve(null)
      },
      dialogOptions
    ).render(true, {
      width: 530,
      height: 371
    });
  });

  if (prompt == null) {
    return prompt
  } else {
  return dialogData;
  }

  async function _computeResult(myActor, myHtml) {
    // console.log("I'm in _computeResult(myActor, myHtml)");
    const editedData = {
      skill: "",
      you: "",
      youimg: "",
      targetchoices: {},
      selectedtarget: myHtml.find("select[name='target']").val(),
      tokenimg: ""
    };
    return editedData;
  }

}



/* -------------------------------------------- */

async function _whichTypeOfDamage (myActor, opponentActor, myTypeOfThrow) {
  // Render modal dialog
  const template = 'systems/celestopol1922/templates/form/type-weapon-prompt.html';
  const title = game.i18n.localize("CEL1922.TypeOfWeaponTitle");
  let dialogOptions = "";

  let myItemWeapon = {};
  let myItemArmor = {};

  let myItemWeaponOpponent = {};
  let myItemArmorOpponent = {};

  function myObject(id, label)
  {
    this.id = id;
    this.label = label;
  };


  myItemWeapon["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
  myItemWeapon["-1"] = new myObject("-1", game.i18n.localize("CEL1922.barehands"));
  for (let item of myActor.items.filter(item => item.type === 'item')) {
    if (item.system.subtype == "weapon") {
    myItemWeapon[item.id.toString()] = new myObject(item.id.toString(), item.name.toString()+" ["+item.system.damage.toString()+"]");
    };
  };

  myItemArmor["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
  for (let item of myActor.items.filter(item => item.type === 'item')) {
    if (item.system.subtype == "armor") {
      myItemArmor[item.id.toString()] = new myObject(item.id.toString(), item.name.toString()+" ["+item.system.protection.toString()+"]");
    };
  };

  const testOpponentActor = (opponentActor != null);

  let opponentName = "";
  if (testOpponentActor) {
     opponentName = opponentActor.name;
  } else {
    opponentName = game.i18n.localize("CEL1922.Missing");
  };

  myItemWeaponOpponent["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
  myItemWeaponOpponent["-1"] = new myObject("-1", game.i18n.localize("CEL1922.barehands"));
  if (testOpponentActor) {
    for (let item of opponentActor.items.filter(item => item.type === 'item')) {
      if (item.system.subtype == "weapon") {
      myItemWeaponOpponent[item.id.toString()] = new myObject(item.id.toString(), item.name.toString()+" ["+item.system.damage.toString()+"]");
      };
    };
  }

  myItemArmorOpponent["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
  if (testOpponentActor) {
    for (let item of opponentActor.items.filter(item => item.type === 'item')) {
      if (item.system.subtype == "armor") {
        myItemArmorOpponent[item.id.toString()] = new myObject(item.id.toString(), item.name.toString()+" ["+item.system.protection.toString()+"]");
      };
    };
  }

  var dialogData = {
    testopponentactor: testOpponentActor,

    isinventory: true,
    inventorychoices: myItemWeapon,
    selectedinventory: myActor.system.prefs.lastweaponusedid,
    damage: myActor.system.prefs.improviseddamage,
    armorchoices: myItemArmor,
    selectedarmor: myActor.system.prefs.lastarmorusedid,

    opponentname: opponentName,
    isinventoryopponent: true,
    inventoryopponentchoices: myItemWeaponOpponent,
    selectedinventoryopponent: "0",
    damageopponent: 0,
    armoropponentchoices: myItemArmorOpponent,
    selectedarmoropponent: "0",
  };
  // dialogData = null;

  // console.log(dialogData);
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
    // new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActor, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.CancelChanges')}</span></div>`,
            callback: (html) => resolve(null)
          }
        },
        default: 'validateBtn',
        close: () => resolve(null)
      },
      dialogOptions
    ).render(true, {
      width: 630,
      height: 548
    });
  });

  return dialogData;

  async function _computeResult(myActor, myHtml) {
    // console.log("I'm in _computeResult(myActor, myHtml)");
    const editedData = {
      testopponentactor: false,

      isinventory: myHtml.find("input[value='isinventory']").is(':checked'),
      selectedinventory: myHtml.find("select[name='inventory']").val(),
      damage: parseInt(myHtml.find("select[name='damage']").val()),
      selectedarmor: myHtml.find("select[name='armor']").val(),

      opponentname: "",
      isinventoryopponent: myHtml.find("input[value='isinventoryopponent']").is(':checked'),
      selectedinventoryopponent: myHtml.find("select[name='inventoryopponent']").val(),
      damageopponent: parseInt(myHtml.find("select[name='damageopponent']").val()),
      selectedarmoropponent: myHtml.find("select[name='armoropponent']").val()
    };
    myActor.update({ "system.prefs.lastweaponusedid": editedData.selectedinventory, "system.prefs.improviseddamage": editedData.damage.toString() });
    // console.log("myinventory = ", myinventory);
    return editedData;
  }
}


/* -------------------------------------------- */

async function _whichTypeOfTest (myActor, myOpposition, myTypeOfThrow, mySkill) {
  // Render modal dialog
  const template = 'systems/celestopol1922/templates/form/type-test-prompt.html';
  const title = game.i18n.localize("CEL1922.TypeOfTestTitle");
  let dialogOptions = "";
  let myTest = "knownopposition";
  var dialogData = {
    skill: mySkill,
    test: myTest,
    opposition: myOpposition.toString(),
    modifier: "0",
  };
  // dialogData = null;

  // console.log(dialogData);
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActor, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.CancelChanges')}</span></div>`,
            callback: (html) => resolve(null)
          }
        },
        default: 'validateBtn',
        close: () => resolve(null)
      },
      dialogOptions
    ).render(true, {
      width: 550,
      height: 309
    });
  });

  return dialogData;

  async function _computeResult(myActor, myHtml) {
    // console.log("I'm in _computeResult(myActor, myHtml)");
    let myTest = "toto";
    if (myHtml.find("input[value='knownopposition']").is(':checked')) myTest = "knownopposition";
    if (myHtml.find("input[value='simpletest']").is(':checked')) myTest = "simpletest";
    if (myHtml.find("input[value='blindopposition']").is(':checked')) myTest = "blindopposition";
    console.log("myTest = ", myTest)
    const editedData = {
      test: myTest,
      opposition: myHtml.find("select[name='opposition']").val(),
      modifier: myHtml.find("select[name='modifier']").val()
    };
    console.log("editedData = ", editedData);
    return editedData;
  }
}


/* -------------------------------------------- */

async function _getSkillValueData (myActor, mySkillNbr) {

  const mySkill = parseInt(mySkillNbr);
  let myStringVal;
  let myStringRES;

  let specialityLibel = await game.i18n.localize(myActor.system.skill.skilltypes[mySkillNbr]);
  let specialityTab = specialityLibel.split(' ');
  if (specialityTab[0] == "⌞") {
    specialityLibel = specialityLibel.substring(2);
  }

  switch (mySkill) {
    case 0:
      myStringVal = await myActor.system.skill.ame.res;
      myStringRES = myStringVal;
    break;
    case 1:
      myStringVal = await myActor.system.skill.ame.attraction.value;
      myStringRES = await myActor.system.skill.ame.res;
    break;
    case 2:
      myStringVal = await myActor.system.skill.ame.artifice.value;
      myStringRES = await myActor.system.skill.ame.res;
      break;
    case 3:
      myStringVal = await myActor.system.skill.ame.coercition.value;
      myStringRES = await myActor.system.skill.ame.res;
      break;
    case 4:
      myStringVal = await myActor.system.skill.ame.faveur.value;
      myStringRES = await myActor.system.skill.ame.res;
      break;

    case 5:
      myStringVal = await myActor.system.skill.corps.res;
      myStringRES = myStringVal;
    break;
    case 6:
      myStringVal = await myActor.system.skill.corps.echauffouree.value;
      myStringRES = await myActor.system.skill.corps.res;
    break;
    case 7: 
      myStringVal = await myActor.system.skill.corps.effacement.value;
      myStringRES = await myActor.system.skill.corps.res;
    break;
    case 8: 
      myStringVal = await myActor.system.skill.corps.prouesse.value;
      myStringRES = await myActor.system.skill.corps.res;
    break;
    case 9:
      myStringVal = await myActor.system.skill.corps.mobilite.value;
      myStringRES = await myActor.system.skill.corps.res;
    break;

    case 10:
      myStringVal = await myActor.system.skill.coeur.res;
      myStringRES = myStringVal;
    break;
    case 11:
      myStringVal = await myActor.system.skill.coeur.appreciation.value;
      myStringRES = await myActor.system.skill.coeur.res;
    break;
    case 12:
      myStringVal = await myActor.system.skill.coeur.arts.value;
      myStringRES = await myActor.system.skill.coeur.res;
    break;
    case 13:
      myStringVal = await myActor.system.skill.coeur.inspiration.value;
      myStringRES = await myActor.system.skill.coeur.res;
    break;
    case 14:
      myStringVal = await myActor.system.skill.coeur.traque.value;
      myStringRES = await myActor.system.skill.coeur.res;
    break;

    case 15:
      myStringVal = await myActor.system.skill.esprit.res;
      myStringRES = myStringVal;
    break;
    case 16:
      myStringVal = await myActor.system.skill.esprit.instruction.value;
      myStringRES = await myActor.system.skill.esprit.res;
    break;
    case 17:
      myStringVal = await myActor.system.skill.esprit.mtechnologique.value;
      myStringRES = await myActor.system.skill.esprit.res;
    break;
    case 18:
      myStringVal = await myActor.system.skill.esprit.raisonnement.value;
      myStringRES = await myActor.system.skill.esprit.res;
    break;
    case 19:
      myStringVal = await myActor.system.skill.esprit.traitement.value;
      myStringRES = await myActor.system.skill.esprit.res;
    break;
  };

  let myValue = parseInt(myStringVal);
  if (myStringVal == null) myValue = 0;
  let myRESValue = parseInt(myStringRES);
  if (myStringRES == null) myRESValue = 0;

  let myData = {
    libel: specialityLibel,
    value: myValue,
    rESvalue: myRESValue
  };

  // console.log("myData = ", myData);

  return myData;
}


/* -------------------------------------------- */

async function _whichMoonTypeOfThrow (myActor, myMoon, myTypeOfThrow) {
  // Render modal dialog
  const template = 'systems/celestopol1922/templates/form/type-moon-throw-prompt.html';
  const title = game.i18n.localize("CEL1922.TypeOfThrowTitle");
  let dialogOptions = "";
  var dialogData = {
    moon: myMoon.toString(),
    choice: myTypeOfThrow.toString(),
  };
  // console.log(dialogData);
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(myActor, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.CancelChanges')}</span></div>`,
            callback: (html) => resolve(null)
          }
        },
        default: 'validateBtn',
        close: () => resolve(null)
      },
      dialogOptions
    ).render(true, {
      width: 630,
      height: 214
    });
  });

  return dialogData;

  async function _computeResult(myActor, myHtml) {
    // console.log("I'm in _computeResult(myActor, myHtml)");
    const editedData = {
      moon:  parseInt(myHtml.find("select[name='moon']").val()),
      choice:  parseInt(myHtml.find("select[name='choice']").val())
    };
    // console.log("choice = ", choice);
    return editedData;
  }
}

/* -------------------------------------------- */


async function _skillDiceRollDialog(
  myActor, template, myTitle, myDialogOptions, myNumberOfDice,
  mySkill, myAnomaly, myBonusAnomaly, myAspect, myBonusAspect, myAttribute, myBonusAttribute, myBonus, myMalus,
  myWounds, myDestiny, mySpleen, myArmor, myTypeOfThrow, myTotalScoresBonusMalus
) {
  // Render modal dialog
  template = template || 'systems/celestopol1922/templates/form/skill-dice-prompt.html';
  const title = myTitle;


  ///////////////////////////////////////////////////////////////
  const dialogOptions = await _getDataSkill(myActor);
  // console.log("dialogOptions = ", dialogOptions)
  ///////////////////////////////////////////////////////////////
  
  
  var dialogData = {
    numberofdice: myNumberOfDice.toString(),
    skill: mySkill.toString(),
    anomaly: myAnomaly.toString(),
    aspect: myAspect.toString(),
    attribute: myAttribute.toString(),
    bonusanomalybonus: myBonusAnomaly.toString(),
    bonusaspect: myBonusAspect.toString(),
    bonusattribute: myBonusAttribute.toString(),
    bonus: myBonus.toString(),
    malus: myMalus.toString(),
    jaugewounds: myWounds.toString(),
    jaugedestiny: myDestiny.toString(),
    jaugespleen: mySpleen.toString(),
    armor: myArmor.toString(),
    typeofthrow: myTypeOfThrow.toString(),
    totalscoresbonusmalus: myTotalScoresBonusMalus.toString()
  };
  // console.log("dialogData avant retour func = ", dialogData);
  const templateData = foundry.utils.mergeObject(dialogData, dialogOptions);
  const html = await renderTemplate(template, templateData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new ModifiedDialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 415,
      height: 660
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  async function _computeResult(myDialogData, myHtml) {
    // console.log("J'exécute bien _computeResult()");
    myDialogData.numberofdice = myHtml.find("select[name='numberofdice']").val();
    myDialogData.skill = myHtml.find("select[name='skill']").val();
    myDialogData.anomaly = myHtml.find("select[name='anomaly']").val();
    myDialogData.bonusanomaly = myHtml.find("select[name='bonusanomaly']").val();
    myDialogData.aspect = myHtml.find("select[name='aspect']").val();
    myDialogData.bonusaspect = myHtml.find("select[name='bonusaspect']").val();
    myDialogData.attribute = myHtml.find("select[name='attribute']").val();
    myDialogData.bonusattribute = myHtml.find("select[name='bonusttribute']").val();
    myDialogData.bonus = myHtml.find("select[name='bonus']").val();
    myDialogData.malus = myHtml.find("select[name='malus']").val();
    myDialogData.jaugewounds = myHtml.find("select[name='jaugewounds']").val();
    myDialogData.jaugedestiny = myHtml.find("select[name='jaugedestiny']").val();
    myDialogData.jauge_spleen = myHtml.find("select[name='jaugespleen']").val();
    myDialogData.armor = myHtml.find("select[name='armor']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();
    // console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };


  /* -------------------------------------------- */

  async function _getDataSkill(myActor) {

    const menuSkill = myActor.system.skill.skilltypes;
    const menuJaugeWounds = myActor.system.skill.woundstypes;
    const menuJaugeDestiny = myActor.system.skill.destinytypes;
    const menuJaugeSpleen = myActor.system.skill.spleentypes;

    // console.log("menuSkill", menuSkill);

    const sizeMenuSkill = menuSkill.length;
    const sizeMenuJaugeWounds = menuJaugeWounds.length;
    const sizeMenuJaugeDestiny = menuJaugeDestiny.length;
    const sizeMenuJaugeSpleen = menuJaugeSpleen.length;

    // console.log("sizeMenuSkill", sizeMenuSkill);


    let mySkill = {};
    let myAnomaly = {};
    let myAspect = {};
    let myAttribute = {};
    let myJauge_Wounds = {};
    let myJauge_Destiny = {};
    let myJauge_Spleen = {};
    let myArmor = {};

    function myObject(id, label)
    {
      this.id = id;
      this.label = label;
    };


    for (let i=0; i<sizeMenuSkill; i++) {
      mySkill[i.toString()] = new myObject(i.toString(), game.i18n.localize(menuSkill[i]));
    };

    // console.log("mySkill", mySkill);

    for (let i=0; i<sizeMenuJaugeWounds; i++) {
      myJauge_Wounds[i.toString()] = new myObject(i.toString(), game.i18n.localize(menuJaugeWounds[i]));
    };

    for (let i=0; i<sizeMenuJaugeDestiny; i++) {
      myJauge_Destiny[i.toString()] = new myObject(i.toString(), game.i18n.localize(menuJaugeDestiny[i]));
    };

    for (let i=0; i<sizeMenuJaugeSpleen; i++) {
      myJauge_Spleen[i.toString()] = new myObject(i.toString(), game.i18n.localize(menuJaugeSpleen[i]));
    };

    // Create options for Aspects/Anomalies

    let compt = 0;
    myAnomaly["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
      compt++;
      if (compt <= 1) {
      myAnomaly[anomaly.id.toString()] = new myObject(anomaly.id.toString(), anomaly.name.toString());
      };
    };
    compt = 0;
    myAspect["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
      compt++;
      if (compt <= 4) {
        myAspect[aspect.id.toString()] = new myObject(aspect.id.toString(), aspect.name.toString());
      };
    };
    compt = 0;
    myAttribute["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let attribute of myActor.items.filter(item => item.type === 'attribute')) {
      compt++;
      if (compt <= 4) {
        myAttribute[attribute.id.toString()] = new myObject(attribute.id.toString(), attribute.name.toString());
      };
    };

    compt = 0;
    myArmor["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let item of myActor.items.filter(item => item.type === 'item')) {
      if (item.system.subtype == "armor") {
        myArmor[item.id.toString()] = new myObject(item.id.toString(), item.name.toString()+" ["+item.system.protection.toString()+"]");
      };
    };


    const context = {
    skillchoices: mySkill,
    anomalychoices: myAnomaly,
    bonusanomaly: '1',
    aspectchoices: myAspect,
    bonusaspect: '1',
    attributechoices: myAttribute,
    bonusattribute: '1',
    armorchoices: myArmor,
    jaugewoundschoices: myJauge_Wounds,
    jaugedestinychoices: myJauge_Destiny,
    jaugespleenchoices: myJauge_Spleen
    };

    // console.log("context = ", context)
    return context;
  }

}

/* -------------------------------------------- */

async function _showMessagesInChat (myActor, myTypeOfThrow, r, mySmartRTemplate, mySmartRData, mySmartTemplate, mySmartData) {

  let msg = "";

  const typeOfThrow = myTypeOfThrow;

  if (mySmartRData.mymodifier != 999) {
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
    };


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
        content:smartHtml,
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
      });
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

