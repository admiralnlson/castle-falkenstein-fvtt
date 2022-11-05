# Castle Falkenstein FoundryVTT system - User Guide
- [Fortune & Sorcery decks](#fortune--sorcery-decks)
  * [Auto-created decks and discard piles](#auto-created-decks-and-discard-piles)
  * [[Optional] Other supported languages](#optional-other-supported-languages)
  * [[Optional] Custom decks](#optional-custom-decks)
  * [[Optional] 2+ player groups within the same world](#optional-2-player-groups-within-the-same-world)
- [Character Sheet](#character-sheet)
  * [Abilities and Spells](#abilities-and-spells)
  * [Alternative: Diaries as Journal Entries](#alternative-diaries-as-journal-entries)
- [Card hands](#card-hands)

# Fortune & Sorcery decks
## Auto-created decks and discard piles
This system natively supports [RTG's official Fortune Deck visuals](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).

<img src="../src/cards/01.png" alt="Ace of Hearts" width="200"/> <img src="../src/cards/13.png" alt="King of Hearts" width="200"/> <img src="../src/cards/54.png" alt="Joker" width="200"/>

Fortune and Sorcery Decks and discard piles are automatically created when the world is first loaded by the Host. They may be renamed or moved to a different folder.

Note that a deck with the same visuals can be manually created by selecting the dedicated preset within FoundryVTT:

![](./deck-preset.jpg)

At this stage however, such manually created decks, unlike automatically created ones, will always have card names in English.

## [Optional] Other supported languages
Selecting one of the languages this system officially supports (see [README](../README.md)) in Foundry VTT core settings automatically translates most text (including Compendium text if you have the Babele module installed and activated).

The following text elements do not get automatically translated however:
1. Abilities and Spells already added to character sheets\
→ However Babele adds a button in the header of character sheets which Hosts can use to translate them.
2. Existing Fortune and Sorcery decks/cards\
→ To fix this, you need to:
   + Delete the Fortune and Sorcery Decks (this will recall all cards from hands and discard piles if any)
   + Press F5 to recreate the two decks
     Note this only affects the _names_ of cards. The visuals of cards produced by RTG are in English only.
3. Any chat messages generated prior to the change\
→ There is no fixing this.

## [Optional] Custom decks
Hosts may use custom decks if they so desire. The following setup is required.

| Create a              |of type | which has player permissions                         |
| :-------------------- | :----- | :--------------------------------------------------- |
| Fortune deck          |Deck    | Limited                                              |
| Fortune discard pile  |Pile    | Observer                                             |
| Sorcery deck          |Deck    | Limited (relevant for Sorcerer/Dragon players only)  |
| Sorcery discard pile  |Pile    | Observer (relevant for Sorcerer/Dragon players only) |

The Host also has to pay special attention to the 'value' card property in Decks (e.g. value of Ace is 14 (not 1), Joker is 15).
The 'suit' card property must also have a value in { spades, hearts, diamonds, clubs, joker }. Otherwise the deck won't work with the system.

Once you're done, go to `Configure Settings > System Settings > Castle Falkenstein` to register your custom decks.

Make sure you shuffle the decks before your players get a chance to draw cards from them also. The system nmay not do it for you.

## [Optional] 2+ player groups within the same world
Hosts who have more than one group of players playing in the same world may wish to use separate decks for each group.

To achieve this, the Host should duplicate newly created decks and piles and then decrease permissions on each deck/pile to match the permissions required by each player group (see table above).

The Host should however ensure that, at the beginning of each gaming session, the adequate set of decks and piles for each group is selected in the Castle Falkenstein system settings. Otherwise, the 2 may end get mixed, leading to errors down the road\
To help remind the Host they have to do this, a warning is produced each time a player connects and they don't have access to one of the Deck/Piles.

Recommendation: due to the

# Character Sheet
The same character sheet is used for Dramatic Characters (= PC) and Host Characters (= NPC).

As per FoundryVTT default behaviour, if the ownership level granted to a non-GM player on a character is 'None' (default), then the character does not appear to the player in the Actors tab.

And here is what happens with higher permission levels:

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
  - use permission 'Default: Limited' so all players can see the Description of their fellow players's characters, and
  - give each player an 'Owner' permission on their own Dramatic Character of course
- create Host characters (= NPC) as Actors as well (rather than as Journal Entries) and, during sessions, give players a 'Limited' permission on the ones which Dramatic Characters meet before clicking on the Host Character's sheet 'Show Players' button to showcase them.

The system includes a Host-only 'Show Players' button in the header of all character sheets, similar to the one found on Journal Entries in Core FoundryVTT.

## Abilities and Spells
To initialize a character with all abilities (and, if they are a sorcerer, all spells from Lorebooks they know), go to the Items tab and drag-and-drop the adequate folder to the character sheet.

The folder will only appear if the Host first goes to the Compendium tab, right clicks on each desired pack and selects 'Import All Content'.

## Alternative: Diaries as Journal Entries
To reinforce the notion of character diaries being a part of the world, the Host may elect to have a dedicated Journal Entry for the diary of Dramatic (or Host) Characters.
In this case, a link to the Journal Entry should probably be added in the Journal tab of the Character Sheet, for easier access by the Player or Host.

# Card hands

A Dramatic character's Fortune (resp. Sorcery) hand is accessible via a link at the top-left of the Talents (resp. Spells) tab in the character sheet.
The cards hand is first created when the link is clicked or the first Feat (resp. Spell) is performed (resp. defined).

The Host has a single Fortune Hand shared by all Host Characters.
Host Character's Sorcery Hands function the same as for Dramatic Characters (one per character, created the first time it is needed).

Deleting a hand will first discard all cards it contains, making it a safe way to get rid of a hand which is no longer useful.

## Chance

Fortune hands have a "? Chance" button, which draws the top card from the Fortune Deck and plays it immediately.
