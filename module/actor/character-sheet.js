import { CEL1922ActorSheet } from "./actor-sheet.js";
import { CEL1922 } from "../config.js";
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
    html.find(".tromblon-click").click(this._onClickInitiative.bind(this));
    html.find(".check-sheet-click").click(this._onClickCheckSheet.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Listen for click on Eye.
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
    const template = 'systems/celestopol1922/templates/form/prefs-prompt.html';
    const title = game.i18n.localize("CEL1922.Preferences");
    let dialogOptions = "";
    var dialogData = {
      choice: this.actor.system.prefs.typeofthrow.choice,
      check: this.actor.system.prefs.typeofthrow.check
    };
    // console.log("Gear dialogData = ", dialogData);
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
              callback: (html) => resolve(_computeResult(this.actor, html))
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
        height: 215
      });
    });
    async function _computeResult(myActor, myHtml) {
      // console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      // console.log("choice = ", choice);
      const isChecked = myHtml.find("input[name='check']").is(':checked');
      // console.log("isChecked = ", isChecked);
      await myActor.update({ "system.prefs.typeofthrow.choice": choice.toString(), "system.prefs.typeofthrow.check": isChecked });
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
          let oldLevelBlessures = parseInt(myActor.system.blessures.lvl);
          let newLevelBlessures = jaugeNumber;
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
          let oldLevelDestin = parseInt(myActor.system.destin.lvl);
          let newLevelDestin = jaugeNumber;
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
          let oldLevelSpleen = parseInt(myActor.system.spleen.lvl);
          let newLevelSpleen = jaugeNumber;
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
  let myTypeOfThrow = parseInt(await myActor.system.prefs.typeofthrow.choice);
  myTypeOfThrow = await _whichTypeOfThrow(myActor, myTypeOfThrow.toString());
  // console.log("myTypeOfThrow : ", myTypeOfThrow);
  let myRoll;
  var msg;



  myRoll = "1d8";
  const rMoon = new Roll(myRoll, this.actor.getRollData());
  await rMoon.evaluate();
  // console.log(rMoon);


  switch ( myTypeOfThrow ) {
    case 0: msg = await rMoon.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: 'roll'                      // Public Roll
      });
    break;
    case 1: msg = await rMoon.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: 'gmroll'                    // Private Roll
      });
    break;
    case 2: msg = await rMoon.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: 'blindroll'                 // Blind GM Roll
    });
    break;
    case 3: msg = await rMoon.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: 'selfroll'                      // Self Roll
    });
    break;
    default: console.log("C'est bizarre !");
  };


  if (game.modules.get("dice-so-nice")?.active) {
    await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
  };


  // Smart Message
  const myMoonName = "Moon Name";
  const smartMoonTemplate = 'systems/celestopol1922/templates/form/dice-result-moon.html';
  const smartMoonData =
  {
    moonname: game.i18n.localize(myActor.system.skill.moondicetypes[rMoon._total - 1]),
    theresult: rMoon._total,
  };
  // console.log("smartMoonData avant retour func = ", smartMoonData);
  const smartHtml = await renderTemplate(smartMoonTemplate, smartMoonData);

  switch ( myTypeOfThrow ) {
    case 0:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: smartHtml,
        rollMode: 'roll'                          // Public Roll
      });

    break;
    case 1:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content:smartHtml,
        rollMode: 'gmroll'                        // Private Roll
      });

    break;
    case 2:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: smartHtml,
        rollMode: 'blindroll'                       // Blind GM Roll
      });

    break;
    case 3:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: smartHtml,
        rollMode: 'selfroll'                        // Self Roll
      });

    break;
    default: console.log("C'est bizarre !");
  };

  switch ( myTypeOfThrow ) {
    case 0:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: rMoon,
        rollMode: 'roll'                          // Public Roll
      });

    break;
    case 1:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: rMoon,
        rollMode: 'gmroll'                        // Private Roll
      });

    break;
    case 2:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: rMoon,
        rollMode: 'blindroll'                       // Blind GM Roll
      });
    break;
    case 3:
      ChatMessage.create({
        user: game.user.id,
        // speaker: ChatMessage.getSpeaker({ token: this.actor }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: rMoon,
        rollMode: 'selfroll'                        // Self Roll
      });

    break;
    default: console.log("C'est bizarre !");
    };

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
    let myPromptPresent = await myActor.system.prefs.typeofthrow.check;
    let myRoll;
    var msg;

    
    let template = "";
    let myTitle = game.i18n.localize("CEL1922.ThrowDice");
    let myDialogOptions = {};
    let myNumberOfDice = 2;
    let mySkill = parseInt(skillNumUsedLibel);
    let myAnomaly = 0;
    let myBonusAnomaly = 1;
    let myAspect = 0;
    let myBonusAspect = 1;
    let myAttribute = 0;
    let myBonusAttribute = 1;
    let myBonus = 0;
    let myMalus = -0;
    let myWounds = myActor.system.blessures.lvl;
    let myDestiny = myActor.system.destin.lvl;
    let mySpleen = myActor.system.spleen.lvl;


    var mySkillData = await _getSkillValueData (myActor, mySkill);
    let mySpecialityLibel = mySkillData.libel;
    let myValue = mySkillData.value;
    let myRESValue = mySkillData.rESvalue;


    if (parseInt(myWounds) == 8) {
      ui.notifications.error(game.i18n.localize("CEL1922.ErrYoureOutOfGame"));
      return;
    }


    if (myPromptPresent === true) {
      let myResultDialog =  await _skillDiceRollDialog(
        myActor, template, myTitle, myDialogOptions, myNumberOfDice,
        mySkill, myAnomaly, myBonusAnomaly, myAspect, myBonusAspect, myAttribute, myBonusAttribute, myBonus, myMalus,
        myWounds, myDestiny, mySpleen, myTypeOfThrow
      );

      if (myResultDialog === null) {
        return;
      };

      myNumberOfDice = parseInt(myResultDialog.numberofdice);
      mySkill = parseInt(myResultDialog.skill);
      myAnomaly = parseInt(myResultDialog.anomaly);
      myBonusAnomaly = parseInt(myResultDialog.bonusanomaly);
      myAspect = parseInt(myResultDialog.aspect);
      myBonusAspect = parseInt(myResultDialog.bonusaspect);
      myAttribute = parseInt(myResultDialog.attribute);
      myBonusAttribute = parseInt(myResultDialog.bonusattribute);
      myBonus = parseInt(myResultDialog.bonus);
      myMalus = parseInt(myResultDialog.malus);
      myWounds = parseInt(myResultDialog.jaugewounds);
      myDestiny = parseInt(myResultDialog.jaugedestiny);
      mySpleen = parseInt(myResultDialog.jaugespleen);
      myTypeOfThrow = parseInt(myResultDialog.typeofthrow);


      mySkillData = await _getSkillValueData (myActor, mySkill);
      mySpecialityLibel = mySkillData.libel;
      myValue = mySkillData.value;
      myRESValue = mySkillData.rESvalue;
  

    } else {
      myTypeOfThrow = await _whichTypeOfThrow(myActor, myTypeOfThrow.toString());
     // console.log("myTypeOfThrow : ", myTypeOfThrow);
    };

    console.log("myValue = ", myValue);
    console.log("myRESValue = ", myRESValue);

    console.log("myBonus = ", myBonus);
    console.log("myMalus = ", myMalus);

    let myWoundsMalus = parseInt(await myActor.system.skill.woundsmalus[myWounds]);
    if (myWounds == 8) {
      myWoundsMalus = 0;
      ui.notifications.warn(game.i18n.localize("CEL1922.YoureOutOfGame"));
    };
    console.log("myWoundsMalus = ", myWoundsMalus);

    let totalBoni = 0;

    console.log("totalBoni : ", totalBoni);

    totalBoni += myValue + myBonus + myMalus + myWoundsMalus;

    console.log("totalBoni : ", totalBoni);

    // Traiter ici les autres boni / mali


    //

    if (mySkill % 5 != 0) { // S'il ne s'agit pas d'un tirage de RES pur (càd : tirage d'une Spécialité)
      totalBoni += myRESValue;
    };

    console.log("totalBoni : ", totalBoni);

    if (totalBoni == 0) {
      myRoll = myNumberOfDice+"d8";
    } else if (totalBoni > 0) {
      myRoll = myNumberOfDice+"d8+" + (totalBoni).toString();
    } else {
      myRoll = myNumberOfDice+"d8-" + Math.abs(totalBoni).toString();
    };
    const r = new Roll(myRoll, this.actor.getRollData());
    await r.evaluate();
    // console.log(r);


    switch ( myTypeOfThrow ) {
      case 0: msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'roll'                      // Public Roll
        });
      break;
      case 1: msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'gmroll'                    // Private Roll
        });
      break;
      case 2: msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'blindroll'                 // Blind GM Roll
      });
      break;
      case 3: msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'selfroll'                      // Self Roll
      });
      break;
      default: console.log("C'est bizarre !");
    };


    if (game.modules.get("dice-so-nice")?.active) {
      await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
    };
  

    // Smart Message
    const smartTemplate = 'systems/celestopol1922/templates/form/dice-result.html';
    const smartData = {
      numberofdice: myNumberOfDice,
      speciality: mySpecialityLibel
    }
    // console.log("smartData avant retour func = ", smartData);
    const smartHtml = await renderTemplate(smartTemplate, smartData);
  
    switch ( myTypeOfThrow ) {
      case 0:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: smartHtml,
          rollMode: 'roll'                          // Public Roll
        });

      break;
      case 1:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content:smartHtml,
          rollMode: 'gmroll'                        // Private Roll
        });

      break;
      case 2:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: smartHtml,
          rollMode: 'blindroll'                       // Blind GM Roll
        });

      break;
      case 3:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: smartHtml,
          rollMode: 'selfroll'                        // Self Roll
        });

      break;
      default: console.log("C'est bizarre !");
    };

    switch ( myTypeOfThrow ) {
      case 0:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: r,
          rollMode: 'roll'                          // Public Roll
        });

      break;
      case 1:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: r,
          rollMode: 'gmroll'                        // Private Roll
        });

      break;
      case 2:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: r,
          rollMode: 'blindroll'                       // Blind GM Roll
        });
      break;
      case 3:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: r,
          rollMode: 'selfroll'                        // Self Roll
        });

      break;
      default: console.log("C'est bizarre !");
    };
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

console.log("myData = ", myData);

  return myData;
}

/* -------------------------------------------- */

async function _whichTypeOfThrow (myActor, myTypeOfThrow) {
  // Render modal dialog
  const template = 'systems/celestopol1922/templates/form/type-throw-prompt.html';
  const title = game.i18n.localize("CEL1922.TypeOfThrowTitle");
  let dialogOptions = "";
  var choice = 0;
  var dialogData = {
    choice: myTypeOfThrow,
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
            callback: (html) => resolve( choice = _computeResult(myActor, html) )
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
      width: 480,
      height: 180
    });
  });

  if (prompt != null) {
  return choice;
  } else {
    return parseInt(dialogData.choice);
  };


  async function _computeResult(myActor, myHtml) {
    // console.log("I'm in _computeResult(myActor, myHtml)");
    const choice =  parseInt(myHtml.find("select[name='choice']").val());
    // console.log("choice = ", choice);
    return choice;
  }
}

/* -------------------------------------------- */


async function _skillDiceRollDialog(
  myActor, template, myTitle, myDialogOptions, myNumberOfDice,
  mySkill, myAnomaly, myBonusAnomaly, myAspect, myBonusAspect, myAttribute, myBonusAttribute, myBonus, myMalus,
  myWounds, myDestiny, mySpleen, myTypeOfThrow
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
    typeofthrow: myTypeOfThrow.toString()

  };
  // console.log("dialogData avant retour func = ", dialogData);
  const templateData = foundry.utils.mergeObject(dialogData, dialogOptions);
  const html = await renderTemplate(template, templateData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
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
      width: 375,
      height: 618
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
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

    function myObject(id, label)
    {
      this.id = id;
      this.label = label;
    };


    for (let i=0; i<sizeMenuSkill; i++) {
      mySkill[i.toString()] = new myObject(i.toString(), menuSkill[i]);
    };

    // console.log("mySkill", mySkill);

    for (let i=0; i<sizeMenuJaugeWounds; i++) {
      myJauge_Wounds[i.toString()] = new myObject(i.toString(), menuJaugeWounds[i]);
    };

    for (let i=0; i<sizeMenuJaugeDestiny; i++) {
      myJauge_Destiny[i.toString()] = new myObject(i.toString(), menuJaugeDestiny[i]);
    };

    for (let i=0; i<sizeMenuJaugeSpleen; i++) {
      myJauge_Spleen[i.toString()] = new myObject(i.toString(), menuJaugeSpleen[i]);
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

    const context = {
    skillchoices: mySkill,
    anomalychoices: myAnomaly,
    bonusanomaly: '1',
    aspectchoices: myAspect,
    bonusaspect: '1',
    attributechoices: myAttribute,
    bonusattribute: '1',
    jaugewoundschoices: myJauge_Wounds,
    jaugedestinychoices: myJauge_Destiny,
    jaugespleenchoices: myJauge_Spleen
    };

    // console.log("context = ", context)
    return context;
  }

}