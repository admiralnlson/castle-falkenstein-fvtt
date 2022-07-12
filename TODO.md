# TODO

## Legend
+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Project maintainer (admiralnlson)'s own GM needs

## `[M]` Core version compatibility

  + when v10 is mature
    + reactivate compatibility warnings
    + migrate code to v10 (data -> system, ..)
    + make v9 no longer supported
    + in system.json
    + remove 'name' property
    + remove 'minimumCoreVersion' & 'compatibleCoreVersion'
  + or alternatively: maintain 2 separate branches/version tracks for v9 and v10 (potentially quite a bit more work if adding new features or fix until v9 is decommissioned..)

## `[M]` Bugs

+ Fortune/Sorcery hand linking issue for unlinked tokens and duplicated actors
  + Required
    + on click to open the fortune/sorcery hand in the character sheet, if the hand is not actually linked to the actor (incl. unlinked token) then replace it
  + TBC if required
    + (User XP) Warning at the top of the char sheet to indicate it's not linked to an actor?
    + [data migration] game.scenes.forEach / (scene).tokens.forEach / if (token).isLinked==false && (token).actor != null, token.update 'data.spellBeingCast.spell' to '' and 'sorceryHand' to null
    + On createToken, if (token).data.token.isLinked==false, set 'spellBeingCast.spell' to '' and 'sorceryHand' to null
    + On updateToken w/ change.actorLink==true and (), delete the token's sorcery hand if it exists and set 'sorceryHand' to (the source actor one)
    + On updateToken w/ change.actorLink==false, set 'sorceryHand' to null
    + on deleteToken, if delete the token's sorcery hand if it exists
    + (related gap) on deleteActor, delete the actor's sorcery hand if it exists
    + (related gap) on deleteActor, delete the actor's fortune hand if it exists
    + (related gap) differentiate pc and npc
      + [data migration] game.actors.forEach / (scene).tokens.forEach / if (token).isLinked==false && (token).actor != null, token.update 'data.spellBeingCast.spell' to '' 
    + (related gap) onReady, create the GM fortune hand if missing
    + (related gap) on actor permission change, if no player owns the actor anymore, delete the dedicated fortuneHand and point to the GM hand instead
    + (related gap) on actor permission change, if no player owns the actor anymore, creata a dedicated fortune hand and set fortuneHand to it

## Feature evolutions

### Explicit user requests

| User | Request |
|------|:--------|
| Dame du Lac | `[S]` Extra 'Other' tab for listing secondary attributes such as Speed (Run+Flight) or Languages known |
| Dame du Lac | `[C]` Have abilities display as 2+ columns if there is enough horizontal space (and ensure 2 in the default width) |
| mite.railleuse | `[S]` Duel system |
| mite.railleuse | `[S]` Tab for special stats (see below) |

### `[🔥]` Derived stats & Racial abilities
+ Free text, free text w/ compendium or key/value pairs?
  + Languages
  + Faerie Power
  + Corebook p140 / Libre de base p194
    + Running speed (Athletics) / Vitesse de course (Athlétisme)
    + Flying Speeds (Faerie Etherealness or Dragon/Animal Physique) / Vitesses de vol (Éthéralité et Physique)
  + Dragon
    + Flying
    + Shapeshift
    + Armor
    + help users with Dragon attack levels (because the Corebook and Curious Creatures do not match)

### Cards

+ `[S]` Display the ongoing spell name in the hand (and char sheet?)

+ `[M]` Remove the dependency to Monarch by proposing a default Hand sheet implem (enabled by default).

+ `[M🔥]` Make sure drawn cards always appear to the right (might be the case with Monarch already but don't think it will be the case for the CF-default hand)

+ `[S]` Reset the character's Fortune/Sorcery hands and delete them when a character is deleted

+ `[C]` Button in World settings (Host only) to delete all NPC hands

+ `[C]` Card hand button to show a Fortune or Sorcery hand in chat

### Sorcery

+ `[M🔥]` Define Spell - Allow user to specify a custom bonus/malus (with label?) at spell definition time
+ `[S]` Define Spell - explicit mechanic for using **Sorcery specialization** (as opposed to the raw Sorcery level)
+ `[S]` Define Spell - explicit mechanic for using **Artefacts**
+ `[S]` Define Spell - explicit mechanic for using **Unraveling**

+ `[S]` Cast Spell - chat message - add a box showing power gathered vs initial requirement.
+ `[S]` Cast Spell - chat message - if unaligned power was used, show harmonic type(s) (up to 3 for the GM to choose from in case of ex-aequo).
+ `[C]` Cast Spell - Open a dialog on GM side to ask which harmonic they prefer, then display the choice in chat.
+ `[C]` Cast Spell - When enough aligned Power has been drawn, the spell is immediately cast also (no harmonics generated) or a chat message is generated at least.
+ `[S]` Cast Spell - When a Joker is drawn, the spell is immediately cast a.k.a. **Wild Spell** (fr: Surcharge thaumique)

+ `[C]` Release Power - Prevent releasing of aligned Power (or at least add confirmation dialog)
+ `[S]` Release Power - Show the harmonic type on unaligned power cards
  + Spades / Spiritual (fr: spirituelle)
  + Hearts / Emotional (fr: émotionnelle)
  + Diamonds / Material (fr: matérielle)
  + Clubs / Elemental (fr: élémentaire)

+ `[C]` Cooperation on spellcasting - implement sopmething specific for this (ROI not great) or just document in the userguide how to do it with the current version of the system

+ `[C]` Confirmation dialog for Hosts when they 'Gather Power' for a Host character and 'Self Roll' isn't active

### Core mechanics not yet supported

+ `[S]` Weapon item type and weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message
+ `[C]` Support for 'Harm Rank' alternative mechanics

+ `[M]` Duel mechanics
  + [M] Duel hand initiated with 2 Red cards, 2 Black cards and 2 Jokers
  + [M] Hand action to reset it back to 2 Red, 2 Black, 2 Jokers
  + [M] Form to play 2 cards at once out of the 6.
  + [C] Macro for Host to start a duel b/w 2 characters based on a given Ability (not necessarily Fencing)
  + [C] Exchange cards are shown only when both characters have selected them
  + [C] Rest counter
  + [C] Exchanges & Rounds materialized in combat tracker
+ `[S]` Unique Fortune hand for the Host, shared by all NPCs

### From "Variations on the Great Game" and other sourcebooks

+ `[C]` Consider adding a lorebook property on spells (and showing it in the spells list)

+ `[C]` Support "Divorce Variation" / "Variante de la séparation"\
        en: In which Abilities loosen the bonds which hold them tight to their governing Suits.\
        fr: Dans laquelle les Talents ne sont plus aussi fermement liés aux domaines qui les gouvernent.

+ `[S]` Support "Hard Limit Variation" / "Variante de la modération"\
        en: In which rules are presented to limit the practice known as “hand dumping”.\ 
        fr: Dans laquelle on présente des règles limitant la pratique consistant à toujours jouer toute sa main.

+ `[S]` Support "Half-Off Variation" / "Variante de la demi-valeur"\
        en: In which the tyranny of off-Suit cards is limited.\
        fr: Dans laquelle on limite la frustration de n’avoir que des cartes mal assorties.

+ `[C]` Support "Six-Sided Variation" / "Variante à six faces"\
        en: In which rules are presented so those wicked individuals who so desire might use dice in the Great Game.\
        fr: Dans laquelle on permet aux tristes sires qui le souhaitent d’utiliser des dés lors de leurs parties.

+ `[C]` Support "Fortunate Tarot Variation" / "Variante du Tarot du destin"\
        en: In which the mysterious Tarot can be used to add flavor and uncertainty to the Great Game.\
        fr: Dans laquelle le mystérieux jeu de Tarot peut être utilisé pour ajouter un peu de saveur et d’incertitude.

+ `[C]` Support "Sorcerous Tarot Variation" / "Variante du Tarot de sorcellerie"\
        en: In which the whimsy and oddity of Magick is simulated using a Tarot deck.\
        fr: Dans laquelle on simule la fantaisie et la bizarrerie de la magie en utilisant un jeu de Tarot.

+ `[S]` Compendium pack for Abilities found in sourcebooks (English)
+ `[S]` Compendium pack for Abilities found in sourcebooks (French)

+ `[S]` Compendium pack for Spells found in sourcebooks (English)
+ `[S]` Compendium pack for Spells found in sourcebooks (French)

### Cosmetic / Other

+ `[S]` add Castle Falkenstein logo somewhere in the character sheet

+ `[S]` Ensure abilities remain in alphabetical order when dropped onto a char sheet

+ `[C]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + limit Dragon sorcery hands to 5 cards max
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup of non-generic Fae characters.

+ `[C]` Shortcut to import Abilities and Spells from a compendium pack / imported folder, which
  + does not introduce duplicates
  + fixes incorrect suit assignments
  + (optionally?) reorders alphabetically

+ `[C]` Compendium pack for non-weapon items found in the corebook (English)
+ `[C]` Compendium pack for non-weapon items found in the corebook (French)
+ `[C]` Compendium pack for non-weapon items found in sourcebooks (English)
+ `[C]` Compendium pack for non-weapon items found in the corebook (French)
+ `[C]` Shortcut to import Items from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ `[C]` Display tweak: rework item (ability, spell, ..) CSS-flow display with CSS-subgrid when Chrome implements it (could try with display: contents in the meantime)

+ `[C]` Make the Actor 'Show Players' button compatible with special dialog of 'Permission Viewer' module (pending feedback from PV owner)


+ `[C]` Possessions: location (equipped, at home, in the bank, investments, ..)
+ `[C]` Possessions: dedicated input box for Cash/Money
