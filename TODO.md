#MosCoW
`[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
🔥 Personal project maintainer GM needs

+ `[M🔥]` **Fortune and Sorcery hands** as embedded in Characters, accessible via links in the Character sheet.

+ `[M🔥]` Ability **Perform Feat** menu to each Ability entry
  + Allow to select cards to play (0-4), and results in a chat message showing:
    + total score
    + detail (feat + cards)
    + collapsible section or GM-only with ranges for which the Feat is a Fumble, Failure, Partial Success, Full Success and High Success (if 'display of Dwarf variant Difficulty levels' is enable in the settings)
  + Remove 'Play' control from Fortune Cards (all cards if implemented at the same time as "Cast Spell" below)
  + as a collapsible, the ranges of difficulties for which it is a Fumble, Failure, Partial Success, Full Success and High Success

+ `[M🔥]` Add a **Cast Spell** menu to each Spell entry
  + player (or GM) can choose spell definitions
  + player (or GM) can cancel an onging spell, which discards all their Power cards
  + At each Power card drawn, produce a chat message showing the advancement toward the ongoing spell (based on its Aspect)
    + Add chat message to trigger the effect (which discards all cards from the player hand).
  + Remove 'Play' control from Fortune Cards (all cards if implemented at the same time as "Perform Feat" above)

+ `[M]` Align Hands/Cards/Pile layout with system
  + Remove default Play, Pass (except maybe for GMs), Discard, Reset controls
  + Fortune hands:
    + replace "Draw" control with **Draw Fortune** control (fills hand back to 4 from )
  + Sorcery hands:
    + replace "Draw" control with **Draw power** control (draw 1 card from Sorcery deck)
    + add Discard control for cards in Sorcery hands

+ `[M]` Add 'Fortune Deck' as a deck preset
    + Ask Talsorian if OK to add the card images directly within the game system
        + if yes, then (ask if OK to) convert them to .webp to limit bandwidth/storage usage
        + if not, then assume GM will download the deck on their own and has put it in a specific Data/ folder


+ Compendium with Abilities listed in CF corebook
+ `[M]` English
+ Compendium with Abilities listed in CF sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Abilities from a Compendium (must not introduce duplicates, but may fix incorrect suit assignments)

+ One compendium per Lorebook listed in CF corebook
  + `[M]` English
  + `[M🔥]` French
+ One Compendium per Lorebook listed in sourcebooks
  + `[C]` English
  + `[C]` French
+ `[M]` Shortcut to load Spells from a Compendium (must not introduce duplicates, but may fix incorrect suit assignments)

+ `[S]` Shortcut in Settings to delete all empty Castle Falkenstein hands (useful when many hands created for NPCs).

+ `[S]` Weapons list and sheet (under 'Possessions' or dedicated tab)

+ `[S]` If feasible, improve suit display in 'select' controls.

+ `[S]` Fortune hand for the Host

+ `[C]` Ensure Fortune and Sorcery Decks are different before accepting new settings.
+ `[C]` Ensure Fortune and Sorcery discard piles are different before accepting new settings.
+ `[C]` Replace Fortune/Sorcery discard pile selection system setting with **Automatic creation of discard piles**

+ `[C]` Deactivate Fortune hand of NPCs (leave Sorcery hands since each NPC should still be able to cast independently in theory)

+ Possessions:
  + `[S]` Weapons list and sheet (under 'Possessions' or new tab)
  + `[C]` 'on me' / 'location' property
  + `[C]` Dedicated Cash/Money entry

+ `[C]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup ofn non-generic Fae characters.
