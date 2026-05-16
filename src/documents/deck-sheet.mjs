import { CastleFalkenstein } from "../castle-falkenstein.mjs";
const { CardDeckConfig } = foundry.applications.sheets;

/** Sheet for the Cards Deck. */
export class CastleFalkensteinDeckSheet extends CardDeckConfig {

   /** @override */
   async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const deck = this.object;

    CastleFalkenstein.translateCardStack(deck);

    return context;
   }
}