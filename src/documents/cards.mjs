import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * @extends {Cards}
 */
export class CastleFalkensteinCards extends Cards {

  async _resetStack({updateData={}, chatNotification=true}={}) {
    // Let's short-circuit the default behaviour of cards returning from CF hands to decks by default in Core, and discard them to the adequate pile instead
    if (this.type === "hand") {
      const handType = this.getFlag(CastleFalkenstein.name, "type");

      await this.pass(CastleFalkenstein.discardPile(handType), this.cards.map(card => card.id), {chatNotification: false});
    }
    else {
      super._resetStack({updateData, chatNotification});
    }
  }

}
