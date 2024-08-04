
/**
 * @extends {Combatant}
 */
export class CastleFalkensteinCombat extends Combat {

  // @override
  // Implementation is supposed to be the same as in Core, except without any chat messages or dice roll sound generated.
  // Didn't find a way to avoid the code duplication..
  async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={}) {

    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    const currentId = this.combatant?.id;

    // Iterate over Combatants, performing an initiative roll for each
    const updates = [];
    const messages = [];
    for ( let [i, id] of ids.entries() ) {

      // Get Combatant data (non-strictly)
      const combatant = this.combatants.get(id);
      if ( !combatant?.isOwner ) continue;

      // Produce an initiative roll for the Combatant
      const roll = combatant.getInitiativeRoll(formula);
      await roll.evaluate();
      updates.push({_id: id, initiative: roll.total});
    }
    if ( !updates.length ) return this;

    // Update multiple combatants
    await this.updateEmbeddedDocuments("Combatant", updates);

    // Ensure the turn order remains with the same combatant
    if ( updateTurn && currentId ) {
      await this.update({turn: this.turns.findIndex(t => t.id === currentId)});
    }

    return this;
  }

	#getCombatant(li, combat) {
		const combatantId = li?.dataset?.combatantId;
		if (!combatantId) return;
		return combat.combatants.get(combatantId);
	}

  onRenderCombatTracker(app, html, options) {
    if (!game.user.isGM)
      return;

		// Turn initiative spans into initiative inputs for all combatants.
		const combatants = html[0].querySelectorAll("li.combatant");
		for (const li of combatants) {
 
			const combatant = this.#getCombatant(li, options.combat);

			const initiativeSpan = li.querySelector("span.initiative");
			if (initiativeSpan) {
				const initiative = document.createElement("input");
				initiative.setAttribute("type", "number");
				initiative.classList.add("initiative-input");
				initiative.value = initiativeSpan.textContent;
				initiativeSpan.replaceChild(initiative, initiativeSpan.firstChild);

				// Prevent double clicking the initiative from opening the character sheet.
				initiative.addEventListener("dblclick", e => e.stopPropagation());
				initiative.addEventListener("click", e => e.stopPropagation());

				// Handle enter being pressed.
				initiative.addEventListener("change", e => {
					e.stopPropagation();

					// Lose the focus to trigger the initiative update.
					e.currentTarget.blur();
				});

				// Handle the initialive losing focus.
				initiative.addEventListener("blur", e => {
					const initiative = parseFloat(e.currentTarget.value);
					options.combat.setInitiative(combatant.id, initiative);
				});
			}
			else {
        // there should not be any roll buttons (see coalesce to 0 in Combatant.*)
			}
		}
	}
}

