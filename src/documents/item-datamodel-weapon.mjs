import { CastleFalkensteinItemDataModel } from "./item-datamodel.mjs";

export class CastleFalkensteinWeaponDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      effectiveRange: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.effectiveRange", integer: true, nullable: true, initial: null}),
      maxRange: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.maxRange", integer: true, nullable: true, initial: null}),
      ammunition: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.ammunition", integer: true, nullable: true, initial: null}),
      ammunition_max: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.ammunitionMax", integer: true, nullable: true, initial: null}),
      conceal: new foundry.data.fields.StringField({label: "castle-falkenstein.weapon.conceal", initial: "-"}),
      woundsPartial: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.woundsPartial", integer: true, nullable: true, initial: null}),
      woundsFull: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.woundsFull", integer: true, nullable: true, initial: null}),
      woundsHigh: new foundry.data.fields.NumberField({label: "castle-falkenstein.weapon.woundsHigh", integer: true, nullable: true, initial: null}),
      harmRank: new foundry.data.fields.StringField({label: "castle-falkenstein.weapon.harmRank", initial: "-"})
    }
  }

  static migrateData(source) {
    // adapt pre-V2.8 content
    if (source.effectiveRange !== null) {
      if (source.effectiveRange === 0)
        source.effectiveRange = null;
      else if (typeof source.effectiveRange !== "number") {
        source.effectiveRange = parseInt(source.effectiveRange);
        if (source.effectiveRange === 0 || isNaN(source.effectiveRange))
          source.effectiveRange = null;
      }
    }

    return super.migrateData(source);
  }
}
