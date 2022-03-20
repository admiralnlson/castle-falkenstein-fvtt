# TODO

## Legend
+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Project maintainer (admiralnlson)'s own GM needs
+ `[✓]` Done but kept in the list for info
+ RTG = R. Talsorian Games

## Evolutions

### Cards

+ `[M]` 'Draw a single Fortune Card' button (outside of Feats), useful in some scenarios such as when a character loses all health: in an optional rule, drawing a spades card = character dies) or to help with determining purely random outcomes

+ `[S]` reset the character's Fortune/Sorcery hands and delete them when a character is deleted

+ `[C]` on Ready, display warnings about fortune/sorcery decks/piles. Perform more elaborate checks:
+ `[C]` on settings submit, error if Fortune and Sorcery Decks/Piles are the same (or prevent it by removing them for the selection list)
+ `[C]` error is not all defined at settings submit

+ `[C]` button in World settings (Host only) to delete all NPC hands

+ `[C]` Button to 'show players' a hand

### Sorcery

+ `[M🔥]` Define Spell - Allow user to specify a custom bonus/malus (with label) at spell definition time:
+ `[S]` Define Spell - explicit mechanic for using **Artefacts**
+ `[S]` Define Spell - explicit mechanic for using **Unraveling**
+ `[S]` Define Spell - explicit mechanic for using **Sorcery specialization** (as opposed to the raw Sorcery level)

+ `[S]` Cast Spell - chat message - add a box showing power gathered vs initial requirement.
+ `[S]` Cast Spell - chat message - if unaligned power was used, show harmonic type(s) (up to 3 for the GM to choose from in case of ex-aequo).
+ `[C]` Cast Spell - Open a dialog on GM side to ask which harmonic they prefer, then display the choice in chat.
+ `[C]` Cast Spell - When enough aligned Power has been drawn, the spell is immediately cast also (no harmonics generated) or a chat message is generated at least.
+ `[C]` Cast Spell - When a Joker is drawn, the spell is immediately cast a.k.a. **Wild Spell** (fr: Surcharge thaumique)

+ `[M]` Release Power - Prevent releasing of aligned Power (or at least add confirmation dialog)
+ `[C]` Release Power - Show the harmonic type on unaligned power cards
  + Spades / Spiritual (fr: spirituelle)
  + Hearts / Emotional (fr: émotionnelle)
  + Diamonds / Material (fr: matérielle)
  + Clubs / Elemental (fr: élémentaire)

+ `[C]` Cooperation on spellcasting - implement sopmething specific for this (ROI not great) or just document how to do it with the current version of the system in the Doc

+ `[C]` Button for GM to (silently) collect Power to simulate actvity from other Wizards within 15km (work-around: do it with a generic character although it will still be visible to players)

### Variations on the Great Game 

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

### Other

+ `[M]` Weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message

+ `[S]` Unique Fortune hand for the Host, shared by all NPCs

+ `[S]` add Castle Falkenstein logo somewhere in the character sheet

+ `[S]` Ensure abilities remain in alphabetical order when dropped onto a char sheet

+ `[S]` Compendium pack for Abilities found in sourcebooks (English)
+ `[S]` Compendium pack for Abilities found in sourcebooks (French)
+ `[C]` Shortcut to import Abilities from a compendium pack, which
  + does not introduce duplicates
  + fixes incorrect suit assignments
  + (optionally?) reorders alphabetically

+ `[S]` Compendium pack for Spells found in sourcebooks (English)
+ `[S]` Compendium pack for Spells found in sourcebooks (French)
+ `[C]` Shortcut to import Spells from a compendium pack, which
  + does not introduce duplicates
  + fixes incorrect suit assignments
  + (optionally?) reorders alphabetically

+ `[C]` Compendium pack for items found in the corebook (English)
+ `[C]` Compendium pack for items found in the corebook (French)
+ `[C]` Compendium pack for items found in sourcebooks (English)
+ `[C]` Compendium pack for items found in the corebook (French)
+ `[C]` Shortcut to import Items from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ `[C]` Replace item (ability, spell, ..) CSS flow display with CSS grid for better display control

+ `[C]` Make the Actor 'Show Players' button compatible with special dialog of 'Permission Viewer' module

+ `[C]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + limit Dragon sorcery hands to 5 cards max
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup of non-generic Fae characters.

+ `[C]` Possessions 'on me' / 'location' property
+ `[C]` Possessions dedicated entry for Cash/Money
