# TODO

## Legend
+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Project maintainer (admiralnlson)'s own GM needs

## `[M]` Core version compatibility

  + Core v9 => CFv1.x
  + Core v10 => CFv2.x
    + declare CF settings as not requiring a reload

## Feature evolutions

### Explicit user requests

| User           | Request |
|----------------|:--------|
| Dame du Lac    | `[S]` Extra 'Other' tab for listing secondary attributes such as Speed (Run+Flight) or Languages known (see below) |
| Dame du Lac    | `[C]` Have abilities display as 2+ columns if there is enough horizontal space (and ensure 2 in the default width) |
| mite.railleuse | `[S]` Duel system |

### `[🔥]` Derived stats & Racial abilities (a.k.a 'Other' tab)

+ Free text (w/ compendium?), specific labels with rw input, specific labels with auto-computed values?
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

+ `[S]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + limit Dragon sorcery hands to 5 cards max
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup of non-generic Fae characters.

### Cards

+ `[S]` Shortcut to 'refill' the fortune hand in the Perform Feat form, or at least refresh the form when fortune cards are drawn from the hand itself

+ `[S]` Remove the dependency to Monarch by proposing a default Hand sheet implem (enabled by default).
  + `[S🔥]` Make sure drawn cards always appear to the right (might be the case with Monarch already but don't think it will be the case for the CF-default hand)

+ `[C]` Macro to delete all Host character hands

+ `[C]` Card hand button to show a Fortune or Sorcery hand in chat

### Sorcery

+ `[M🔥]` Define Spell - Allow user to specify a custom bonus/malus (with label?) at spell definition time
+ `[S]` Define Spell - explicit mechanic for using **Sorcery specialization** (as opposed to the raw Sorcery level)
+ `[S]` Define Spell - explicit mechanic for using **Artefacts**
+ `[S]` Define Spell - explicit mechanic for using **Unraveling**

+ `[S]` Display the name of the spell being cast in the hand itself or in the cast/cancel tooltip only and/or in the char sheet
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

### Compendiums

+ `[S]` Compendium pack for Abilities found in sourcebooks (English)
+ `[S]` Compendium pack for Abilities found in sourcebooks (French)

+ `[S]` Compendium pack for Spells found in sourcebooks (English)
+ `[S]` Compendium pack for Spells found in sourcebooks (French)


+ `[S]` Shortcut to import Abilities into a character
+ `[C]` Shortcut to import spells from a Lorebook into a character

### Cosmetic / Other

+ `[C]` add Castle Falkenstein logo somewhere in the character sheet

+ `[C]` Compendium pack for non-weapon items found in the corebook (English)
+ `[C]` Compendium pack for non-weapon items found in the corebook (French)
+ `[C]` Compendium pack for non-weapon items found in sourcebooks (English)
+ `[C]` Compendium pack for non-weapon items found in the corebook (French)
+ `[C]` Shortcut to import Items from a data pack

+ `[C]` Display tweak: rework item (ability, spell, ..) CSS-flow display with CSS-subgrid when Chrome implements it (could try with display: contents in the meantime)

+ `[C]` Make the Actor 'Show Players' button compatible with special dialog of 'Permission Viewer' module (pending feedback from PV owner)

+ `[C]` Possessions: location (equipped, at home, in the bank, investments, ..)
+ `[C]` Possessions: dedicated input box for Cash/Money

+ `[C]` Tours (a.k.a. tutorials)
  + Using compendiums
  + Casting spells
