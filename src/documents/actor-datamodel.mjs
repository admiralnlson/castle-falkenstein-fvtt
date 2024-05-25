/**
 * @extends {foundry.abstract.DataModel}
 */
export class CastleFalkensteinActorDataModel extends foundry.abstract.DataModel {
  static defineSchema() {

    const schema = {
      health: new foundry.data.fields.SchemaField({
        max: new foundry.data.fields.NumberField({
          integer: true
        })
      }),
      wounds: new foundry.data.fields.StringField({label: "castle-falkenstein.wounds"}),
      description: new foundry.data.fields.HTMLField({label: "castle-falkenstein.description", textSearch: true}),
      // Because `game.user.isGM` is not defined early enough, textSearch is allowed for Hosts in CastleFalkenstein.onReady
      diary: new foundry.data.fields.HTMLField({label: "castle-falkenstein.diary", textSearch: false}),
      // Because `game.user.isGM` is not defined early enough, textSearch is allowed for Hosts in CastleFalkenstein.onReady
      hostNotes: new foundry.data.fields.HTMLField({label: "castle-falkenstein.hostNotes", textSearch: false})
    };

    return schema;
  }
}
