# Castle Falkenstein FoundryVTT system - User Guide

# Table of Contents
- [Fortune & Sorcery decks](#fortune--sorcery-decks)
  * [Auto-created decks and discard piles](#auto-created-decks-and-discard-piles)
  * [[Optional] Different language](#optional-different-language)
  * [[Optional] Custom decks](#optional-custom-decks)
  * [[Optional] 2+ player groups within the same world](#optional-2-player-groups-within-the-same-world)
- [Character Sheet](#character-sheet)
  * [Abilities and Spells](#abilities-and-spells)
  * [Alternative: Diaries as Journal Entries](#alternative-diaries-as-journal-entries)
- [Card hands](#card-hands)

# Fortune & Sorcery decks
## Auto-created decks and discard piles
This system natively supports decks based on [RTG's official Fortune Deck visuals](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).

<img src="../src/cards/01.png" alt="Ace of Hearts" width="200"/> <img src="../src/cards/13.png" alt="King of Hearts" width="200"/> <img src="../src/cards/54.png" alt="Joker" width="200"/>

Fortune and Sorcery Decks and discard piles are automatically created when the world is first loaded by the Host. They may be renamed or moved to a different folder.

Note that a deck with the same visuals can be manually created by selecting the dedicated preset within FoundryVTT:

![](./deck-preset.jpg)

At this stage however, such manually-created decks, unlike automatically created Decks which support localization, will always have card names in English.

## [Optional] Different language
If you started your Castle Falkenstein world before selecting your preferred language in FoundryVTT core settings, you may:
- Select your language of choice in Foundry VTT core settings
- Delete the Fortune and Sorcery Decks (this will recall all cards from player hands and discard piles if cards had already been drawn)
- press F5 to recreate them in that language.

Note this only affects the _names_ of cards. The visuals of cards shared by RTG are English only.

## [Optional] Custom decks
Hosts may use custom decks if they so desire. The following setup is required.

| Create a              |of type | which has player permissions                         |
| :-------------------- | :----- | :--------------------------------------------------- |
| Fortune Deck          |Deck    | Limited                                              |
| Fortune discard pile  |Pile    | Observer                                             |
| Fortune Deck          |Deck    | Limited (relevant for Sorcerer/Dragon players only)  |
| Sorcery discard pile  |Pile    | Observer (relevant for Sorcerer/Dragon players only) |

The Host also has to pay special attention to the 'value' card property in Decks (e.g. value of Ace is 14 (not 1), Joker is 15).
The 'suit' card property must also have a value in { spades, hearts, diamonds, clubs, joker }. Otherwise the deck won't work with the system.

Once you're done, go to `Configure Settings > System Settings > Castle Falkenstein` to register your custom decks.

Make sure you shuffle the decks before your players get a chance to draw cards from them also. The system won't do it for you.

## [Optional] 2+ player groups within the same world
Hosts who have more than one group of players playing in the same world may duplicate newly created decks and piles and decrease permissions on each deck/pile to match the permissions required by each player group (see table above).

The Host should then ensure that, at the beginning of each gaming session, the adequate set of decks and piles for each group is selected in the Castle Falkenstein system settings.\
To help remind the Host they have to do this, a warning is produced each time a player connects and they don't have access to one of the Deck/Piles.

# Character Sheet
The same character sheet is used for PCs and NPCs.

As per FoundryVTT default behaviour, if the permission level granted to a non-GM player on a character is 'None' (default), then the character does not appear to the player in the Actors tab.

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

Based on the above, a general recommendation for Host is to:
- create an Actor for each Player Character, and:
  - use permission 'Default: Limited' so all players can see the Description of their fellow players's characters, and
  - give each player an 'Owner' permission on their own Player Character of course
- create Host characters as Actors as well (rather than as Journal Items) and, during sessions, give players a 'Limited' permission on the ones which Player Characters meet before clicking on the NPC's sheet 'Show Players' button to showcase them.

The system includes a GM-only 'Show Players' button in the header of all character sheets, similar to the one found on Journal Entries in Core FoundryVTT.

## Abilities and Spells
To initialize a character with all abilities (and, if they are a sorcerer, all spells from Lorebooks they know), go to the Items tab and drag-and-drop the adequate folder to the character sheet.

The folder will only appear if the Host first goes to the Compendium tab, right clicks on each desired pack and selects 'Import All Content'.

## Alternative: Diaries as Journal Entries
To reinforce the notion of character diaries being a part of the world, the Host may elect to use dedicated Journal Entries for each Player Character's (or NPC's) Diary.
In this case, the Journal Entry should probably be drag-and-dropped into the Journal tab of the Character Sheet afterwards, for easier access by the Player or Host.

# Card hands
A character's Fortune (resp. Sorcery) hand is accessible via (and created when first-time clicking on) the link at the top-left of the Talents (resp. Spells) tab in the character sheet.

At this stage, the system assumes that the Host will either
  + not use FoundryVTT for their own Fortune and Sorcery hands or
  + use Fortune and Sorcery hands specific to each 'Host character' (a.k.a. NPC) and delete them when no longer necessary so as to return any cards left within them to their origin decks
  + use a generic "Host" character (and possibly generic abilities too) for the sole purpose of showing the Fortune card they are playing

This may evolve based on user feedback.
