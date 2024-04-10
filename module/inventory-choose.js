/**
 * A Dialog subclass which allows...
 * @extends {Dialog}
 */
export class InventoryChoose extends Dialog {

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // console.log("Listeners activés")
    html.find('input[value="inventory"]').click(this._onInventoryClick.bind(this));
    html.find('input[value="improvised"]').click(this._onDamageClick.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle changing the...
   * @param {Event} event   The input change event
   */

  _onInventoryClick(event) {
    // console.log("J'exécute _onInventoryClick()")
    let checkbox = this.element.find('input[value="inventory"]');
    let othercheckbox = this.element.find('input[value="improvised"]');
    let chooseinventory = this.element.find('td[name="chooseinventory"]');
    let choosedamage = this.element.find('td[name="choosedamage"]');

    checkbox.checked = true;
    othercheckbox.checked = false;
    // console.log("inventory is checked");
    chooseinventory.show();
    choosedamage.hide();
  }

  _onDamageClick(event) {
    console.log("J'exécute _onDamageClick()")
    let checkbox = this.element.find('input[value="improvised"]');
    let othercheckbox = this.element.find('input[value="inventory"]');
    let chooseinventory = this.element.find('td[name="chooseinventory"]');
    let choosedamage = this.element.find('td[name="choosedamage"]');

    checkbox.checked = true;
    othercheckbox.checked = false;
    // console.log("improvised is checked");
    chooseinventory.hide();
    choosedamage.show();

    /*
    this.render(true, {
      width: 600,
      height: 265
    })
    */

  }
}
