# TODO

## Legend
+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Project maintainer (admiralnlson)'s own GM needs

### Bugs

### Derived stats & Racial abilities (a.k.a 'Other' tab)

+ `[S]` Extra 'Other' tab for listing secondary attributes such as Speed (Run+Flight) or Languages known (see below)
+ Free text (w/ compendium?), specific labels with rw input, specific labels with auto-computed values?
  + Languages
  + Corebook p140 / Libre de base p194
    + Running speed (Athletics) / Vitesse de course (Athlétisme)
    + Flying Speeds (Faerie Etherealness or Dragon/Animal Physique) / Vitesses de vol (Éthéralité et Physique)
+ `[S]` Add a species drop-down list (Human/Fae/Dragon/Dwarf) and add species-specific behaviour:
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2
  + limit Dragon sorcery to 5 cards drawn
  + list species features such as Dwarf's immunity to Fire, Fae sensibility to Iron in the sheet, ..
    + Faerie Powers
      + potentially split "Fae" into "Fae (generic) / Fae (Brownie) / Fae (Pixie) / Fae (Lord/Lady)" for extra setup of non-generic Fae characters.
    + Dwarf Powers
    + Dragon
      + Flying
      + Shapeshift
      + Armor
      + 5 max Power drawn

### Cards

+ `[C]` Macro to delete all Host character Sorcery hands
+ `[C]` Card hand button to show a Fortune or Sorcery hand in chat (or simply on screen)
+ `[S]` deplete Host or character hands before changing Decks (maybe ask for confirmation first)
+ `[C]` allow actors to use another actor's (/ player's) Fortune hand ("Host Notes" tab becomes "Host tab")
  + consider attaching Fortune hands to players as opposed to actors? (although this may reduce options)

### Sorcery

+ `[C]` Sorcery hands - shortcut to cast any spell the character has (= add dropbox to the Define Spell form)
+ `[S]` Gather Power - add counter to help with tracking the drawing limit for Dragons
+ `[S]` Gather Power (if no auto spell cast) - add a message indicating the Spell is ready to be cast
+ `[C]` Auto spell cast - when a Joker is drawn
+ `[C]` Auto spell cast - when enough aligned Power has been drawn, deleting any harmonics beforehand
+ `[S]` Release Power - Prevent releasing of aligned Power (or at least add confirmation dialog)
+ `[S]` Sorcery hand - Show the harmonic type on unaligned power cards (on the cards themselves)
+ `[S]` Allow to combine multiple spells together (CiL-en p85)
+ `[C]` Cooperation on spellcasting - implement sopmething specific for this (ROI not great) or just document in the userguide how to do it with the current version of the system
+ `[S]` Explicit mechanic for Artefacts
+ `[S]` Explicit mechanic for Unraveling
+ `[C]` Confirmation dialog for Hosts when they 'Gather Power' for a Host character and 'Self Roll' isn't active
+ `[C]` Lorebook property on spells (and showing it in the spells list)

### Mechanics from "Corebook"

+ `[M]` Duel mechanics
  + [M] Duel hand initiated with 2 Red cards, 2 Black cards and 2 Jokers
  + [M] Hand action to reset it back to 2 Red, 2 Black, 2 Jokers
  + [M] Form to play 2 cards at once out of the 6.
  + [C] Macro for Host to start a duel b/w 2 characters based on a given Ability (not necessarily Fencing)
  + [C] Exchange cards are shown only when both characters have selected them
  + [C] Rest counter
  + [C] Exchanges & Rounds materialized in combat tracker

### Mechanics from "Comme Il Faut"

+ `[S]` Alternative Feat Resolution (EN p79, FR p128)

### Mechanics from "Variations on the Great Game"

+ `[C]` Support "Divorce Variation" / "Variante de la séparation"\
        en: In which Abilities loosen the bonds which hold them tight to their governing Suits.\
        fr: Dans laquelle les Talents ne sont plus aussi fermement liés aux domaines qui les gouvernent.

+ `[C]` Support "Hard Limit Variation" / "Variante de la modération"\
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

+ `[S]` Lorebook for Cantrips & Wards (CiL-en p91 / -fr p161)
+ `[S]` Abilities found in other sourcebooks than CiF and MoAoF e.g. Curious Creatures (English & French)
+ `[S]` Lorebook from Curious Creatures (p27)
+ `[S]` Spells/Lorebooks found in other sourcebooks than CiF and Curious Creatures (English & French)

+ `[C]` Shortcut to import all Abilities into a character (skip those already present)
+ `[C]` Shortcut to import a Lorebook into a character

### Cosmetic / Other

+ `[C]` add Castle Falkenstein logo somewhere in the character sheet

+ `[C]` Have abilities display as 2+ columns if there is enough horizontal space (and ensure 2 in the default width)
,
+ `[C]` Compendium pack for non-weapon items found in the corebook (English)
+ `[C]` Compendium pack for non-weapon items found in the corebook (French)
+ `[C]` Compendium pack for non-weapon items found in sourcebooks (English)
+ `[C]` Compendium pack for non-weapon items found in sourcebooks (French)

+ `[C]` Display tweak: rework item (ability, spell, ..) CSS-flow display with CSS-subgrid when Chrome implements it (could try with display: contents in the meantime)

+ `[C]` Make the Actor 'Show Players' button compatible with special dialog of 'Permission Viewer' module (pending feedback from PV owner)

+ `[C]` Possessions: location (equipped, at home, in the bank, investments, ..)
+ `[C]` Possessions: dedicated input box for Cash/Money

+ `[C]` Tours (a.k.a. tutorials)
  + Using compendiums
  + Casting spells

### Technical

+ `[C]` See if Cards would benefit from DataModel functions (value computation, unicode suit from textual one, etc.)
+ `[C]` See if Spells would benefit from DataModel functional (unicode aspect(suit) from textual one)
