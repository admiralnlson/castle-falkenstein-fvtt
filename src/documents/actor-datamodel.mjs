/**
 * @extends {foundry.abstract.DataModel}
 */
export class CastleFalkensteinActorDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {

    const schema = {

      health: new foundry.data.fields.SchemaField({
        max: new foundry.data.fields.NumberField({
          integer: true
        })
        // if adding 'min' or 'value' properties in this object later on, beware of the migrateData code below which deletes them.
      }),

      wounds: new foundry.data.fields.StringField({label: "castle-falkenstein.wounds"}),

      description: new foundry.data.fields.HTMLField({label: "castle-falkenstein.description", textSearch: true}),

      // obsolete -> replaced with separate JournalEntry
      diary: new foundry.data.fields.HTMLField({label: "castle-falkenstein.diary.self", required: false, nullable: true}),

      playerNotes: new foundry.data.fields.HTMLField({label: "castle-falkenstein.playerNotes", textSearch: true}),

      // Because `game.user.isGM` is not defined early enough, textSearch is allowed for Hosts in CastleFalkenstein.onReady
      hostNotes: new foundry.data.fields.HTMLField({label: "castle-falkenstein.hostNotes", textSearch: false})
    };

    return schema;
  }

  static migrateData(source) {

    if (source.hands) // from earlier versions of the system
      delete source.hands;

    if (source.spellBeingCast)
      delete source.spellBeingCast;

    if (source.health?.value) // used to default to10 in earlier versions of the system
      delete source.health.value;

    if (source.health?.min) // used to default to 0 in earlier versions of the system
      delete source.health.min;

    //if (source.diary === null) // cannot delete it as it's still mentioned in the data model schema
    //  delete source.diary;

      return super.migrateData(source);
  }
}
