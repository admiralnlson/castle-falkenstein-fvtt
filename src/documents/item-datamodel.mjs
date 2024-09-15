
/**
 * @extends {foundry.abstract.TypeDataModel}
 */
export class CastleFalkensteinItemDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new foundry.data.fields.HTMLField({label: "castle-falkenstein.description", textSearch: true, initial: ""}),
    }
  }

  /**
   * Needed by module Item Piles.
   * @see CastleFalkensteinItem#toObject
   */
  /*get quantity() {
    return 1;
  }*/

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Needed by module Item Piles.
    this.quantity = 1
  }

}
