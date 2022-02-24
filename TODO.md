# TODO

## Legend

+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Personal project maintainer GM needs
+ RTG = R. Talsorian Games

## Evolutions

+ `[M🔥]` Add a **Show Players** button on Actor sheets

+ `[M🔥]` Add a **Cast Spell** menu to each Spell entry
  + player (or GM) can choose spell definitions
  + player (or GM) can cancel an ongoing spell, which discards all their Sorcery cards
  + At each Sorcery card drawn, produce a chat message showing the advancement toward the ongoing spell (based on its Aspect)
    + Add chat message to trigger the effect (which discards all cards from the player hand).

+ `[M]` Artefacts:
  + Artefacts, new item type listed under 'Spells' (renamed 'Sorcery'?) or 'Possessions'
  + Artefacts may be selected in the 'Cast Spell' form and contribute to the amount of Thaumic Energy that is collected

+ `[M]` Refine onReady warning display about fortune/sorcery decks/piles. Perform more elaborate checks:
  + onReady, error if deck/pile setting left blank
  + warn if deck/pile mentioned in settings was deleted
  + on settings submit, error if  Fortune and Sorcery Decks/Piles are the same (or prevent it by removing them for the selection list)
  + error is not all defined at settings submit
  + warn at onReady if there are unmapped decks in the world
  + warn at onReady if a player connects and does not have access to the fortune deck --> add this to README explaining that it is for people who manage multiple tables, etc.
  + add i18n

+ `[C]` Replace Fortune/Sorcery discard pile selection system setting with **Automatic creation of discard piles**

+ `[M]` i18n for card names in CF deck preset

+ `[M]` give character owner(s) permissions on their hands (when they are created or when characters change permissions).
  + listen to permission changes on characters to adapt permissions on the hand accordingly.

+ `[M]` Discard a character's Fortune/Sorcery hands and delete them when the character is deleted

+ `[M]` Prevent error "User <playername> lacks permission to create new Cards", by either
  + creating hands for player-owned characters after certain (Assitant-)GM actions (e.g. listening to events where a player made the owner of a character)
  + delegating the action to the GM programmatically via socket (but then the GM has to be present..)

+ `[M]` Add an error toast when there is no configured Deck to draw from (applicable to both Fortune and Sorcery).

+ `[M]` Add an error toast when there is no Discard pile to play cards to / discard to (applicable to both Fortune and Sorcery)
   + check this before opening the "Perform Feat / Cast Spell" dialog

+ `[M]` on Ready, programmatically activate Monarch sheets or RTUC sheets for actor hands (only if one of the modules is present)

+ `[M]` Consider upgrading the permissions on Fortune/Sorcery decks and discard piles automatically (or at least ask the GM if they want to)

+ `[M]` Consider creating the Fortune/Sorcery decks and discard piles automatically (or adding a one-click button in the Settings for it).

+ `[S]` When accepting a user deck in the Settings, ensure its compatibility with Castle Falkenstein rules
  + checks suits have values spades/hearts/diamonds/clubs/joker and if not, error / reject the deck
  + check aces have value 14 and if not, open a dialog to ask if OK to give them value 14
  + check jokers have value 15 and if not, open a dialog to ask if OK to give them value 15
  + `[C]` check number of cards per suit is 13 and that there are 2 jokers, and show warning if not

+ One data pack per Lorebook listed in CF corebook
  + `[M]` English
  + `[M]` French (exists already but kept private until potential permission granted by RTG)
+ One data pack per Lorebook listed in sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Spells from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ Data pack for Abilities listed in CF corebook
  + `[M]` English
  + `[M]` French (exists already but kept private until potential permission granted by RTG)
+ Data pack for Abilities listed in CF sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Abilities from a data pack (must not introduce duplicates, but may fix incorrect suit assignments)

+ `[M]` display an error when using a feat/spell which does not have a proper suit defined.

+ `[M]` display an error (at onReady and Settings submit times) if Fortune/Sorcery decks/discard-piles are not defined or have been deleted.

+ `[M]` Add 'Fortune Deck' as a deck preset
    + Ask RTG if OK to bundle the deck directly within the system
        + if not, then assume GM will download the deck on their own and has put it in a specific Data/ folder

+ `[C]` Shortcut in Settings to delete all empty Castle Falkenstein hands (useful when many hands created for NPCs).

+ `[S]` Support official variation which gives half-value to cards from an another suit

+ `[S]` Weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message

+ `[S]` Fortune hand for the Host, which NPCs (PCs not owned by a player) use

+ `[C]` Monarch Deck & Pile controls to reset the pile and shuffle the deck in one go.

+ Possessions:
  + `[S]` Weapons list and sheet (under 'Possessions' or new tab)
  + `[C]` 'on me' / 'location' property
  + `[C]` Dedicated Cash/Money entry

+ `[C]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup ofn non-generic Fae characters.
