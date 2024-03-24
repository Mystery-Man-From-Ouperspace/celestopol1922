import { CEL1922ActorSheet } from "./actor-sheet.js";
/**
 * @extends {CEL1922ActorSheet}
 */
export class CEL1922LoksyuSheet extends CEL1922ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "actor", "loksyu"],
      template: "systems/celestopol1922/templates/actor/loksyu-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "loksyu"}],
      scrollY: [".description"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    return context;
  }
}
