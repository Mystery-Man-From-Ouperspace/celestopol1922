import { ModifiedDialog } from "../modified-dialog.js";

/**
 * @extends {Actor}
 */
export class CEL1922Actor extends Actor {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  /* -------------------------------------------- */
  /*  Roll Data Preparation                       */
  /* -------------------------------------------- */

  /** @inheritdoc */
  getRollData() {

    // Copy the actor's system data
    const data = this.toObject(false).system;
   
    return data;
  }

  prepareBaseData() {
    if (this.type === "npc") {// patch pour les anciennes version des fiches de pnj
      this.system.skill.woundsmalus[8] = -999;

      const lvlBlessures = parseInt(this.system.blessures.lvl);
      const malusBlessures = parseInt(this.system.skill.woundsmalus[lvlBlessures]);
      
      let ame = this.system.skill.ame.res;
      let ameVal = 0;
      if (ame != null) {
        ameVal = parseInt(ame);
      }
      if (ameVal + malusBlessures >= 0) {
        this.system.skill.ame.actuel = ameVal + malusBlessures;
      } else {
        this.system.skill.ame.actuel = 0;
      }
      
      let corps = this.system.skill.corps.res;
      let corpsVal = 0;
      if (corps != null) {
        corpsVal = parseInt(corps);
      }
      if (corpsVal + malusBlessures >= 0) {
        this.system.skill.corps.actuel = corpsVal + malusBlessures;
        this.system.initiative = corpsVal + malusBlessures;
      } else {
        this.system.skill.corps.actuel = 0;
        this.system.initiative = 0;
      }

      let coeur = this.system.skill.coeur.res;
      let coeurVal = 0;
      if (coeur != null) {
        coeurVal = parseInt(coeur);
      }
      if (coeurVal + malusBlessures >= 0) {
        this.system.skill.coeur.actuel = coeurVal + malusBlessures;
      } else {
        this.system.skill.coeur.actuel = 0;
      }

      let esprit = this.system.skill.esprit.res;
      let espritVal = 0;
      if (esprit != null) {
        espritVal = parseInt(esprit);
      }
      if (espritVal + malusBlessures >= 0) {
        this.system.skill.esprit.actuel = espritVal + malusBlessures;
      } else {
        this.system.skill.esprit.actuel = 0;
      }
    }

    if (this.type === "character") { // patch pour les anciennes versions des fiches de pj
      this.system.skill.woundsmalus[8] = -999;

      const lvlBlessures = parseInt(this.system.blessures.lvl);
      const malusBlessures = parseInt(this.system.skill.woundsmalus[lvlBlessures]);
      let init = 4 + this.system.skill.corps.mobilite.value + this.system.skill.coeur.inspiration.value + malusBlessures;
      if (init < 0) init = 0;
      this.system.initiative = init;
    }
  }




  async _onClickDiceRollFromHotbar(myActor, skillNumUsedLibel) {


    let myTypeOfThrow = parseInt(await myActor.system.prefs.typeofthrow.choice);
    let myPromptPresent = await game.settings.get("celestopol1922", "usePromptsForAutomatization");
    let myRoll;
    var msg;


    let template = "";
    let myTitle = game.i18n.localize("CEL1922.ThrowDice");
    let myDialogOptions = {};

    let Skill = parseInt(skillNumUsedLibel);
    let mySkillData = await _getSkillValueData (myActor, Skill);

    let myArmor = myActor.system.prefs.lastarmorusedid;

    let armorVal = 0;
    for (let item of myActor.items.filter(item => item.type === 'item')) {
      // if (item.system.subtype == "armor") {
        if (item.id === myArmor) {
          armorVal = item.system.protection;
        };
      // };
    };


    let myData = {
      myUserID: game.user.id,
      myActorID: myActor.id,
      myTypeOfThrow: myTypeOfThrow,
      myPromptPresent: myPromptPresent,
      myNumberOfDice: 2,
      mySkill: Skill,
      myAnomaly: 0,
      myAspect: 0,
      myBonusAspect: 1, // +
      myAttribute: 0,
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
      myArmorVal: armorVal,

      opponentName: "",
      opponentID: "0",
      weaponOpponentVal: 0,
      armorOpponentVal: 0,
    }


    myData.myWoundsMalus = parseInt(await myActor.system.skill.woundsmalus[parseInt(myData.myWounds)]);
    if (parseInt(myData.myWounds) === 8) {
      ui.notifications.error(game.i18n.localize("CEL1922.ErrYoureOutOfGame"));
      return;
    }

    console.log("myWoundsMalus = ", myData.myWoundsMalus);


    myData.totalBoni = myData.myValue + myData.myRESValue + myData.myWoundsMalus - myData.myArmorVal;






    if (myPromptPresent) {
      let myResultDialog =  await _skillDiceRollDialog(
        myActor, template, myTitle, myDialogOptions, myData.myNumberOfDice,
        myData.mySkill, myData.myAnomaly, myData.myAspect, myData.myBonusAspect,
        myData.myAttribute, myData.myBonus, myData.myMalus,
        myData.myWounds, myData.myDestiny, myData.mySpleen, myData.myArmorEncumbrance, myData.myTypeOfThrow, myData.totalBoni
      );


      //////////////////////////////////////////////////////////////////
      if (!(myResultDialog)) {
        ui.notifications.warn(game.i18n.localize("CEL1922.Error111"));
        return;
        };
      //////////////////////////////////////////////////////////////////


      myData.myNumberOfDice = parseInt(myResultDialog.numberofdice);
      myData.mySkill = parseInt(myResultDialog.skill);
      myData.myAnomaly = myResultDialog.anomaly;
      myData.myAspect = myResultDialog.aspect;
      myData.myBonusAspect = parseInt(myResultDialog.bonusaspect);
      myData.myAttribute = myResultDialog.attribute;
      myData.myBonus = parseInt(myResultDialog.bonus);
      myData.myMalus = parseInt(myResultDialog.malus);
      myData.myWounds = myResultDialog.jaugewounds;
      myData.myDestiny = myResultDialog.jaugedestiny;
      myData.mySpleen = myResultDialog.jaugespleen;
      myData.myArmorEncumbrance = myResultDialog.armor;
      myData.myTypeOfThrow = parseInt(myResultDialog.typeofthrow);
      myData.totalBoni = parseInt(myResultDialog.totalscoresbonusmalus);

      if (parseInt(myData.myWounds) === 8) {
        ui.notifications.error(game.i18n.localize("CEL1922.ErrYoureOutOfGame"));
        return;
      }

      let mySkillData = await _getSkillValueData (myActor, myData.mySkill);
      myData.mySpecialityLibel = mySkillData.libel;
      myData.myValue = mySkillData.value;
      myData.myRESValue = mySkillData.rESvalue;
    };


    var opponentActor = null;
    if (myPromptPresent  && myData.mySkill == 6) {
      var myTarget = await _whichTarget (myActor, myData.mySpecialityLibel);


      //////////////////////////////////////////////////////////////////
      if (!(myTarget)) {
        ui.notifications.warn(game.i18n.localize("CEL1922.Error111"));
        return;
        };
      //////////////////////////////////////////////////////////////////


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


      //////////////////////////////////////////////////////////////////
      if (!(myTestData)) {
        ui.notifications.warn(game.i18n.localize("CEL1922.Error111"));
        return;
        };
      //////////////////////////////////////////////////////////////////


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


      //////////////////////////////////////////////////////////////////
      if (!(myDamageData)) {
        ui.notifications.warn(game.i18n.localize("CEL1922.Error111"));
        return;
        };
      //////////////////////////////////////////////////////////////////


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
    
      let numberOfErrors = 0;


      // Traiter ici les autres boni / mali et paramètres

      // test, opposition, modifier, myinventory, selectedinventory, damage

      if (numberOfErrors) {
        ui.notifications.error(game.i18n.localize("CEL1922.Error999"));
        return;
      }
      
    };

    console.log("totalBoni : ", myData.totalBoni);

    // Traite la perte d'un point d'Attribut Fortune en cas d'utilisation pour remplacer 2d8 par 1d8+8
    if (myData.myNumberOfDice === 8) {
      const myFortune = myActor.system.attributs.fortune;
      if (!myFortune) {
        //////////////////////////////////////////////////////////////////
        ui.notifications.warn(game.i18n.localize("CEL1922.ErrFortuneAZero"));
        //////////////////////////////////////////////////////////////////

        myData.myNumberOfDice = 2; // On annule et on lance plutôt 2d8
      } else {
        //////////////////////////////////////////////////////////////////
        ui.notifications.info(game.i18n.localize("CEL1922.InfoFortune"));
        //////////////////////////////////////////////////////////////////

        await myActor.update({ "system.attributs.fortune": myFortune - 1 });
      }
    };

    if (myData.totalBoni == 0) {
      if (myData.myNumberOfDice === 7) {
        myRoll = "0d8+7";
      } else if (myData.myNumberOfDice === 8) {
        myRoll = "1d8+8";
      } else {
        myRoll = myData.myNumberOfDice+"d8";
      }
    };

    if (myData.totalBoni > 0) {
      if (myData.myNumberOfDice === 7) {
        myRoll = "0d8+7+" + (myData.totalBoni).toString();;
      } else if (myData.myNumberOfDice === 8) {
        myRoll = "1d8+8+" + (myData.totalBoni).toString();
      } else {
        myRoll = myData.myNumberOfDice+"d8+" + (myData.totalBoni).toString();
      }
    };
    
    if (myData.totalBoni < 0) {
      if (myData.myNumberOfDice === 7) {
        myRoll = "0d8+7-" + + Math.abs(myData.totalBoni).toString();
      } else if (myData.myNumberOfDice === 8) {
        myRoll = "1d8+8-" + Math.abs(myData.totalBoni).toString();
      } else {
        myRoll = myData.myNumberOfDice+"d8-" + Math.abs(myData.totalBoni).toString();
      }
    };

    let r;
    if (myModifier != 999) {
      r = new Roll(myRoll, myActor.getRollData());
      await r.evaluate();
    } else {
      ui.notifications.warn(game.i18n.localize("CEL1922.Evident"));
    };

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


      const mySkill = parseInt(myData.mySkill);
      let dataMySkill =  await _getSkillValueData (myActor, mySkill);

      const libelJaugeWounds = myActor.system.skill.woundstypes;
      const malusJaugeWounds = myActor.system.skill.woundsmalus;
      const libelJaugeDestiny = myActor.system.skill.destinytypes;
      // const malusJaugeDestiny = myActor.system.skill.destinymalus;
      const libelJaugeSpleen = myActor.system.skill.spleentypes;
      // const malusJaugeSpleen = myActor.system.skill.spleenmalus;


      let dataWounds = malusJaugeWounds[parseInt(myData.myWounds)];
      let titleWounds = game.i18n.localize(libelJaugeWounds[parseInt(myData.myWounds)]);

      let dataSpleen = game.i18n.localize("CEL1922.opt.none");
      let titleSpleen = game.i18n.localize(libelJaugeSpleen[parseInt(myData.mySpleen)]);

      let dataDestiny = game.i18n.localize("CEL1922.opt.none");
      let titleDestiny = game.i18n.localize(libelJaugeDestiny[parseInt(myData.myDestiny)]);

      let titleAnomaly = game.i18n.localize("CEL1922.opt.none");
      let dataAnomaly = game.i18n.localize("CEL1922.opt.none");
      for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
        if (myData.myAnomaly == anomaly.id) {
          titleAnomaly = anomaly.name.toString();
          // dataAnomaly = (anomaly.system.value);
          // dataAnomaly = game.i18n.localize("CEL1922.opt.none");
          /*
          if (myData.myBonusAnomaly) {
            dataAnomaly *= -1;
          }
          */
        };
      };
    
      let titleAspect = game.i18n.localize("CEL1922.opt.none");
      let dataAspect = 0;
      for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
        if (myData.myAspect == aspect.id) {
          titleAspect = aspect.name.toString();
          dataAspect = parseInt(aspect.system.value);
          if (myData.myBonusAspect) {
            dataAspect *= -1;
          }
        };
      };

      /*
      let titleAttribute = game.i18n.localize("CEL1922.opt.none");
      let dataAttribute= game.i18n.localize("CEL1922.opt.none");
      for (let attribute of myActor.items.filter(item => item.type === 'attribute')) {
        if (myData.myAttribute == attribute.id) {
          titleAttribute = attribute.name.toString();
          // dataAttribute = parseInt(attribute.system.value);
          // dataAttribute = game.i18n.localize("CEL1922.opt.none");
          // if (myData.myBonusAttribute) {
          //   dataAttribute *= -1;
          // }
        };
      };
      */

      let titleArmor = game.i18n.localize("CEL1922.opt.none");
      let dataArmor = 0;
      for (let armor of myActor.items.filter(item => item.type === 'item')) {
        if (myData.myArmorEncumbrance == armor.id) {
          titleArmor = armor.name.toString();
          dataArmor = parseInt(armor.system.protection);
          dataArmor *= -1;
        };
      };
      
      
      const numberofdice = (myData.myNumberOfDice).toString()+"d8";

      mySmartRData = {
        title: titleSmartR,

        relance: true,

        typeofthrow: myData.myTypeOfThrow,
        numberofdice: myData.myNumberOfDice,
        skill: myData.mySkill,
        bonus: myData.totalBoni,
        rolldifficulty: parseInt(myOpposition),

        test: myTest,
        specialitylibel: myData.mySpecialityLibel,
        mymodifier: myModifier, 


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

        dataNbrDice: numberofdice,
        titleDomain: dataMySkill.domainLibel,
        dataDomain: dataMySkill.rESvalue,
        titleSpeciality: dataMySkill.libel,
        dataSpeciality: parseInt(dataMySkill.value),
        titleAnomaly: titleAnomaly,
        dataAnomaly: dataAnomaly,
        titleAspect: titleAspect,
        dataAspect: dataAspect,
        dataBonus: myData.myBonus,
        dataMalus: myData.myMalus,
        dataMoreBonusMalus: 0,
        titleArmor: titleArmor,
        dataArmor: dataArmor,
        titleWounds: titleWounds,
        dataWounds: dataWounds,
        titleDestiny: titleDestiny,
        dataDestiny: dataDestiny,
        titleSpleen: titleSpleen,
        dataSpleen: dataSpleen,

        numSpeciality: myData.mySkill

      }

      console.log("mySmartRData = ", mySmartRData);

    } else {
      let titleSmartR = game.i18n.localize("CEL1922.Test") + myRoll;
      mySmartRTemplate = 'systems/celestopol1922/templates/form/dice-result-just-title.html';
      mySmartRData = {
        typeofthrow: myData.myTypeOfThrow,

        yourplayerid: myData.myUserID,
        youractorid: myData.myActorID,

        mymodifier: myModifier, 
        title: titleSmartR,
        numSpeciality: myData.mySkill
      };
    };

    await _showMessagesInChat (myActor, myData.myTypeOfThrow, r, mySmartRTemplate, mySmartRData, mySmartTemplate, mySmartData, false);


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
      console.log('game.user.targets = ', game.user.targets);
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
          height: "auto"
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
                icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Cancel')}</span></div>`,
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

      if (prompt == null) {
        dialogData = null;
      };

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
                icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CEL1922.Cancel')}</span></div>`,
                callback: (html) => resolve(null)
              }
            },
            default: 'validateBtn',
            close: () => resolve(null)
          },
          dialogOptions
        ).render(true, {
          width: 550,
          height: "auto"
        });
      });

      if (prompt == null) {
        dialogData = null;
      };

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
      const cinq = parseInt(5);
      let myStringVal;
      let myStringRES;

      let domainLibel = await game.i18n.localize(myActor.system.skill.skilltypes[Math.trunc(mySkill / cinq) * cinq]);
      let specialityLibel = await game.i18n.localize(myActor.system.skill.skilltypes[mySkill]);
      let specialityTab = await specialityLibel.split(' ');
      if (specialityTab[0] == "⌞") {
        specialityLibel = await specialityLibel.substring(2);
      };

      switch (mySkill) {
        case 0:
          myStringVal = await myActor.system.skill.ame.res;
          myStringRES = myStringVal;
        break;
        case 1:
          myStringVal = await myActor.system.skill.ame.artifice.value;
          myStringRES = await myActor.system.skill.ame.res;
        break;
        case 2:
          myStringVal = await myActor.system.skill.ame.attraction.value;
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
          myStringVal = await myActor.system.skill.corps.mobilite.value;
          myStringRES = await myActor.system.skill.corps.res;
        break;
        case 9: 
          myStringVal = await myActor.system.skill.corps.prouesse.value;
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
        domainLibel: domainLibel,
        libel: specialityLibel,
        value: myValue,
        rESvalue: myRESValue
      };

      // console.log("myData = ", myData);

      return myData;
    }



    /* -------------------------------------------- */


    async function _skillDiceRollDialog(
      myActor, template, myTitle, myDialogOptions, myNumberOfDice,
      mySkill, myAnomaly, myAspect, myBonusAspect, myAttribute, myBonus, myMalus,
      myWounds, myDestiny, mySpleen, myArmor, myTypeOfThrow, myTotalScoresBonusMalus
    ) {
      // Render modal dialog
      template = template || 'systems/celestopol1922/templates/form/skill-dice-prompt.html';
      const title = myTitle;


      ///////////////////////////////////////////////////////////////
      const dialogOptions = await _getDataSkill(myActor);
      // console.log("dialogOptions = ", dialogOptions)
      ///////////////////////////////////////////////////////////////

      console.log("myActor.id = ", myActor.id);
      let myActorID = myActor.id;
      
      var dialogData = {
        numberofdice: myNumberOfDice.toString(),
        skill: mySkill.toString(),
        anomaly: myAnomaly.toString(),
        aspect: myAspect.toString(),
        attribute: myAttribute.toString(),
        bonusaspect: myBonusAspect.toString(),
        bonus: myBonus.toString(),
        malus: myMalus.toString(),
        jaugewounds: myWounds.toString(),
        jaugedestiny: myDestiny.toString(),
        jaugespleen: mySpleen.toString(),
        armor: myArmor.toString(),
        typeofthrow: myTypeOfThrow.toString(),
        totalscoresbonusmalus: myTotalScoresBonusMalus.toString(),
        actorID: myActorID.toString()
      };
      console.log("actorID = ", dialogData.actorID);
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
                callback: (html) => resolve( dialogData = _computeResult(myActorID, dialogData, html) )
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
          width: 515,
          height: "auto"
        });
      });

      if (prompt == null) {
        dialogData = null;
      };

      return dialogData;

      async function _computeResult(myActorID, myDialogData, myHtml) {
        // console.log("J'exécute bien _computeResult()");

        // console.log("J'exécute bien _computeResult()");
        myDialogData.numberofdice = myHtml.find("select[name='numberofdice']").val();
        myDialogData.skill = myHtml.find("select[name='skill']").val();
        myDialogData.anomaly = myHtml.find("select[name='anomaly']").val();
        myDialogData.aspect = myHtml.find("select[name='aspect']").val();
        myDialogData.bonusaspect = myHtml.find("select[name='bonusaspect']").val();
        myDialogData.attribute = myHtml.find("select[name='attribute']").val();
        myDialogData.bonus = myHtml.find("select[name='bonus']").val();
        myDialogData.malus = myHtml.find("select[name='malus']").val();
        myDialogData.jaugewounds = myHtml.find("select[name='jaugewounds']").val();
        myDialogData.jaugedestiny = myHtml.find("select[name='jaugedestiny']").val();
        myDialogData.jaugespleen = myHtml.find("select[name='jaugespleen']").val();
        myDialogData.armor = myHtml.find("select[name='armor']").val();
        myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();

        let myActor = game.actors.get(myActorID);

        let totalscoresbonusmalus = 0;

        let skill_score = await _getSkillValueData (myActor, myDialogData.skill);
        totalscoresbonusmalus += skill_score;

        /*
        let bonusanomaly_score = parseInt(myDialogData.bonusanomaly) ? -1 : 1 ;
        let anomaly_score = 0;
        if (myDialogData.anomaly != 0) {
          anomaly_score = await _getAnomalyValueData (myActor, myDialogData.anomaly);
        };
        anomaly_score = anomaly_score * parseInt(bonusanomaly_score);
        totalscoresbonusmalus += anomaly_score;
        */

        let bonusaspect_score = parseInt(myDialogData.bonusaspect) ? -1 : 1 ;
        let aspect_score = 0;
        if (myDialogData.aspect != 0) {
          aspect_score = await _getAspectValueData (myActor, myDialogData.aspect);
        };
        aspect_score = aspect_score * parseInt(bonusaspect_score);
        totalscoresbonusmalus += aspect_score;

        /*
        let bonusattribute_score = parseInt(myDialogData.bonusattribute) ? -1 : 1 ;
        let attribute_score = 0;
        if (myDialogData.attribute_score != 0) {
          attribute_score = await _getAttributeValueData (myActor, myDialogData.attribute);
        };
        attribute_score = attribute_score * parseInt(bonusattribute_score);
        totalscoresbonusmalus += attribute_score;
        */

        totalscoresbonusmalus += (parseInt(myDialogData.bonus) + parseInt(myDialogData.malus));

        let armor_score = 0;
        if (myDialogData.armor != 0) {
          armor_score = await _getArmorValueData (myActor, myDialogData.armor);
        };
        totalscoresbonusmalus += -(armor_score);

        let jaugewounds_score = 0;
        jaugewounds_score = parseInt(await _getJaugeWoundsValueData (myActor, myDialogData.jaugewounds));
        totalscoresbonusmalus += jaugewounds_score;
        /*
        let jaugedestiny_score = 0;
        jaugedestiny_score = await _getJaugeDestinyValueData (myActor, myDialogData.jaugedestiny);
        totalscoresbonusmalus += jaugedestiny_score
        let jaugespleen_score = 0;
        jaugespleen_score = await _getJaugeSpleenValueData (myActor, myDialogData.jaugespleen);
        totalscoresbonusmalus += jaugespleen_score;
        */

        myDialogData.totalscoresbonusmalus = totalscoresbonusmalus;

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
        /*
        let myAttribute = {};
        */
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
        for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
          compt++;
          if (compt <= 1) {
          myAnomaly[anomaly.id.toString()] = new myObject(anomaly.id.toString(), anomaly.name.toString());
          };
        };
        if (!compt) {
          myAnomaly["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));

        }
        compt = 0;
        myAspect["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
        for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
          compt++;
          if (compt <= 4) {
            myAspect[aspect.id.toString()] = new myObject(aspect.id.toString(), aspect.name.toString());
          };
        };
        /*
        myAttribute["0"] = new myObject("0", game.i18n.localize("CEL1922.opt.none"));
        myAttribute["1"] = new myObject("1", game.i18n.localize("CEL1922.utiliserFortune").replace("^0", myActor.system.attributs.fortune));
        */
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
        aspectchoices: myAspect,
        bonusaspect: '1',
        /*
        attributechoices: myAttribute,
        */
        armorchoices: myArmor,
        jaugewoundschoices: myJauge_Wounds,
        jaugedestinychoices: myJauge_Destiny,
        jaugespleenchoices: myJauge_Spleen
        };

        // console.log("context = ", context)
        return context;
      }

      /* -------------------------------------------- */

      async function _getSkillValueData (myActor, mySkillNbr) {

        const mySkill = parseInt(mySkillNbr);
        let myStringVal;
        let myStringRES;

        let specialityLibel = await game.i18n.localize(myActor.system.skill.skilltypes[parseInt(mySkillNbr)]);
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
            myStringVal = await myActor.system.skill.ame.artifice.value;
            myStringRES = await myActor.system.skill.ame.res;
            break;
          case 2:
            myStringVal = await myActor.system.skill.ame.attraction.value;
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
            myStringVal = await myActor.system.skill.corps.mobilite.value;
            myStringRES = await myActor.system.skill.corps.res;
          break;
          case 9: 
            myStringVal = await myActor.system.skill.corps.prouesse.value;
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

        let myData = myValue;
        if (mySkill % 5) myData = myValue + myRESValue;

        // console.log("myData = ", myData);

        return myData;
      }
      
      async function _getAnomalyValueData (myActor, myAnomaly) {
        let myAnomalyVal = 0;
        for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
          if (anomaly.id === myAnomaly) {
            myAnomalyVal = anomaly.system.value;
          };
        };

        return myAnomalyVal;
      }

      async function _getAspectValueData (myActor, myAspect) {
        let myAspectVal = 0;
        for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
          if (aspect.id === myAspect) {
            myAspectVal = aspect.system.value;
          };
        };

        return myAspectVal;
      }

      async function _getAttributeValueData (myActor, myAttribute) {
        let myAttributeVal = 0;
        for (let attribute of myActor.items.filter(item => item.type === 'attribute')) {
          if (attribute.id === myAttribute) {
            myAttributeVal = attribute.system.value;
          };
        };

        return myAttributeVal;
      }

      async function _getArmorValueData (myActor, myArmor) {
        let myArmorVal = 0;
        for (let item of myActor.items.filter(item => item.type === 'item')) {
          // if (item.system.subtype == "armor") {
            if (item.id === myArmor) {
              myArmorVal = item.system.protection;
            };
          // };
        };

        return myArmorVal;
      }

      async function _getJaugeWoundsValueData (myActor, myjaugeWounds) {
        let myjaugeWoundsVal = 0;

        myjaugeWoundsVal = parseInt(await myActor.system.skill.woundsmalus[parseInt(myjaugeWounds)]);

        return myjaugeWoundsVal;
      }

      async function _getJaugeDestinyValueData (myActor, myjaugeDestiny) {
        let myjaugeDestinyVal = 0;

        return myjaugeDestinyVal;
      }

      async function _getJaugeSpleenValueData (myActor, myjaugeSpleen) {
        let myjaugeSpleenVal = 0;

        return myjaugeSpleenVal;
      }

    }

    /* -------------------------------------------- */

    async function _showMessagesInChat (myActor, myTypeOfThrow, r, mySmartRTemplate, mySmartRData, mySmartTemplate, mySmartData, myMoon) {

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
    }

  }

}
