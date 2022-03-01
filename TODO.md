# TODO

## Legend

+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Personal project maintainer GM needs
+ RTG = R. Talsorian Games

## Evolutions

+ `[S]` Enhance the visual appeal, possibly adding the Castle Falkenstein logo somewhere in the character sheet (with RTG's permission)

+ `[M]` Consider skipping the need for discard piles altogether, and instead sending cards played back to their origin decks (= card reset)
  + In the book, it says Sorcery cards which are of the wrong Aspect may be put at the bottom of the Sorcery deck.

+ `[M🔥]` Spellcasting
  + Character owner may **Define a Spell** (trigger from "Cast Spell" button next to each spell in char sheet > spells tab)
    + if the Character is already casting a spell, a notification is generated telling the user to cancel the ongoing spell first
  + From a Sorcery hand, the user (if owner) may **Gather Power** (fr: Canaliser du pouvoir) -> chat message indicates advancement when the power gathered is aligned or not
    + button is disabled if no Spell is being cast
    + the chat message indicates advancement advancement towards the goal and whether the power gathered is aligned or not
    + Ideally the 'Release' button label is updated to show if Harmonics will be generated (in extremely rare cases, there can be up to 3 ex-aequo harmonics for the GM to choose from)
  + From a Sorcery hand, the user (if owner) may **Release unaligned power** (fr: Disperser le pouvoir non-aligné) at any time -> custom chat message generated?
    + button is hidden on cards with an aligned suit
  + Character owner may **Unravel** (fr: Détramer) to collect aligned power (1 point of Health per 2 points of Thaumic Power) --> chat message generated
    + button is disabled if no Spell is being cast
  + From a Sorcery hand, the user (if owner) may **Cancel the spell**, which discards their Sorcery hand and stops the ongoing spell -> chat message generated
    + button is disabled if no Spell is being cast
  + Character owner may **Cast (the spell)** (fr: Lancer le sort) when they have gathered enough Power --> chat message generated
    + button is disabled if not enough Power has been gathered
  + When a Joker is drawn, the spell is immediately cast a.k.a. **Wild Spell** (fr: Surcharge thaumique)
  + When enough aligned Power has been drawn, the spell is immediately cast also (no harmonics generated) or a chat message is generated at least.
  + The nature of Harmonics is shown at least on the 'spell cast' message, but possibly on cards as well:
    + Spades / Spiritual (fr: spirituelle)
    + Hearts / Emotional (fr: émotionnelle)
    + Diamonds / Material (fr: matérielle)
    + Clubs / Elemental (fr: élémentaire)
  + Artefacts:
    + Artefacts, new item type listed under 'Spells' (renamed 'Sorcery'?) or 'Possessions'
    + Artefacts may be selected in the 'Cast Spell' form and contribute to the amount of Thaumic Energy that is collected

+ `[S]` Document that Monarch (or other Cards UI) should be activated manually (that or enable them programmatically).

+ `[C]` Button for GM to collect power to simulate that other Wizards are within 15km

+ `[C]` Cooperation on spellcasting - implement sopmething specific for this (ROI not great) or just document how to do it with the current version of the system in the Doc

+ `[C]` add some https://foundryvtt.wiki/en/development/guides/repository-bling

+ `[M]` Refine onReady warning display about fortune/sorcery decks/piles. Perform more elaborate checks:
  + onReady, error if deck/pile setting left blank
  + warn if deck/pile mentioned in settings was deleted
  + on settings submit, error if  Fortune and Sorcery Decks/Piles are the same (or prevent it by removing them for the selection list)
  + error is not all defined at settings submit
  + warn at onReady if there are unmapped decks in the world
  + warn at onReady if a player connects and does not have access to the fortune deck --> add this to README explaining that it is for people who manage multiple tables, etc.
  + add i18n

+ `[S]` 'Draw Fortune Card' button, useful in some scenarios (such as when a character loses all health: in an optional rule, drawing a spades card = character dies) or to help with determining purely random outcomes

+ `[M]` i18n of ui.notification.'s

+ `[M]` i18n of CF deck preset

+ `[C]` Button to share hand content in chat (Sorcery hand may cause a display issue if it has many cards though)

+ `[S🔥]` Add a **Show Players** button on Actor sheets

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
