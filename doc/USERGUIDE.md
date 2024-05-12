# Castle Falkenstein FoundryVTT system - User Guide
- [Fortune & Sorcery decks](#fortune--sorcery-decks)
  * [Auto-created decks](#auto-created-decks)
  * [[Optional] Other supported languages](#optional-other-supported-languages)
  * [[Optional] Custom decks](#optional-custom-decks)
  * [[Optional] 2+ player groups within the same world](#optional-2-player-groups-within-the-same-world)
- [Character Sheet](#character-sheet)
  * [Abilities and Spells](#abilities-and-spells)
  * [Alternative: Diaries as Journal Entries](#alternative-diaries-as-journal-entries)
- [Card hands](#card-hands)

# Fortune & Sorcery decks
## Auto-created decks
This system natively supports [RTG's official Fortune Deck visuals](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).

<img src="../src/cards/01.png" alt="Ace of Hearts" width="200"/> <img src="../src/cards/13.png" alt="King of Hearts" width="200"/> <img src="../src/cards/54.png" alt="Joker" width="200"/>

Fortune and Sorcery Decks are automatically created when the world is first loaded by the Host. They may be renamed or moved to a different folder.

## [Optional] Other supported languages
Selecting one of the languages this system officially supports (see [README](../README.md)) in Foundry VTT core settings automatically translates most text (including Compendium text if you have the Babele module installed and activated).

The following text elements do not get automatically translated however:
1. Abilities and Spells already added to character sheets\
→ However Babele adds a button in the header of character sheets which Hosts can use to translate them.
2. Existing Fortune and Sorcery decks/cards\
→ To fix this, you need to:
   + Delete the Fortune and Sorcery Decks (this will recall all cards from hands if any)
   + Press F5 to recreate the two decks
     Note this only affects the _names_ of cards. The visuals of cards produced by RTG are in English only.
3. Any chat messages generated prior to the change\
→ There is no fixing this.

## [Optional] Custom decks
Hosts may use custom decks if they so desire. The following setup is required.

| Create a              |of type | which has player ownership                           |
| :-------------------- | :----- | :--------------------------------------------------- |
| Fortune deck          |Deck    | Limited                                              |
| Sorcery deck          |Deck    | Limited (relevant for Sorcerer/Dragon players only)  |

The Host also has to pay special attention to the 'value' card property in Decks (e.g. value of Ace is 14 (not 1), Joker is 15).
The 'suit' card property must also have a value in { spades, hearts, diamonds, clubs, joker }. Otherwise the deck won't work with the system.

## [Optional] Extra standard decks

Extra 'standard' Fortune or Sorcery decks may be created by selecting the dedicated preset within FoundryVTT:

![](./deck-preset.jpg)

N.B. At this stage, unlike automatically created ones, these decks are not automaticalled translated and are always in English.

## [Optional] Configuring custom or extra standard decks as default

Go to `Configure Settings > System Settings > Castle Falkenstein` to change which deck is the current Fortune or Sorcery one.

When the game loads for a players, a warning is produced if they don't have access to either the current Fortune or Sorcery deck.

Warning: it is not recommended to change the current Fortune or Sorcery deck while a PC or Host hand contains cards. Performing a Feat or Casting a Spell wich these cards would result in them been shuffled into a deck they do no belong.

# Character Sheet
The same character sheet is used for Dramatic Characters (= PC) and Host Characters (= NPC).

As per FoundryVTT default behaviour, if the ownership level granted to a non-GM player on a character is 'None' (default), then the character does not appear to the player in the Actors tab.

And here is what happens with higher ownership levels:

| Character sheet part | Limited | Observer | Owner  | Host (GM) |
|----------------------|:-------:|:--------:|:------:|:---------:|
| Profile image        | View    | View     | Update | Update    |
| Name                 | View    | View     | Update | Update    |
| Health & Wounds      | -       | View     | Update | Update    |
| Description          | View    | View     | Update | Update    |
| Diary                | -       | View     | Update | Update    |
| Abilities            | -       | View     | Update | Update    |
| Possessions          | -       | View     | Update | Update    |
| Spells               | -       | View     | Update | Update    |
| Host Notes           | -       | -        | -      | Update    |

Based on the above, a general recommendation for Hosts is to:
- create an Actor for each Dramatic Character (= PC), and:
  - use ownership 'Default: Limited' so all players can see the Description of their fellow players's characters, and
  - give each player an 'Owner' ownership on their own Dramatic Character of course
- create Host characters (= NPC) as Actors as well (rather than as Journal Entries) and, during sessions, give players a 'Limited' ownership on the ones which Dramatic Characters meet before clicking on the Host Character's sheet 'Show Players' button to showcase them.

The system includes a Host-only 'Show Players' button in the header of all character sheets, similar to the one found on Journal Entries in Core FoundryVTT.

## Abilities and Spells
To initialize a character with all abilities (and, if they are a sorcerer, all spells from Lorebooks they know), go to the Items tab and drag-and-drop the adequate folder to the character sheet.

The folder will only appear if the Host first goes to the Compendium tab, right clicks on each desired pack and selects 'Import All Content'.

Once imported, the "Abilities" folder in Foundry's "Items" sidebar tab may be drag-and-dropped onto the "Abilities"tab of Character sheets to initialize it with all abilities.

## Alternative: Diaries as Journal Entries
To reinforce the notion of character diaries being a part of the world, the Host may elect to have a dedicated Journal Entry for the diary of Dramatic (or Host) Characters.
In this case, a link to the Journal Entry should probably be added in the Journal tab of the Character Sheet, for easier access by the Player or Host.

# Card hands

A Dramatic character's Fortune (resp. Sorcery) hand is accessible via a link at the top-left of the Talents (resp. Spells) tab in the character sheet.
The cards hand, unless it already exists, is created when this link is clicked or when the first Feat (resp. Spell) is performed (resp. defined).

The Host has a single Fortune Hand shared by all Host Characters.
Host Characters' Sorcery Hands function the same as for Dramatic Characters: one per character.

Deleting a hand will first return all cards it contains to the parent deck.

## Chance

Fortune hands have a "? Chance" button, which draws a random card from the Fortune Deck, plays it immediately and returns the card to to the Deck.

## Special notes

### The Thaumixology Variation

This Variation on the Great Game by FVTT system author @admiralnlson, is not official in any way. However it shows up in System Settings because.. well I use this FoundryVTT system for my own personal Hosts needs also! It is entirely optional of course!

---
**The Thaumixology Variation**\
*In which Sorcerers find themselves inspired by their local bartender.*

When casting a spell, a Sorcerer may elect to use Thaumixology, which is the art of mixing Aligned and Unaligned Power in order to accelerate the casting of a spell, in exchange for a very probable Harmonic.

When using Thaumixology, the card of Unaligned power with the highest value (the one that determines the Harmonic, chosen by the Host in case of a tie) grants a number of points of Thaumic Energy equal to half of its value, rounded down (rather than just 1 point).
On the other hand, the Sorcerer cannot release Unaligned Power. The only way to release Power is to cancel the Spell entirely.

__Example:__

Sorcerer Eliasz attempts to Shake the Earth [♣].
After determining the Definitions of the Spell, the Total Thaumic Energy Requirement is 17. Eliasz decides to leverage Thaumixology for this spell.

He gathers Power: [J♣].
Aligned Power: 11 points of Thaumic Energy. Insufficient to trigger the spell.

He keeps gathering Power: [5♥].
11 + (5 / 2) = 13 points of Thaumic Energy. Still insufficient.

He persists in gathering Power: [8♥].
11 + 1 + (8 / 2) = 15 points of Thaumic Energy. Still insufficient.

Eliasz could Unravel, inflicting himself a Wound to gain the 2 points he lacks. But the situation isn't that dire.

He persists: [A♦].
11 + 1 + 1 + (14 / 2) = 20 points of Thaumic Energy. The spell triggers, with a Material Harmonic [♦].

---
