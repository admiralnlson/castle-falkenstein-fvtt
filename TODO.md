# MosCoW
## Legend
+ `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Personal project maintainer GM needs
+ RTG = R. Talsorian Games
## Evolutions

+ `[M🔥]` Add a **Cast Spell** menu to each Spell entry
  + player (or GM) can choose spell definitions
  + player (or GM) can cancel an ongoing spell, which discards all their Power cards
  + At each Power card drawn, produce a chat message showing the advancement toward the ongoing spell (based on its Aspect)
    + Add chat message to trigger the effect (which discards all cards from the player hand).
  + Remove 'Play' control from Fortune Cards (all cards if implemented at the same time as "Perform Feat" above)

+ `[M]` give character owner(s) permissions on their hands (when they are created or when characters change permissions).
  + listen to permission changes on characters to adapt permissions on the hand accordingly.

+ `[M]` discard fortune&sorcery hands and delete them if characeter is deleted

+ `[M]` when registering a deck, ensure it's compatibility with Castle Falkenstein rules
  + checks suits are spades/hearts/diamonds/clubs/joker (or have setting allowing to use different ones)
  + check aces have value 14 and if not, open a dialog to ask if OK to give them value 14
  + check jokers have value 15 and if not, open a dialog to ask if OK to give them value 15
  + check number of cards per suit and that there 2 jokers, and show warning if not

+ `[M]` do not display warning about fortune/sorcery decks/piles at all onReady's. Do a proper check
  + error is not all defined at onReady
  + error is not all defined at settings submit
  + warn at onReady if there are unmapped decks in the world
  + warn at onReady if a player connects and does not have access to the fortune deck --> add this to README explaining that it is for people who manage multiple tables, etc.
  + add i18n

+ One compendium per Lorebook listed in CF corebook
  + `[M]` English
  + `[M]` French (exists already but kept private until potential permission granted by RTG)
+ One Compendium per Lorebook listed in sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Spells from a Compendium (must not introduce duplicates, but may fix incorrect suit assignments)

+ Compendium with Abilities listed in CF corebook
  + `[M]` English
  + `[M]` French (exists already but kept private until potential permission granted by RTG)
+ Compendium with Abilities listed in CF sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Abilities from a Compendium (must not introduce duplicates, but may fix incorrect suit assignments)

+ `[M]` display an error when using a feat/spell which does not have a proper suit defined.

+ `[M]` display an error (at onReady and Settings submit times) if Fortune/Sorcery decks/discard-piles are not defined or have been deleted.

+ `[M]` Add 'Fortune Deck' as a deck preset
    + Ask RTG if OK to bundle the deck directly within the system
        + if not, then assume GM will download the deck on their own and has put it in a specific Data/ folder

+ `[C]` Shortcut in Settings to delete all empty Castle Falkenstein hands (useful when many hands created for NPCs).

+ `[S]` Support official variation which gives half-value to cards from an another suit

+ `[S]` Weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message

+ `[C]` Ensure Fortune and Sorcery Decks are different before accepting new settings.
+ `[C]` Ensure Fortune and Sorcery discard piles are different before accepting new settings.
+ `[C]` Replace Fortune/Sorcery discard pile selection system setting with **Automatic creation of discard piles**

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

+ Artefacts:
  + `[S]` Artefacts, new item type listed under 'Spells' (renamed 'Sorcery'?)
    + Artefacts may be selected in the 'Cast Spell' form as contribute to the amount of Poower collected
