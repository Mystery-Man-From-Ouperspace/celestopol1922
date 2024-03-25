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
      dragDrop: [{dragSelector: ".item-list .item .aspect .anomaly", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.equipments = context.items.filter(item => item.type === "item");
    context.aspects = context.items.filter(item => item.type === "aspect");
    context.anomalies = context.items.filter(item => item.type === "anomaly");

    context.CEL1922 = CEL1922;
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".click").click(this._onClickDieRoll.bind(this));
    html.find(".click-prefs").click(this._onClickPrefs.bind(this));
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
    console.log("Gear dialogData = ", dialogData);
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
        width: 620,
        height: 150
      });
    });
    async function _computeResult(myActor, myHtml) {
      console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      console.log("choice = ", choice);
      const isChecked = myHtml.find("input[name='check']").is(':checked');
      console.log("isChecked = ", isChecked);
      await myActor.update({ "system.prefs.typeofthrow.choice": choice.toString(), "system.prefs.typeofthrow.check": isChecked });
    }
  }

    /* -------------------------------------------- */

  /**
   * Listen for roll buttons on Clickable d10.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickDieRoll(event) {


    

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


    let myActor = this.actor;
    let myTypeOfThrow = parseInt(await myActor.system.prefs.typeofthrow.choice);
    let myPromptPresent = await myActor.system.prefs.typeofthrow.check;
    let myRoll;
    var msg;


    if (specialityUsedLibel == "moon") {
      myRoll = "1d8";
      const rMoon = new Roll(myRoll, this.actor.getRollData());
      await rMoon.evaluate();
      console.log(rMoon);
  
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
  
      // Smart Message
      const myMoonName = "Moon Name";
      const smartMoonTemplate = 'systems/celestopol1922/templates/form/dice-result-moon.html';
      const smartMoonData =
      {
        moonname: game.i18n.localize(myActor.system.skill.moondicetypes[rMoon._total - 1]),
        theresult: rMoon._total,
      };
      console.log("smartMoonData avant retour func = ", smartMoonData);
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
  
      return;
    }
    


    let template = "";
    let myTitle = game.i18n.localize("CEL1922.ThrowDice");
    let myDialogOptions = {};
    let myNumberOfDice = 2;
    let mySkill = parseInt(skillNumUsedLibel);
    let myAnomaly = myActor.system.anomaly;
    let myAspect = 0;
    let myAspect_value = 2;
    let myBonus = 2;
    let myMalus = -2;
    let myWounds = myActor.system.blessures.lvl;
    let myDestiny = myActor.system.destin.lvl;
    let mySpleen = myActor.system.spleen.lvl;


    if (myPromptPresent === true) {

      let myResultDialog =  await _skillDiceRollDialog(
        myActor, template, myTitle, myDialogOptions, myNumberOfDice,
        mySkill, myAnomaly, myAspect, myAspect_value, myBonus, myMalus,
        myWounds, myDestiny, mySpleen, myTypeOfThrow
      );

      if (myResultDialog === null) {
        return;
      };

      myNumberOfDice = parseInt(myResultDialog.numberofdice);
      mySkill = parseInt(myResultDialog.skill);
      myAnomaly = parseInt(myResultDialog.anomaly);
      myAspect = parseInt(myResultDialog.aspect);
      myAspect_value = parseInt(myResultDialog.aspectvalue);
      myBonus = parseInt(myResultDialog.bonus);
      myMalus = parseInt(myResultDialog.malus);
      myWounds = parseInt(myResultDialog.jaugewounds);
      myDestiny = parseInt(myResultDialog.jaugedestiny);
      mySpleen = parseInt(myResultDialog.jaugespleen);
      myTypeOfThrow = parseInt(myResultDialog.typeofthrow);

    };


    myRoll = myNumberOfDice+"d8";

    const r = new Roll(myRoll, this.actor.getRollData());
    await r.evaluate();
    console.log(r);

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

    let specialityLibel = game.i18n.localize(myActor.system.skill.skilltypes[mySkill]);
    let specialityTab = specialityLibel.split(' ');
    if (specialityTab[0] == "·") {
      specialityLibel = specialityLibel.substr(2);
    }

    // Smart Message
    const smartTemplate = 'systems/celestopol1922/templates/form/dice-result.html';
    const smartData = {
      numberofdice: myNumberOfDice,
      speciality: specialityLibel
    }
    console.log("smartData avant retour func = ", smartData);
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

  /* -------------------------------------------- */

    async function _whichTypeOfThrow (myActor, myTypeOfThrow) {
    // Render modal dialog
    const template = 'systems/celestopol1922/templates/form/type-throw-prompt.html';
    const title = game.i18n.localize("CEL1922.TypeOfThrowTitle");
    let dialogOptions = "";
    var choice = 0;
    var dialogData = {
      choice: myTypeOfThrow,
      check: myActor.system.prefs.typeofthrow.check
      // check: true
    };
    console.log(dialogData);
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
        width: 520,
        height: 180
      });
    });

    if (prompt != null) {
    return choice;
    } else {
      return parseInt(dialogData.choice);
    };


    async function _computeResult(myActor, myHtml) {
      console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      console.log("choice = ", choice);
      const isChecked = myHtml.find("input[name='check']").is(':checked');
      console.log("isChecked = ", isChecked);
      myActor.update({"system.prefs.typeofthrow.check": isChecked});
      return choice;
    }
  }
}
}

/* -------------------------------------------- */

async function _skillDiceRollDialog(
  myActor, template, myTitle, myDialogOptions, myNumberOfDice,
  mySkill, myAnomaly, myAspect, myAspect_value, myBonus, myMalus,
  myWounds, myDestiny, mySpleen, myTypeOfThrow
) {
  // Render modal dialog
  template = template || 'systems/celestopol1922/templates/form/skill-dice-prompt.html';
  const title = myTitle;


  ///////////////////////////////////////////////////////////////
  const dialogOptions = await _getDataSkill(myActor);
  console.log("dialogOptions = ", dialogOptions)
  ///////////////////////////////////////////////////////////////
  
  
  var dialogData = {
    numberofdice: myNumberOfDice.toString(),
    skill: mySkill.toString(),
    anomaly: myAnomaly.toString(),
    aspect: myAspect.toString(),
    aspectvalue: myAspect_value,
    bonus: myBonus.toString(),
    malus: myMalus.toString(),
    jaugewounds: myWounds.toString(),
    jaugedestiny: myDestiny.toString(),
    jaugespleen: mySpleen.toString(),
    typeofthrow: myTypeOfThrow.toString()

  };
  console.log("dialogData avant retour func = ", dialogData);
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
      height: 540
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.numberofdice = myHtml.find("select[name='numberofdice']").val();
    myDialogData.skill = myHtml.find("select[name='skill']").val();
    myDialogData.anomaly = myHtml.find("select[name='anomaly']").val();
    myDialogData.aspect = myHtml.find("select[name='aspect']").val();
    myDialogData.aspect_value = myHtml.find("select[name='aspect_value']").val();
    myDialogData.bonus = myHtml.find("input[name='bonus']").val();
    myDialogData.malus = myHtml.find("input[name='malus']").val();
    myDialogData.jaugewounds = myHtml.find("input[name='jauge_wounds']").val();
    myDialogData.jaugedestiny = myHtml.find("input[name='jauge_destiny']").val();
    myDialogData.jauge_spleen = myHtml.find("input[name='jauge_spleen']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

  /* -------------------------------------------- */

  async function _getDataSkill(myActor) {

    const menuSkill = myActor.system.skill.skilltypes;
    const menuAnomaly = myActor.system.skill.anomalytypes;
    const menuAspect = myActor.system.skill.aspecttypes;
    const menuJaugeWounds = myActor.system.skill.woundstypes;
    const menuJaugeDestiny = myActor.system.skill.destinytypes;
    const menuJaugeSpleen = myActor.system.skill.spleentypes;

    console.log("menuSkill", menuSkill);

    const sizeMenuSkill = menuSkill.length;
    const sizeMenuAnomaly = menuAnomaly.length;
    const sizeMenuAspect = menuAspect.length;
    const sizeMenuJaugeWounds = menuJaugeWounds.length;
    const sizeMenuJaugeDestiny = menuJaugeDestiny.length;
    const sizeMenuJaugeSpleen = menuJaugeSpleen.length;

    console.log("sizeMenuSkill", sizeMenuSkill);


    let mySkill = {};
    let myAnomaly = {};
    let myAspect = {};
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

    console.log("mySkill", mySkill);

    for (let i=0; i<sizeMenuAnomaly; i++) {
      myAnomaly[i.toString()] = new myObject(i.toString(), menuAnomaly[i]);
    };

    for (let i=0; i<sizeMenuAspect; i++) {
      myAspect[i.toString()] = new myObject(i.toString(), menuAspect[i]);
    };

    for (let i=0; i<sizeMenuJaugeWounds; i++) {
      myJauge_Wounds[i.toString()] = new myObject(i.toString(), menuJaugeWounds[i]);
    };

    for (let i=0; i<sizeMenuJaugeDestiny; i++) {
      myJauge_Destiny[i.toString()] = new myObject(i.toString(), menuJaugeDestiny[i]);
    };

    for (let i=0; i<sizeMenuJaugeSpleen; i++) {
      myJauge_Spleen[i.toString()] = new myObject(i.toString(), menuJaugeSpleen[i]);
    };

    const context = {
    skillchoices : mySkill,
    anomalychoices : myAnomaly,
    aspectchoices: myAspect,
    jaugewoundschoices: myJauge_Wounds,
    jaugedestinychoices: myJauge_Destiny,
    jaugespleenchoices: myJauge_Spleen
    };

    console.log("context = ", context)
    return context;
  }

}