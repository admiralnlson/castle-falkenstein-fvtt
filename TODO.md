# TODO

## Legend
+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Project maintainer (admiralnlson)'s own GM needs
+ RTG = R. Talsorian Games

## Evolutions

### Cards

+ `[M]` reset the character's Fortune/Sorcery hands and delete them when a character is deleted

+ `[S]` Refine onReady warning display about fortune/sorcery decks/piles. Perform more elaborate checks:
  + on settings submit, error if Fortune and Sorcery Decks/Piles are the same (or prevent it by removing them for the selection list)
  + error is not all defined at settings submit
  + warn at onReady if a player connects and does not have access to the fortune deck --> add this to README explaining that it is for people who manage multiple tables, etc.

+ `[C]` button in World settings (Host only) to delete all NPC hands

+ `[C]` Button to 'show players' a hand

+ `[C]` 'Draw Fortune Card' button (outside of Feats), useful in some scenarios such as when a character loses all health: in an optional rule, drawing a spades card = character dies) or to help with determining purely random outcomes

+ `[C]` When accepting a user deck in the Settings, ensure its compatibility with Castle Falkenstein rules
  + checks suits have values spades/hearts/diamonds/clubs/joker and if not, error / reject the deck
  + check aces have value 14 and if not, open a dialog to ask if OK to give them value 14
  + check jokers have value 15 and if not, open a dialog to ask if OK to give them value 15
  + `[C]` check number of cards per suit is 13 and that there are 2 jokers, and show warning if not

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

### Other

+ Packs: ensure abilities and spells in packs stay sorted in alphabetical order when dropped onto a char sheet (add sorting info?)

+ Ability data packs (keeping their description to a minimum as per RTG Homebrew Content policy)
  + `[✓]` English - from Corebook
  + `[✓]` French - from Corebook
  + `[S]` English - from sourcebooks
  + `[S]` French - from sourcebooks
+ `[M]` Shortcut to import Abilities from a data pack, which
  + does not introduce duplicates
  + fixes incorrect suit assignments
  + (optionally?) reorders alphabetically

+ Lorebook data packs (keeping their description to a minimum as per RTG Homebrew Content policy)
  + `[M]` English - from Corebook
  + `[✓]` French - from Corebook
  + `[S]` English - from sourcebooks
  + `[S]` French - from sourcebooks
+ `[M]` Shortcut to import Spells from a Lorebook data pack, which
  + does not introduce duplicates
  + fixes incorrect suit assignments
  + (optionally?) reorders alphabetically

+ `[M]` Weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message

+ `[M]` Support official game variation which gives half-value to cards from an another suit

+ `[S]` Unique Fortune hand for the Host, shared by all NPCs

+ `[S]` add Castle Falkenstein logo somewhere in the character sheet

+ `[C]` Replace item (ability, spell, ..) flow display with grid for better display control

+ `[S]` Replace icons for Abilities and Spells (or remove the need for them?) 
  + in item lists
  + in macros

+ `[C]` Make character 'Show Players' button compatible with special dialog of 'Permission Viewer' module

+ `[C]` Item data packs (keeping their description to a minimum as per RTG Homebrew Content policy)
  + English - from Corebook
  + French - from Corebook
  + English - from sourcebooks
  + French - from sourcebooks
  + Shortcut to import Items from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ Possessions:
  + `[C]` 'on me' / 'location' property
  + `[C]` Dedicated Cash/Money entry

+ `[C]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + limit Dragon sorcery hands to 5 cards max
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup of non-generic Fae characters.
