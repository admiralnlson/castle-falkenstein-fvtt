import CastleFalkenstein from "../castle-falkenstein.mjs";

// A form for performing a Feat.
export default class CastleFalkensteinPerformFeat extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "castle-falkenstein-perform-feat",
      title: game.i18n.localize("castle-falkenstein.performFeat.title"),
      template: "./systems/castle-falkenstein/templates/perform-feat.hbs",
      classes: ["castle-falkenstein-perform-feat", "sheet"],
      width: 500,
      height: "auto",
      closeOnSubmit: true,
      submitOnClose: false,
      resizable: true
    });
  }

  /**
   * @override
   */
  constructor(object = {}, options = {}) {
    super(object, options);
    this.item = object;
    this.actor = object.actor;
    this.fortuneHand = game.cards.get(object.actor.data.data.hands.fortune);
  }

  /**
   * @override
   */
  async getData() {
    return {
      //cards: this.fortuneHand.data.
    }
  }

	/** @override */
  activateListeners(html) {
    //html.find('.').click(event => this._onClickToggleFilter(event));
  }

  /**
   * @override
   */
  async _updateObject(event, formData) {
    // normal updateObject stuff

    this.render(); // rerenders the FormApp with the new data.
  }

}