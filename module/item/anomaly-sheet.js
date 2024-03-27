import { CEL1922 } from "../config.js";
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CEL1922AnomalySheet extends ItemSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "anomaly"],
      template: "systems/celestopol1922/templates/item/anomaly-sheet.html",
      width: 720,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description-technique" }],
      scrollY: [".description-technique", ".description-nattatif", ".attributes", ".notes"],
    });
  }

  
   /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.item.system;
    context.subtypes = CEL1922.SUBTYPES
    context.isWeapon = this.item.isWeapon;
    context.isArmor = this.item.isArmor;
    context.isVehicle = this.item.isVehicle;
    context.isOther = this.item.isOther;
    context.techniqueHTML = await TextEditor.enrichHTML(this.item.system.technique, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.narratifHTML = await TextEditor.enrichHTML(this.item.system.narratif, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.notesHTML = await TextEditor.enrichHTML(this.item.system.notes, {
      secrets: this.document.isOwner,
      async: true,
    });
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
  }
}
