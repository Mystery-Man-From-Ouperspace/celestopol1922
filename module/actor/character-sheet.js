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
    html.find(".click2").click(this._onClickDieRoll.bind(this));
    html.find(".click-prefs").click(this._onClickPrefs.bind(this));
  }

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
        width: 520,
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



  /**
   * Listen for roll buttons on Clickable d10.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickDieRoll(event) {

    let myRoll = "2d8";
    let typeOfThrow = 0;

    const r = new Roll(myRoll, this.actor.getRollData());
    await r.evaluate();
    console.log(r);

    var msg;
    switch ( typeOfThrow ) {
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
      });As
      break;
      case 3: msg = await r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'selfroll'                      // Self Roll
      });
      break;
      default: console.log("C'est bizarre !");
    };

    // Smart Message
    const smartTemplate = 'systems/celestopol1922/templates/form/dice-result.html';
    const smartData = {
    }
    console.log("smartData avant retour func = ", smartData);
    const smartHtml = await renderTemplate(smartTemplate, smartData);
  
    switch ( typeOfThrow ) {
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



    switch ( typeOfThrow ) {
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

async function _skillDiceRollDialog(myActor, template, myTitle, myDialogOptions, myNumberOfDice, myIsSpecial, myAspect, myBonus, myBonusAuspiciousDice, myTypeOfThrow) {
  // Render modal dialog
  template = template || 'systems/celestopol1922/templates/form/skill-dice-prompt.html';
  const title = myTitle;
  let dialogOptions = myDialogOptions;
  let isspecial = myIsSpecial;
  var dialogData = {
    numberofdice: myNumberOfDice,
    aspect: myAspect.toString(),
    bonusmalus: myBonus,
    bonusauspiciousdice: myBonusAuspiciousDice.toString(),
    typeofthrow: myTypeOfThrow.toString()
  };
  console.log("dialogData avant retour func = ", dialogData);
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
      width: 520,
      height: 375
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.aspect = myHtml.find("select[name='aspect']").val();
    myDialogData.bonusmalus = myHtml.find("input[name='bonusmalus']").val();
    myDialogData.bonusauspiciousdice = myHtml.find("select[name='bonusauspiciousdice']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

}

async function _skillSpecialDiceRollDialog(myActor, template, myTitle, myDialogOptions, myNumberOfDice, myIsSpecial, myAspect, myBonus, myBonusAuspiciousDice, myTypeOfThrow) {
  // Render modal dialog
  template = template || 'systems/celestopol1922/templates/form/skill-special-dice-prompt.html';
  const title = myTitle;
  let dialogOptions = myDialogOptions;
  let isspecial = myIsSpecial;
  var dialogData = {
    numberofdice: myNumberOfDice,
    aspect: myAspect.toString(),
    bonusmalus: myBonus,
    bonusauspiciousdice: myBonusAuspiciousDice.toString(),
    typeofthrow: myTypeOfThrow.toString()
  };
  console.log("dialogData avant retour func = ", dialogData);
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
            callback: (html) => resolve( dialogData = _computeResult(dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Cancel')}</span></div>`,
            callback: (html) => (resolve) => { dialogData = null }
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 520,
      height: 375
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.aspect = myHtml.find("select[name='aspect']").val();
    myDialogData.bonusmalus = myHtml.find("input[name='bonusmalus']").val();
    myDialogData.bonusauspiciousdice = myHtml.find("select[name='bonusauspiciousdice']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val().toString();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

}

async function _magicDiceRollDialog(myActor, template, myTitle, myDialogOptions, myNumberOfDice, myIsSpecial, myAspectSkill, myBonusMalusSkill, myBonusAuspiciousDice,
  myAspectSpecial, myRollDifficulty, myBonusMalusSpecial, myTypeOfThrow) {
  // Render modal dialog
  template = template || 'systems/celestopol1922/templates/form/magic-dice-prompt.html';
  const title = myTitle;
  let dialogOptions = myDialogOptions;
  let isspecial = myIsSpecial;
  var dialogData = {
    numberofdice: myNumberOfDice,
    aspectskill: myAspectSkill.toString(),
    bonusmalusskill: myBonusMalusSkill,
    bonusauspiciousdice: myBonusAuspiciousDice.toString(),
    aspectspeciality: myAspectSpecial.toString(),
    rolldifficulty: myRollDifficulty,
    bonusmalusspeciality: myBonusMalusSpecial,
    typeofthrow: myTypeOfThrow.toString()
  };
  console.log("dialogData avant retour func = ", dialogData);
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
            callback: (html) => resolve ( dialogData = _computeResult(dialogData, html) )
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
      width: 520,
      height: 530
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.aspectskill = myHtml.find("select[name='aspectskill']").val();
    myDialogData.bonusmalusskill = myHtml.find("input[name='bonusmalusskill']").val();
    myDialogData.bonusauspiciousdice = myHtml.find("select[name='bonusauspiciousdice']").val();
    myDialogData.aspectspeciality = myHtml.find("select[name='aspectspeciality']").val();
    myDialogData.rolldifficulty = myHtml.find("input[name='rolldifficulty']").val();
    myDialogData.bonusmalusspeciality = myHtml.find("input[name='bonusmalusspeciality']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

}