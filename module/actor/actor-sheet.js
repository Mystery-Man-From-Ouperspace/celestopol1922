/**
 * @extends {ActorSheet}
 */
export class CEL1922ActorSheet extends ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["celestopol1922", "sheet", "actor"],
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      width: 920,
      height: "auto"
    });
  }

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.actor.system;
    context.descriptionHTML = await TextEditor.enrichHTML(this.actor.system.description, {
      secrets: this.document.isOwner,
      async: true,
    });
    return context;
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Item Controls
    html.find(".item-control").click(this._onItemControl.bind(this));
    // html.find(".items .rollable").on("click", this._onItemRoll.bind(this));
  }

  /**
   * Handle click events for Item, Aspect, Anomaly, Attribute control buttons within the Actor Sheet
   * @param event
   * @private
   */
  async _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const action = button.dataset.action;
    const type = button.dataset.type;
    const li = button.closest(".item");
    let item;

    // Handle different actions
    switch (action) {
      case "create":
        const cls = getDocumentClass("Item");
        let name = "";
        let imgPath = "";
        if (type === "item") {
          name = game.i18n.localize("CEL1922.ItemNew");
          imgPath = "systems/celestopol1922/images/icons/item.png";
        }
        else if (type === "anomaly") {
          name = game.i18n.localize("CEL1922.AnomalyNew");
          imgPath = "systems/celestopol1922/images/icons/anomaly.png";
        }
        else if (type === "aspect") {
          name = game.i18n.localize("CEL1922.AspectNew");
          imgPath = "systems/celestopol1922/images/icons/aspect.png";
        }
        else if (type === "attribute") {
          name = game.i18n.localize("CEL1922.AttributeNew");
          imgPath = "systems/celestopol1922/images/icons/attribute.png";
        }
        await cls.create({ name: name, type: type }, { parent: this.actor });

        const myType = type;
        const myActor = this.actor;
        switch (myType) {
          case "item":
            for (let item of myActor.items.filter(item => item.type === 'item')) {
              if (item.img == "icons/svg/item-bag.svg") item.update({ "img": imgPath });
            }
          break;
          case "anomaly":
            for (let anomaly of myActor.items.filter(item => item.type === 'anomaly')) {
              if (anomaly.img == "icons/svg/item-bag.svg") anomaly.update({ "img": imgPath });
            }
          break;
          case "aspect":
            for (let aspect of myActor.items.filter(item => item.type === 'aspect')) {
              if (aspect.img == "icons/svg/item-bag.svg") aspect.update({ "img": imgPath });
            }
          break;
          case "attribute":
            for (let attribute of myActor.items.filter(item => item.type === 'attribute')) {
              console.log("attribute = ", attribute);
              if (attribute.img == "icons/svg/item-bag.svg") attribute.update({ "img": imgPath });
              console.log("attribute = ", attribute);

            }
          break;
        }
        return;

      case "read":
        item = this.actor.items.get(li?.dataset.itemId);
        return item.sheet.render(true);
      case "edit":
        item = this.actor.items.get(li?.dataset.itemId);
        return item.sheet.render(true);
      case "delete":
        item = this.actor.items.get(li?.dataset.itemId);
        return item.delete();
    }
  }

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   *
  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data("roll"), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`,
    });
  }
  */
}
