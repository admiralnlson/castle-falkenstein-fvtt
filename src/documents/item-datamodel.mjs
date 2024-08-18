
/**
 * @extends {foundry.abstract.DataModel}
 */
export class CastleFalkensteinItemDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new foundry.data.fields.HTMLField({label: "castle-falkenstein.description", textSearch: true, initial: ""}),
    }
  }
}
