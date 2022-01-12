# TODO list
- Remove Power (5 / 5)
- Revamp HP (10 / 10)
- Remove character Level
- Remove NPC CR/XP
- Reconciliate Description/Biography terms
- Add Journal
- Created 'Limited' version of P-C sheet
   /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'systems/castle-falkenstein/templates/actor/limited-sheet.html'
    return 'systems/castle-falkenstein/templates/actor/actor-sheet.html'
  }
  ==> also achievable with conditionals inside the html itself
- Add Secrets section in NPC sheets.
- Ensure GM only see NPC sheets in full. Others (players) see a Limited version with non-Secret Descriptions only
