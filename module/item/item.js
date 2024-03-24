/**
 * @extends {Item}
 */
export class CEL1922Item extends Item {
  get isWeapon() {
    return this.system.subtype === "weapon";
  }

  get isArmor() {
    return this.system.subtype === "armor";
  }

  get isVehicle() {
    return this.system.subtype === "vehicle";
  }

  get isOther() {
    return this.system.subtype === "other";
  }
}
