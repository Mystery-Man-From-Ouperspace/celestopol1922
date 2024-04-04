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
      this.system.initiative = this.system.skill.corps.res;
    }
    if (this.type === "character") {
      this.system.initiative = 4 + this.system.skill.corps.mobilite.value + this.system.skill.coeur.inspiration.value;
    }
  }

}
