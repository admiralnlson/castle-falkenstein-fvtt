import { CASTLE_FALKENSTEIN } from "../config.mjs";
import { CastleFalkenstein } from "../castle-falkenstein.mjs";

/**
 * @extends {TokenDocument}
 */
export class CastleFalkensteinToken extends TokenDocument {

  /** @override */
  async _onUpdate(changed, options, user) {
    super._onUpdate(changed, options, user);
    
    if ((changed.name || changed.actorLink == false) && !this.actorLink && this.actor.name != this.name) {
      // propagate the new token name to its synthetic actor
      await this.actor.update({
        name: this.name
      });
    }
  }
}
