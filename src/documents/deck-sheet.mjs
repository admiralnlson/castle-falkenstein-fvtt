import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * Sheet for the Cards Deck.
 * @extends {CardsConfig}
 */
export class CastleFalkensteinDeckSheet extends CardsConfig {

   /** @override */
   async getData(options) {
    // Retrieve the data structure from the base sheet.
    const context = await super.getData(options);

    const deck = this.object;

    CastleFalkenstein.translateCardStack(deck);

    return context;
   }
}