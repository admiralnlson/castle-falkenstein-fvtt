# TODO

## Legend
+ MoSCoW: `[M]`ust, `[S]`hould, `[C]`ould, `[W]`on't
+ `[🔥]` Project maintainer (admiralnlson)'s own GM needs

## Potential issues

+ The Suit associated to Abilities sometimes disappear. Haven't found steps to reproduce it though.

### Mechanics from "Corebook"

+ `[M]` Duel mechanics
  + `[M]` Duel hand initiated with 2 Red cards, 2 Black cards and 2 Jokers
  + `[M]` Hand action to reset it back to 2 Red, 2 Black, 2 Jokers
  + `[M]` Form to play 2 cards at once out of the 6.
  + `[C]` Macro for Host to start a duel b/w 2 characters based on a given Ability (not necessarily Fencing)
  + `[C]` Exchange cards are shown only when both characters have selected them
  + `[C]` Rest counter
  + `[C]` Exchanges & Rounds materialized in combat tracker

### Mechanics from sourcebooks

+ `[C🔥]` Curious Creatures > Familiars
  + new form: Draw 2 Power cards / pick one to keep
    + if implemented, trash(Release Power) button can be removed from Aligned Power cards

### User Experience

+ `[C]` Allow Hosts to suggest a Perform Feat or Spell Definition (for that one, could include the spell def itself or part of it?)

+ `[C]` Ability to sort Items in the Character Sheet based on 
  + `[C]` name
  + `[C]` ability+spell: suit 
  + `[C]` ability: level
  + `[C]` spell: TL
  + `[C]` weapon: effective range, max Dmg
+ `[S] Add info text in empty Abilities table, suggesting to drag-and-drop some entries from or the entire 'imported Abilities folder'
  + `[C]` interrupt the drop and make changes or (see also "Species drop-down" list below):
  + `[C]` Mark Faerie Powers as "Faerie only"

### Attributes to lock

+ Courage (all => health)
+ Physique (all => health ; Dragons => fly speed)
+ Etherealness (Faerie => fly speed)
+ Sorcery (sorcerers => spell def) -> partially implemented

### Derived stats & Racial abilities (a.k.a 'Other' tab)

+ `[S]` Extra 'Other' tab for listing secondary attributes such as Speed (Run+Flight) or Languages known (see below)
+ Free text (w/ compendium?), specific labels with rw input, specific labels with auto-computed values?
  + Languages
  + Corebook p140 / Libre de base p194
    + Running speed
    + Flying Speed
+ Locked attributes (= should not be deletable)
  + Athletics (all -> running speed)
  + Courage (all -> health)
  + Physique (all -> health ; Dragons => flying speed)
  + Etherealness (Faerie only -> flying speed)
  + Sorcery (Sorcerers+Dragons only -> spellcast)
+ `[S]` Add a species drop-down list (Human/Fae/Dragon/Dwarf)
  + Sorcery tab unlocked by Dragon or Good Sorcery in Humans
  + give Fae talents to Fae characters only
  + compute health automatically incl. Dragons' +2 (requires Courage and Physique to be locked attributes)
  + limit Dragon sorcery to 5 cards drawn
  + list species features in the sheet
    + Faerie
      + Sensibility to Iron
      + ..
    + Dwarf
      + Immunity to Fire
      + ..
    + Dragon
      + Flying
      + Shapeshift
      + Armor
      + 5 max Power drawn

### Any card / hand
+ `[C]` Card hand button to show a Fortune or Sorcery hand in chat (or simply on screen)
+ `[S]` deplete Host or character hands before changing Decks (maybe ask for confirmation first)


### Fortune

+ `[C]` Perform Feat - allow the use of a random card (Kessel Run optional rule from CiF p77) ->> partially available thanks to Chance Card option
+ `[C]` Fortune hands - shortcut to perform any feat the character has (= add dropbox to the Perform Feat form)
+ `[C]` allow actors to use another actor's (/ player's) Fortune hand ("Host Notes" tab becomes "Host tab")
  + consider attaching Fortune hands to players as opposed to actors? (although this may reduce options)

### Sorcery

+ `[C]` Macro to delete all Host character Sorcery hands
+ `[C]` Sorcery hands - shortcut to cast any spell the character has (= add dropbox to the Define Spell form)
+ `[S]` Gather Power - add counter to help with tracking the drawing limit for Dragons
+ `[C]` Gather Power - support Familiars more natively, drawing 2 cards at once, asking which one to keep (showing both with one grayed out in chat)
+ `[S]` Gather Power (if no auto spell cast) - add a message indicating the Spell is ready to be cast
+ `[C]` Auto spell cast - when a Joker is drawn
+ `[C]` Auto spell cast - when enough aligned Power has been drawn, deleting any harmonics beforehand
+ `[S]` Release Power - Prevent releasing of aligned Power (or at least add confirmation dialog)
+ `[S]` Sorcery hand - Show the harmonic type on unaligned power cards (on the cards themselves)
+ `[S]` Allow to combine multiple spells together (CiL-en p85)
+ `[C]` Cooperation on spellcasting - implement something specific for this (ROI not great) or just document in the userguide how to do it with the current version of the system
+ `[S]` Explicit mechanic for Artefacts
+ `[S]` Explicit mechanic for Unraveling
+ `[C]` Confirmation dialog for Hosts when they 'Gather Power' for a Host character and 'Self Roll' isn't active
+ `[C]` Lorebook property on spells (and showing it in the spells list)

### Mechanics from "Comme Il Faut"

+ `[S]` Alternative Feat Resolution (EN p79, FR p128)

### Mechanics from "Variations on the Great Game"

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
+ `[S]` Lorebook from Curious Creatures (p27) + "Create Familiar"
+ `[S]` Spells/Lorebooks found in other sourcebooks than CiF and Curious Creatures (English & French)

+ `[C]` Compendium pack for non-weapon items found in the corebook (English)
+ `[C]` Compendium pack for non-weapon items found in the corebook (French)
+ `[C]` Compendium pack for non-weapon items found in sourcebooks (English)
+ `[C]` Compendium pack for non-weapon items found in sourcebooks (French)

+ `[C]` Shortcut to import all Abilities into a character (skip those already present)
+ `[C]` Shortcut to import a Lorebook into a character

### Cosmetic / Other

+ `[C]` Use Castle Falkenstein logo as Pause logo
+ `[C]` Have abilities display as 2+ columns if there is enough horizontal space (and ensure 2 in the default width)
+ `[C]` Display tweak: rework item (ability, spell, ..) CSS-flow display with CSS-subgrid when Chrome implements it (could try with display: contents in the meantime)
+ `[C]` Make the Actor 'Show Players' button compatible with special dialog of 'Ownership Viewer' module (pending feedback from module owner)
+ `[C]` Possessions: location (equipped, at home, in the bank, investments, ..)
+ `[C]` Possessions: dedicated input box for Cash/Money
+ `[C]` Tours (a.k.a. tutorials)
  + Using compendiums
  + Casting spells

### Technical

+ `[C]` See if Cards would benefit from DataModel functions (value computation, unicode suit from textual one, etc.)
+ `[C]` See if Spells would benefit from DataModel functional (unicode aspect(suit) from textual one)
