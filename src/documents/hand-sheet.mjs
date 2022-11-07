import CastleFalkenstein from "../castle-falkenstein.mjs";

/**
 * Sheet for the default Cards Hand.
 * @extends {CardsHand}
 */
export class CastleFalkensteinHandSheet extends CardsHand {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CastleFalkenstein.id, "sheet", "cardsHand", "cards-config"],
      width: 300,
      top: 150,
      resizable: false,
      template: "systems/castle-falkenstein/src/documents/hand-sheet.hbs",
    })
  }

  /** @override */
  get title() {
    return this.object.name;
  }

  /** @override */
  async getData(options) {
    // Retrieve the data structure from the base sheet.
    const context = super.getData(options);

    return context;
  }

  async activateListeners(html) {
    this.rotateCards(html);
    html.find(".card img").click(this.focusCard.bind(this));
    super.activateListeners(html);
  }

  rotateCards(html) {
    let cardsAreas = html.find('.cards');
    for (let area of cardsAreas) {
      for (let i = 0; i < area.children.length; i++) {
        let card = area.children[i];
        card.style.transform = `rotateZ(${(i * 4)}deg) translateX(${i * 30}px)`;
        card.style["z-index"] = 302 + i*4;
      }
      area.style.transform = `rotateZ(${-((area.children.length - 1) * 2)}deg) translateX(-${area.children.length * 15}px)`
    }
  }

  focusCard(event) {
    let eventCard = event.currentTarget.closest('li.card');
    eventCard.classList.toggle('focusedCard');
    let correction = parseInt(eventCard.parentElement.style.transform.replace("rotateZ(", "").replace(")deg", "")) * -1;
    if (eventCard.classList.contains("focusedCard")) {
      eventCard.setAttribute("data-rot", eventCard.style.transform);
      eventCard.setAttribute("data-zind", eventCard.style["z-index"])
      eventCard.style.transform = `rotateZ(${correction}deg) scale(1.5) translate(7%, 40%)`;
      eventCard.style["z-index"] = 400 - correction;
    } else {
      eventCard.style.transform = eventCard.getAttribute("data-rot");
      eventCard.style["z-index"] = eventCard.getAttribute("data-zind");
    }
  }

  /** @override */
  async _onCardControl(event) {
    super._onCardControl(event);

    const button = event.currentTarget;
    const li = button.closest(".card");
    const card = li ? this.object.cards.get(li.dataset.cardId) : null;
    const cls = getDocumentClass("Card");

    // Handle the control action
    switch ( button.dataset.action ) {
      case "openActor":
        return CastleFalkenstein.log.debug("openActor");
      case "refillHand":
        return CastleFalkenstein.log.debug("refillHand");
      case "chanceCard":
        return CastleFalkenstein.log.debug("chanceCard");
      case "gatherPower":
        return CastleFalkenstein.log.debug("gatherPower");
      case "releasePower":
        return CastleFalkenstein.log.debug("releasePower");
      case "castSpell":
        return CastleFalkenstein.log.debug("castSpell");
      case "cancelSpell":
        return CastleFalkenstein.log.debug("cancelSpell");
    }

  }

}
