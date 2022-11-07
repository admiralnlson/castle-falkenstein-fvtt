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

  get title() {
    return this.object.name;
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
      eventCard.style.transform = `rotateZ(${correction}deg) scale(1.5) translate(30%, 50%)`;
      eventCard.style["z-index"] = 400 - correction;
    } else {
      eventCard.style.transform = eventCard.getAttribute("data-rot");
      eventCard.style["z-index"] = eventCard.getAttribute("data-zind");
    }
  }

}
