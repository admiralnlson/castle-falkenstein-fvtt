import { CastleFalkensteinItemDataModel } from "./itemdatamodel.mjs";

export class CastleFalkensteinAbilityDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: new foundry.data.fields.StringField({
        required: true,
        initial: "AV",
        label: "castle-falkenstein.ability.level",
      }),
      suit: new foundry.data.fields.StringField({
        required: true,
        initial: "?",
        label: "castle-falkenstein.ability.suit",
      })
    }
  }
}
