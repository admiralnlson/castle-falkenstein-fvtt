# MUST
+ `[MUST]  ` System setting to declare: **Fortune deck**
  + Reset Character Fortune hands if Fortune deck is changed.
+ `[MUST]  ` System setting to declare: **Sorcery deck**
  + Reset Character Fortune hands if Fortune deck is changed.
+ `[MUST]  ` System setting to declare: **Discard pile** or, simply, create it automatically.
+ `[MUST]  ` **Fortune and Sorcery hands** as embedded in Characters, accessible via links in the Character sheet.
  + Hide "Pass control from non-GMs
  + Character Fortune hands:
    + Replace "Draw" control with **Draw Fortune** control (fills hand back to 4 from )
    + `[COULD] ` Deactivate Fortune hand of NPCs (leave Sorcery hands since each NPC should still be able to cast independently in theory)
  + Character Sorcery hands:
    + Replace "Draw" control with **Draw power** control (draw 1 card from Sorcery deck)
  + Fortune cards:
  + Remove Card "Play" control

+ `[MUST]  ` Add  'Fortune Deck' as a deck preset
    + Ask Talsorian if OK to add the card images directly within the game system
        + if yes, then (ask if OK to) convert them to .webp to limit bandwidth/storage usage
        + if not, then assume GM will download the deck on their own and has put it in a specific Data/ folder

+ `[SHOULD] ` Fortune hand for the Host

+ `[COULD] ` Deactivate Fortune hand of NPCs (leave Sorcery hands since each NPC should still be able to cast independently in theory)

+ `[MUST]  ` Ability **Perform Feat** menu to each Ability entry
  + Allow to select cards to play (0-4), and results in a chat message showing:
    + total score
    + detail (feat + cards)
    + collapsible section or GM-only with ranges for which the Feat is a Fumble, Failure, Partial Success, Full Success and High Success (if 'display of Dwarf variant Difficulty levels' is enable in the settings)
  + Remove 'Play' control from Fortune Cards (all cards if implemented at the same time as "Cast Spell" below)
  + as a collapsible, the ranges of difficulties for which it is a Fumble, Failure, Partial Success, Full Success and High Success

+ `[MUST]  ` Add a **Cast Spell** menu to each Spell entry
  + player (or GM) can choose spell definitions
  + player (or GM) can cancel an onging spell, which discards all their Power cards
  + At each Power card drawn, produce a chat message showing the advancement toward the ongoing spell (based on its Aspect)
    + Add chat message to trigger the effect (which discards all cards from the player hand).
  + Remove 'Play' control from Fortune Cards (all cards if implemented at the same time as "Perform Feat" above)

+ `[SHOULD]` Weapons list and sheet (under 'Possessions' or dedicated tab)

+ `[SHOULD]` Compendium with Abilities from CF corebook
+ `[SHOULD]` Fill new Character Sheet with all Abilities (as documented in the core book)
+ `[COULD]` Compendium with Abilities listed in sourcebooks

+ `[SHOULD]` Compendium with Lorebooks from CF corebook
+ `[COULD] ` Compendium with Spells listed in sourcebooks
+ `[COULD] ` Shortcut to load all spells from an Occult Book (as documented in the core book)

+ `[SHOULD]` If feasible, Red color for hearts and diamonds in 'select' controls.

+ Possessions:
  + `[SHOULD]` Weapons list and sheet (under 'Possessions' or new tab)
  + `[COULD] ` 'on me' / 'location' property
  + `[COULD] ` Dedicated Cash/Money entry

+ `[COULD] ` Species-specific logic:
+ `[COULD] ` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..)
  + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup ofn non-generic Fae characters.
