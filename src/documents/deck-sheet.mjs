import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * Sheet for the Cards Deck.
 * @extends {CardsConfig}
 */
export class CastleFalkensteinDeckSheet extends CardsConfig {

  /** @override */
  async _onDrop(event) {
    if (! await CastleFalkenstein.onDropOnCardStack(event, this))
      return;

    return super._onDrop(event);
  }

}