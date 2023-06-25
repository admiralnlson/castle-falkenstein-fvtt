import { CastleFalkensteinItemDataModel } from "./itemdatamodel.mjs";

export class CastleFalkensteinPossessionDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema()
    }
  }
}
