import { CEL1922ActorSheet } from "./actor-sheet.js";
import { CEL1922 } from "../config.js";
/**
 * @extends {CEL1922ActorSheet}
 */
export class CEL1922PNJSheet extends CEL1922ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "actor", "npc"],
      template: "systems/celestopol1922/templates/actor/npc-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biography", ".items", ".attributes", ".aspects", ".anomalies"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
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
  }


  /* -------------------------------------------- */

  /**
   * Listen for click on Gear.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickPrefs (event) {
    // Render modal dialog
    const template = 'systems/celestopol1922/templates/form/npc-prefs-prompt.html';
    const title = game.i18n.localize("CEL1922.Preferences");
    let dialogOptions = "";
    var dialogData = {
      choice: this.actor.system.prefs.typeofthrow.choice,
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
        height: "auto"
      });
    });
    async function _computeResult(myActor, myHtml) {
      // console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      // console.log("choice = ", choice);
      await myActor.update({ "system.prefs.typeofthrow.choice": choice.toString() });
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
  let myMoon = 0;
  let myTypeOfThrow = parseInt(await myActor.system.prefs.typeofthrow.choice);
  let myData = await _whichMoonTypeOfThrow(myActor, myMoon, myTypeOfThrow);
  myMoon = parseInt(myData.moon);
  myTypeOfThrow = parseInt(myData.choice);
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
    let myAnomaly = myActor.system.anomaly;
    let myAspect_1 = 0;
    let myAspect_2 = 0;
    let myAspect_3 = 0;
    let myAspect_4 = 0;
    let myBonus = 0;
    let myMalus = -0;
    let myWounds = myActor.system.blessures.lvl;
    let myDestiny = myActor.system.destin.lvl;
    let mySpleen = myActor.system.spleen.lvl;


    var mySkillData = await _getSkillValueData (myActor, mySkill);
    let mySpecialityLibel = mySkillData.libel;
    let myValue = mySkillData.value;
    let myRESValue = mySkillData.rESvalue;


    if (myPromptPresent === true) {
      let myResultDialog =  await _skillDiceRollDialog(
        myActor, template, myTitle, myDialogOptions, myNumberOfDice,
        mySkill, myAnomaly, myAspect_1, myAspect_2, myAspect_3, myAspect_4, myBonus, myMalus,
        myWounds, myDestiny, mySpleen, myTypeOfThrow
      );

      if (myResultDialog === null) {
        return;
      };

      myNumberOfDice = parseInt(myResultDialog.numberofdice);
      mySkill = parseInt(myResultDialog.skill);
      myAnomaly = parseInt(myResultDialog.anomaly);
      myAspect_1 = parseInt(myResultDialog.aspect_1);
      myAspect_2 = parseInt(myResultDialog.aspect_2);
      myAspect_3 = parseInt(myResultDialog.aspect_3);
      myAspect_4 = parseInt(myResultDialog.aspect_4);
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
      let myData = await _whichMoonTypeOfThrow(myActor, myMoon, myTypeOfThrow);
      myMoon = myData.moon;
      myTypeOfThrow = myData.choice;
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
      height: "auto"
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
  mySkill, myAnomaly, myAspect_1, myAspect_2, myAspect_3, myAspect_4, myBonus, myMalus,
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
    aspect_1: myAspect_1.toString(),
    aspect_2: myAspect_2.toString(),
    aspect_3: myAspect_3.toString(),
    aspect_4: myAspect_4.toString(),
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
      height: "auto"
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
    myDialogData.aspect_1 = myHtml.find("select[name='aspect_1']").val();
    myDialogData.aspect_2 = myHtml.find("select[name='aspect_2']").val();
    myDialogData.aspect_3 = myHtml.find("select[name='aspect_3']").val();
    myDialogData.aspect_4 = myHtml.find("select[name='aspect_4']").val();
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
    let myAspect_1 = {};
    let myAspect_2 = {};
    let myAspect_3 = {};
    let myAspect_4 = {};
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

    myAnomaly["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
      myAnomaly[anomaly.id.toString()] = new myObject(anomaly.id.toString(), anomaly.name.toString());
    };
    let i = 0;
    myAspect_1["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    myAspect_2["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    myAspect_3["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    myAspect_4["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
    for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
      i++;
      switch (i) {
        case 1:
          myAspect_1[aspect.id.toString()] = new myObject(aspect.id.toString(), aspect.name.toString());
        break;
        case 2:
          myAspect_2[aspect.id.toString()] = new myObject(aspect.id.toString(), aspect.name.toString());
        break;
        case 3:
          myAspect_3[aspect.id.toString()] = new myObject(aspect.id.toString(), aspect.name.toString());
        break;
        case 4:
          myAspect_4[aspect.id.toString()] = new myObject(aspect.id.toString(), aspect.name.toString());
        default: console.log("Et un aspect surnuméraire n°", i);
        break;
      };
    };


    const context = {
    skillchoices : mySkill,
    anomalychoices : myAnomaly,
    aspectchoices_1: myAspect_1,
    aspectchoices_2: myAspect_2,
    aspectchoices_3: myAspect_3,
    aspectchoices_4: myAspect_4,
    jaugewoundschoices: myJauge_Wounds,
    jaugedestinychoices: myJauge_Destiny,
    jaugespleenchoices: myJauge_Spleen
    };

    // console.log("context = ", context)
    return context;
  }

}