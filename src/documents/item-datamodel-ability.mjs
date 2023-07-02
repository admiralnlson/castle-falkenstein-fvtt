import { CastleFalkensteinItemDataModel } from "./item-datamodel.mjs";
import { CASTLE_FALKENSTEIN } from "../config.mjs";

export class CastleFalkensteinAbilityDataModel extends CastleFalkensteinItemDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),

      own: new foundry.data.fields.SchemaField({
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
      }),
      isSpecialization: new foundry.data.fields.BooleanField({
        required: true,
        nullable: false,
        initial: false
      }),
      specializationOf: new foundry.data.fields.StringField({
        nullable: true
      })
    }
  }

  static migrateData(source) {
    // adapt pre-V2.6.0 DB
    if (!source.specializationOf && !source.own) {
      source.own = {};
      source.own.level = source.level;
      delete source.level;
      source.own.suit = source.suit;
      delete source.suit;
      source.isSpecialization = false;
    }

    return super.migrateData(source);
  }

  get rootAbility() {
    if (this.isSpecialization) {

      // attempt at avoiding circular definitions
      if (this.parent.name == this.specializationOf) return;

      let matches = this.parent.actor.items.filter(a => a.type == "ability" && a.name == this.specializationOf);
      if (matches && matches.length == 1)
        return matches[0];
    }
  }

  get level() {
    let root = this.rootAbility;

    if (root) {
      return CASTLE_FALKENSTEIN.abilityLevels[root.system.level].specialized;
    } else {
      return this.own.level;
    }
  }

  get suit() {
    let root = this.rootAbility;
    if (root) {
      return root.system.suit;
    } else {
      return this.own.suit;
    }
  }

  get displayName() {
    if (this.isSpecialization) {
      const localizedDisplayName = game.i18n.format("castle-falkenstein.ability.specializationDisplayName", {
        rootAbility: this.rootAbility?.name,
        specialization: this.parent.name
      });

      return localizedDisplayName;
    } else {
      return this.parent.name;
    }
  }

  get prefixedDisplayName() {
    if (this.isSpecialization) {
      return "• " + this.displayName;
    } else {
      return this.displayName;
    }
  }

  get levelI18nKey() {
    return CASTLE_FALKENSTEIN.abilityLevels[this.level].full;
  }

  get levelValue() {
    return CASTLE_FALKENSTEIN.abilityLevels[this.level].value;
  }

  get suitSymbol() {
    return CASTLE_FALKENSTEIN.cardSuitsSymbols[this.suit];
  }
}
