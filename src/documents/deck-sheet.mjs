import { CastleFalkenstein } from "../castle-falkenstein.mjs";

const { CardDeckConfig } = foundry.applications.sheets;

/**
 * Sheet for a "deck" Cards stack — translates system-owned card names then defers to the core deck sheet.
 */
export class CastleFalkensteinDeckSheet extends CardDeckConfig {

  async _prepareContext(options) {
    CastleFalkenstein.translateCardStack(this.document);
    return super._prepareContext(options);
  }
}
