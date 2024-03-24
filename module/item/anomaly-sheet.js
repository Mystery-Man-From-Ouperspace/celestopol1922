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
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".description", ".technique1", ".technique2", ".technique3", ".notes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.item.system;
    context.descriptionHTML = await TextEditor.enrichHTML(this.item.system.description, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.descriptionTechnique1HTML = await TextEditor.enrichHTML(this.item.system.techniques.technique1.technique, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.descriptionTechnique2HTML = await TextEditor.enrichHTML(this.item.system.techniques.technique2.technique, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.descriptionTechnique3HTML = await TextEditor.enrichHTML(this.item.system.techniques.technique3.technique, {
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
