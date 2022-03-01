# TODO

## Legend

+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Personal project maintainer GM needs
+ RTG = R. Talsorian Games

## Evolutions

Sorcery
+ `[M🔥]` ensure only hand owners may use hand actions
+ `[M🔥]` display more info in spell cast chat message
+ `[M]` Prevent releasing of aligned Power (or at least add confirmation dialog)
+ `[S]` Allow **Unraveling** as a way to generate Power
+ `[S]` When enough aligned Power has been drawn, the spell is immediately cast also (no harmonics generated) or a chat message is generated at least.
        Also, when a Joker is drawn, the spell is immediately cast a.k.a. **Wild Spell** (fr: Surcharge thaumique)
+ `[S]` Artefacts:
    + Artefacts, new item type listed under 'Spells' (renamed 'Sorcery'?) or 'Possessions'
    + Artefacts may be selected in the 'Cast Spell' form and contribute to the amount of Thaumic Energy that is collected
+ `[C]` The nature of Harmonics is shown at least on the 'spell cast' message, but possibly on cards as well:
  + Spades / Spiritual (fr: spirituelle)
  + Hearts / Emotional (fr: émotionnelle)
  + Diamonds / Material (fr: matérielle)
  + Clubs / Elemental (fr: élémentaire)
+ `[C]` Cooperation on spellcasting - implement sopmething specific for this (ROI not great) or just document how to do it with the current version of the system in the Doc
+ `[C]` Button for GM to collect Power to simulate actvity from other Wizards within 15km

+ `[S]` Weapons list (under 'Possessions' or dedicated tab), dedicated sheet and chat message

+ `[S🔥]` Add a **Show Players** button on Actor sheets to avoid FoundryVTT Core Actor/Journal duplication of NPCs

+ `[S]` Enhance the visual appeal, possibly adding the Castle Falkenstein logo somewhere in the character sheet (with RTG's permission)

+ `[M]` listen to permission changes on characters to adapt permissions on the hand accordingly
+ `[M]` reset the character's Fortune/Sorcery hands and delete them when a character is deleted

+ `[S]` 'Draw Fortune Card' button, useful in some scenarios (such as when a character loses all health: in an optional rule, drawing a spades card = character dies) or to help with determining purely random outcomes

+ `[C]` Button to share hand content in chat (Sorcery hand may cause a display issue if it has many cards though)

+ `[C]` Replace Fortune/Sorcery discard pile selection system setting with **Automatic creation of discard piles**
  + Consider skipping the need for discard piles altogether, and instead sending cards played back to their origin decks (= card reset + auto deck shuffle?)
    + In the book, it says Sorcery cards which are of the wrong Aspect may be put at the bottom of the Sorcery deck.
    + On the other hand, if GM wants to rmeove cards from the Sorcery deck he won't be able to.

+ `[M]` Refine onReady warning display about fortune/sorcery decks/piles. Perform more elaborate checks:
  + onReady, error if deck/pile setting left blank
  + warn if deck/pile mentioned in settings was deleted
  + on settings submit, error if  Fortune and Sorcery Decks/Piles are the same (or prevent it by removing them for the selection list)
  + error is not all defined at settings submit
  + warn at onReady if there are unmapped decks in the world
  + warn at onReady if a player connects and does not have access to the fortune deck --> add this to README explaining that it is for people who manage multiple tables, etc.
  + add i18n

+ `[M]` Document that Monarch (or other) Hand UI should be activated manually by the GM (or enable them programmatically in the system).

+ `[M]` i18n for ui.notification.'s

+ `[M]` i18n for the CF deck preset
+ `[M]` Ask RTG if OK to bundle the deck directly within the system
  + if yes, then remove  documentation about how system users need to download the images and put them in a specific folder

+ `[C]` add some https://foundryvtt.wiki/en/development/guides/repository-bling

+ `[M]` Prevent error "User <playername> lacks permission to create new Cards", by either
  + creating hands for player-owned characters after certain (Assitant-)GM actions (e.g. listening to events where a player made the owner of a character)
  + delegating the action to the GM programmatically via socket (but then the GM has to be present..)

+ `[M]` Add an error toast and ensure proper error mgt when there is no configured Deck/Pile to draw from / discard to, or the player has no permission on it.
  + Consider upgrading the permissions on Fortune/Sorcery decks and discard piles automatically (or at least ask the GM if they want to)

+ `[S]` When accepting a user deck in the Settings, ensure its compatibility with Castle Falkenstein rules
  + checks suits have values spades/hearts/diamonds/clubs/joker and if not, error / reject the deck
  + check aces have value 14 and if not, open a dialog to ask if OK to give them value 14
  + check jokers have value 15 and if not, open a dialog to ask if OK to give them value 15
  + `[C]` check number of cards per suit is 13 and that there are 2 jokers, and show warning if not

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

+ `[C]` Shortcut in Settings to delete all empty Castle Falkenstein hands (useful when many hands created for NPCs).

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
