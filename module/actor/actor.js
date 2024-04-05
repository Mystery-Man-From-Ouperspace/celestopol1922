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
      /*
      if (this.system.blessures.blessure_1.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[1]);
      } else {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[0]);
      }
      if (this.system.blessures.blessure_2.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[2]);
      }
      if (this.system.blessures.blessure_3.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[3]);
      }
      if (this.system.blessures.blessure_4.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[4]);
      }
      if (this.system.blessures.blessure_5.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[5]);
      }
      if (this.system.blessures.blessure_6.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[6]);
      }
      if (this.system.blessures.blessure_7.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[7]);
      }
      if (this.system.blessures.blessure_8.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[8]);
      }
      */
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
      const lvlBlessures = parseInt(this.system.blessures.lvl);
      const malusBlessures = parseInt(this.system.skill.woundsmalus[lvlBlessures]);
      let init = 4 + this.system.skill.corps.mobilite.value + this.system.skill.coeur.inspiration.value + malusBlessures;
      this.system.initiative = init;
      /*
      if (this.system.blessures.blessure_1.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[1]);
      } else {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[0]);
      }
      if (this.system.blessures.blessure_2.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[2]);
      }
      if (this.system.blessures.blessure_3.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[3]);
      }
      if (this.system.blessures.blessure_4.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[4]);
      }
      if (this.system.blessures.blessure_5.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[5]);
      }
      if (this.system.blessures.blessure_6.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[6]);
      }
      if (this.system.blessures.blessure_7.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[7]);
      }
      if (this.system.blessures.blessure_8.check) {
        this.system.blessures.lvl = parseInt(this.system.skill.woundsmalus[8]);
      }
      */
    }
  }

}
