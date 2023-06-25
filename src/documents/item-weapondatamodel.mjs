import { CastleFalkensteinItemDataModel } from "./itemdatamodel.mjs";

export class CastleFalkensteinWeaponDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      effectiveRange: new foundry.data.fields.StringField({label: "castle-falkenstein.weapon.effectiveRange", initial: ""}),
      ammunition: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.ammunition", initial: 0}),
      ammunition_max: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.ammunitionMax", initial: 0}),
      woundsPartial: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.woundsPartial", initial: 0}),
      woundsFull: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.woundsFull", initial: 0}),
      woundsHigh: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.woundsHigh", initial: 0}),
    }
  }
}
