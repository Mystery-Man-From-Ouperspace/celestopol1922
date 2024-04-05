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
    if (this.type === "npc") {
      this.system.skill.woundsmalus[8] = -999;

      const lvlBlessures = parseInt(this.system.blessures.lvl);
      const malusBlessures = parseInt(this.system.skill.woundsmalus[lvlBlessures]);
      let corps = this.system.skill.corps.res;
      let corpsVal = 0;
      if (corps != null) {
        corpsVal = parseInt(corps);
      }
      this.system.skill.corps.actuel = corpsVal + malusBlessures;
      if (corpsVal + malusBlessures > 0) {
      this.system.initiative = corpsVal + malusBlessures;
      } else {
        this.system.initiative = 0;
      }
    }

    if (this.type === "character") {
      this.system.skill.woundsmalus[8] = -999;

      const lvlBlessures = parseInt(this.system.blessures.lvl);
      const malusBlessures = parseInt(this.system.skill.woundsmalus[lvlBlessures]);
      let init = 4 + this.system.skill.corps.mobilite.value + this.system.skill.coeur.inspiration.value + malusBlessures;
      if (init < 0) init = 0;
      this.system.initiative = init;
    }
  }

}
