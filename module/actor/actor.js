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

}
