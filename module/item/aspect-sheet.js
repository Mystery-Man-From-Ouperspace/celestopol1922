Hooks.on("preCreateItem", (document, data, options, userId) => {
    if (document.type === "aspect") {
      let updates = {}
      const stats = document._stats

      // Pour un acteur non dupliqué, non provenant d'un compendium et non exporté
      if (!stats.duplicateSource && !stats.compendiumSource && !stats.exportSource) {
        // Image par défaut
        if (!foundry.utils.hasProperty(data, "img")) {
            updates.img = "systems/celestopol1922/images/icons/aspect.png";
        }
      }
      document.updateSource(updates)
    }
})

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */

export class CEL1922AspectSheet extends ItemSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "aspect"],
      template: "systems/celestopol1922/templates/item/aspect-sheet.html",
      width: 450,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description-technique" }],
      scrollY: [".description-technique", ".description-narratif", ".data", ".notes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.item.system;
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

    context.playersEditItems = game.settings.get("celestopol1922", "playersEditItems");

    context.isGM = game.user.isGM;
    // context.isGM = false;

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
