/**
 * A Dialog subclass which allows...
 * @extends {Dialog}
 */
export class ModifiedDialog extends Dialog {

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // console.log("Listeners activés")
    html.find('input[value="inventory"]').click(this._onInventoryClick.bind(this));
    html.find('input[value="improvised"]').click(this._onDamageClick.bind(this));

    html.find('input[value="inventoryopponent"]').click(this._onInventoryOpponentClick.bind(this));
    html.find('input[value="improvisedopponent"]').click(this._onDamageOpponentClick.bind(this));


    html.find('input[value="knownopposition"]').click(this._onKnownOppositionClick.bind(this));
    html.find('input[value="blindopposition"]').click(this._onBlindOppositionClick.bind(this));
    html.find('input[value="simpletest"]').click(this._onSimpleTestClick.bind(this));

    html.find('select[name="skill"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="bonusanomaly"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="anomaly"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="bonusaspect"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="aspect"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="bonusattribute"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="attribute"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="bonus"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="malus"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="armor"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="jaugewounds"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="jaugedestiny"]').change(this._onSkillDicePrompt.bind(this));
    html.find('select[name="jaugespleen"]').change(this._onSkillDicePrompt.bind(this));

    html.find('select[name="target"]').change(this._onTargetSelect.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle changing the...
   * @param {Event} event   The input change event
   */

  _onKnownOppositionClick(event) {
    console.log(1);
    let knownopposition = this.element.find('input[value="knownopposition"]');
    let blindopposition = this.element.find('input[value="blindopposition"]');
    let simpletest = this.element.find('input[value="simpletest"]');
    knownopposition.checked = true;
    blindopposition.checked = false;
    simpletest.checked = false;
    let opposition_value = this.element.find('span[class="value opposition-value"]');
    let seuil_value = this.element.find('span[class="value seuil-value"]');
    let opposition = this.element.find('select[name="opposition"]');
    opposition_value.show();
    seuil_value.hide();
    opposition.show();
  }

  _onBlindOppositionClick(event) {
    console.log(2);
    let knownopposition = this.element.find('input[value="knownopposition"]');
    let blindopposition = this.element.find('input[value="blindopposition"]');
    let simpletest = this.element.find('input[value="simpletest"]');
    knownopposition.checked = false;
    blindopposition.checked = true;
    simpletest.checked = false;
    let opposition_value = this.element.find('span[class="value opposition-value"]');
    let seuil_value = this.element.find('span[class="value seuil-value"]');
    let opposition = this.element.find('select[name="opposition"]');
    opposition_value.hide();
    seuil_value.hide();
    opposition.hide();
  }

  _onSimpleTestClick(event) {
    console.log(3);
    let knownopposition = this.element.find('input[value="knownopposition"]');
    let blindopposition = this.element.find('input[value="blindopposition"]');
    let simpletest = this.element.find('input[value="simpletest"]');
    knownopposition.checked = false;
    blindopposition.checked = false;
    simpletest.checked = true;
    let opposition_value = this.element.find('span[class="value opposition-value"]');
    let seuil_value = this.element.find('span[class="value seuil-value"]');
    let opposition = this.element.find('select[name="opposition"]');
    opposition_value.hide();
    seuil_value.show();
    opposition.show();
  }
  
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

  _onInventoryOpponentClick(event) {
    // console.log("J'exécute _onInventoryOpponentClick()")
    let checkbox = this.element.find('input[value="inventoryoOpponent"]');
    let othercheckbox = this.element.find('input[value="improvisedopponent"]');
    let chooseinventory = this.element.find('td[name="chooseinventoryopponent"]');
    let choosedamage = this.element.find('td[name="choosedamageopponent"]');

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
  }

  _onDamageOpponentClick(event) {
    console.log("J'exécute _onDamageClick()")
    let checkbox = this.element.find('input[value="improvisedopponent"]');
    let othercheckbox = this.element.find('input[value="inventoryopponent"]');
    let chooseinventory = this.element.find('td[name="chooseinventoryopponent"]');
    let choosedamage = this.element.find('td[name="choosedamageopponent"]');

    checkbox.checked = true;
    othercheckbox.checked = false;
    // console.log("improvised is checked");
    chooseinventory.hide();
    choosedamage.show();
  }

  _onSkillDicePrompt(event) {
    console.log("Menu modifié Test Spécialité");
  }

  _onTargetSelect(event) {
    // console.log("Menu modifié Cible");
    let target = this.element.find('select[name="target"]').val();

    let versus = this.element.find('td[class="versus"]');
    let no_token = this.element.find('td[class="no-token"]');
    if (target == '0') {
      versus.hide();
      no_token.hide();
    } else {
      versus.show();
      no_token.show();
    };

    // console.log('target = ', target);
    let myImage = "";
    for (let targetedtoken of game.user.targets) {
      // console.log('targetedtoken = ', targetedtoken);
      // console.log('targetedtoken.id = ', targetedtoken.id);
      if (targetedtoken.id == target) {
        myImage = targetedtoken.actor.img;
      };
    };
    // console.log('myImage = ', myImage);
    let imageopponent = this.element.find('img[class="imageopponent"]');
    imageopponent.attr('src', myImage);
  }
}
