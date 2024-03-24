import { CEL1922ActorSheet } from "./actor-sheet.js";
/**
 * @extends {CEL1922ActorSheet}
 */
export class CEL1922TinJiSheet extends CEL1922ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "actor", "tinji"],
      template: "systems/celestopol1922/templates/actor/tinji-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "tinji"}],
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
