import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * @extends {Cards}
 */
export class CastleFalkensteinCards extends Cards {

  async _resetStack({updateData={}, chatNotification=true}={}) {
    // Let's short-circuit the default behaviour of cards returning from CF hands to decks by default in Core, and discard them to the adequate pile instead
    if (this.type === "hand") {
      const handType = this.getFlag(CastleFalkenstein.id, "type");

      await this.pass(CastleFalkenstein.discardPile(handType), this.cards.map(card => card.id), {chatNotification: chatNotification});
    }
    else {
      super._resetStack({updateData, chatNotification});
    }
  }

  // "spellBeingCast" flag object structure = {
  //    actorItemId: <id of the item within the actor>,
  //    definitions: {
  //      <enum of properties is documented in config.mjs>
  //    }
  //  }

  get spellBeingCast() {
    if (this.type === "hand" &&
        this.getFlag(CastleFalkenstein.id, "type") === "sorcery") {
      return this.getFlag(CastleFalkenstein.id, "spellBeingCast");
    }
  }

  async defineSpell(spellBeingCast) {
    await this.unsetFlag(CastleFalkenstein.id, 'spellBeingCast');
    await this.setFlag(CastleFalkenstein.id, 'spellBeingCast', spellBeingCast);
  }

  async stopCasting() {
    await this.unsetFlag(CastleFalkenstein.id, 'spellBeingCast');
  }

}
