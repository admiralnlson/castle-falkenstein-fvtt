# TODO

## Legend

+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Personal project maintainer GM needs
+ RTG = R. Talsorian Games

## Evolutions

+ `[M🔥]` ensure hand actions are only accessible to Owners, not Observers

+ `[M🔥]` Consider skipping the need for discard piles altogether, and instead sending cards played back to their origin decks (= card reset + auto deck shuffle (on reset or draw?)

+ `[S🔥]` Add a **Show Players** button on Actor sheets to avoid FoundryVTT Core Actor/Journal duplication of NPCs

+ `[M🔥]` Define Spell - Allow user to specify a custom bonus/malus (with label) at spell definition time:
+ `[C]` Define Spell - explicit mechanic for using **Sorcery specialization** (as opposed to the raw Sorcery level)
+ `[C]` Define Spell - explicit mechanic for using **Artefacts**
+ `[C]` Define Spell - explicit mechanic for using **Unraveling**

+ `[M🔥]` Cast Spell - chat message - add a box showing power gathered vs initial requirement.
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

+ `[C]` Button for GM to collect Power to simulate actvity from other Wizards within 15km (work-around: do it with a generic character although it will still be visible to players)

+ `[C]` Button to 'show players' a hand

+ `[C]` Add Reset+Shuffle Deck button on discard piles
  
+ `[C]` Replace Fortune/Sorcery discard pile selection system setting with **Automatic creation of discard piles**

+ `[S]` 'Draw Fortune Card' button, useful in some scenarios (such as when a character loses all health: in an optional rule, drawing a spades card = character dies) or to help with determining purely random outcomes

+ `[M]` Add an error toast and ensure proper error mgt when Fortune/Discard Deck/Pile have not be defined in system settings or have been deleted since.
  + Consider upgrading the permissions on Fortune/Sorcery decks and discard piles automatically (or at least ask the GM if they want to)

+ `[M]` i18n for the CF deck preset
+ `[M]` Ask RTG if OK to bundle the deck directly within the system
  + if yes, then remove  documentation about how system users need to download the images and put them in a specific folder

+ `[M]` Prevent error "User <playername> lacks permission to create new Cards", by either
  + creating hands for player-owned characters after certain (Assitant-)GM actions (e.g. listening to events where a player made the owner of a character)
  + delegating the action to the GM programmatically via socket (but then the GM has to be present..)

+ `[S]` When accepting a user deck in the Settings, ensure its compatibility with Castle Falkenstein rules
  + checks suits have values spades/hearts/diamonds/clubs/joker and if not, error / reject the deck
  + check aces have value 14 and if not, open a dialog to ask if OK to give them value 14
  + check jokers have value 15 and if not, open a dialog to ask if OK to give them value 15
  + `[C]` check number of cards per suit is 13 and that there are 2 jokers, and show warning if not

+ `[M]` Document that Monarch (or other) Hand UI should be activated manually by the GM (or enable them programmatically in the system).

+ `[C]` Shortcut in Settings to delete all empty Castle Falkenstein hands (useful when many hands created for NPCs).

+ `[S]` Weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message

+ `[S]` Enhance the general visual appeal, possibly adding the Castle Falkenstein logo somewhere in the character sheet (with RTG's permission)

+ `[M]` listen to permission changes on characters to adapt permissions on the hand accordingly
+ `[M]` reset the character's Fortune/Sorcery hands and delete them when a character is deleted

+ `[M]` Refine onReady warning display about fortune/sorcery decks/piles. Perform more elaborate checks:
  + onReady, error if deck/pile setting left blank
  + warn if deck/pile mentioned in settings was deleted
  + on settings submit, error if  Fortune and Sorcery Decks/Piles are the same (or prevent it by removing them for the selection list)
  + error is not all defined at settings submit
  + warn at onReady if there are unmapped decks in the world
  + warn at onReady if a player connects and does not have access to the fortune deck --> add this to README explaining that it is for people who manage multiple tables, etc.
  + add i18n

+ `[M]` i18n for ui.notification.'s

+ `[S]` match ability/spell macro icon with the card hand one used in the ability/spell list)

+ `[C]` add some https://foundryvtt.wiki/en/development/guides/repository-bling

+ If permitted by RTG, one data pack per Lorebook listed in CF corebook
  + `[M]` English
  + `[M]` French (exists already but kept private for now)
+ If permitted by RTG, One data pack per Lorebook listed in sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Spells from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ If permitted by RTG, Data pack for Abilities listed in CF corebook
  + `[M]` English
  + `[M]` French (exists already but kept private for now)
+ If permitted by RTG, Data pack for Abilities listed in CF sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Abilities from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ `[S]` Support official game variation which gives half-value to cards from an another suit

+ `[S]` Fortune hand for the Host, which NPCs (PCs not owned by a player) use

+ `[C]` Monarch Deck & Pile controls to reset the pile and shuffle the deck in one go.

+ Possessions:
  + `[C]` 'on me' / 'location' property
  + `[C]` Dedicated Cash/Money entry

+ `[C]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + limit Dragon sorcery hands to 5 cards max
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup of non-generic Fae characters.
