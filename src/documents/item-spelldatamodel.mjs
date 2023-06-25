import { CastleFalkensteinItemDataModel } from "./itemdatamodel.mjs";

export class CastleFalkensteinSpellDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: new foundry.data.fields.NumberField({label: "castle-falkenstein.spell.level", initial: 0}),
      suit: new foundry.data.fields.StringField({label: "castle-falkenstein.spell.suit", initial: "?"})
    }
  }
}
