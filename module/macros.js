// import { CEL1922CharacterSheet } from "./actor/character-sheet.js";
import * as CEL1922Actor from "./actor/actor.js";
// import { _onClickDiceRollFromHotbar } from "./roll-from-hotbar.js";


export default class Macros {
  /**
   * Attempt to create a macro from the dropped data. Will use an existing macro if one exists.
   * @param {object} dropData     The dropped data
   * @param {number} slot         The hotbar slot to use
   */
  static async create(dropData, slot) {
    const macroData = { type: "script", scope: "actor" }
    switch (dropData.type) {
      case "celestopol1922.lancerDeDes":

        console.log("game.system", game.system);
        

        const myActor = await game.actors.get(dropData.actorId);
        const mySkillNbr = parseInt(dropData.skillNumUsedLibel);
        let specialityLibel = await game.i18n.localize(myActor.system.skill.skilltypes[parseInt(mySkillNbr)]);
        if (specialityLibel[0] == "⌞") {
          specialityLibel = await specialityLibel.substring(2);
        };

        foundry.utils.mergeObject(macroData, {
          name: `Test pour ${game.i18n.localize(`${specialityLibel}`)} (${dropData.actorName})`,
          img: `/systems/celestopol1922/images/ui/d8_fond_transp.png`,
          command: `await game.system.api.Macros._onClickDiceRoll("${dropData.actorId}", "${dropData.skillNumUsedLibel}")`,
          flags: { "celestopol1922.macros.lancerDeDes": true },
        })
        break
      default:
        return
    }

    // Assign the macro to the hotbar
    let macro = game.macros.find((m) => m.name === macroData.name && m.command === macroData.command && m.author.isSelf)
    if (!macro) {
      macro = await Macro.create(macroData)
      game.user.assignHotbarMacro(macro, slot)
    }
  }

  static async _onClickDiceRoll(actorId, skillNumUsedLibel) {
    let actor
    if (actorId) actor = game.actors.get(actorId)
    if (!actor) return
    if (actor) {

      console.log("actor", actor)
      console.log("CEL1922Actor", CEL1922Actor)

      // await CEL1922Actor._onClickDiceRollFromHotbar(actor, skillNumUsedLibel)
      await actor._onClickDiceRollFromHotbar(actor, skillNumUsedLibel)
    }
  }
}
