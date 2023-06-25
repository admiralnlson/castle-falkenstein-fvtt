import { CastleFalkensteinItemDataModel } from "./item-datamodel.mjs";

export class CastleFalkensteinPossessionDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema()
    }
  }
}
