import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * @extends {Cards}
 */
export class CastleFalkensteinCards extends Cards {

  // "spellBeingCast" flag object structure = {
  //    actorItemId: <id of the item within the actor>,
  //    definitions: {
  //      <enum of properties is documented in config.mjs>
  //    }
  //  }

  get spellBeingCast() {
    return this.getFlag(CastleFalkenstein.id, "spellBeingCast");
  }

  async defineSpell(spellBeingCast) {
    await this.unsetFlag(CastleFalkenstein.id, 'spellBeingCast');
    await this.setFlag(CastleFalkenstein.id, 'spellBeingCast', spellBeingCast);
  }

  async stopCasting() {
    await this.unsetFlag(CastleFalkenstein.id, 'spellBeingCast');
  }

}
