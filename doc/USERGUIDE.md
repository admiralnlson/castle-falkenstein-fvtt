# Castle Falkenstein FoundryVTT system - User Guide

# Pre-requisites
The first step to using this system is to make you create create some card decks (see "New Europa-stylized deck" below) and discard piles within FoundryVTT:

|To create             |Type |Player permissions to define                          |
|:---------------------|:----|:-----------------------------------------------------|
| Fortune Deck         |Deck | Limited                                              |
| Fortune discard pile |Pile | Observer                                             |
| Fortune Deck         |Deck | Limited (relevant for Sorcerer/Dragon players only)  |
| Sorcery discard pile |Pile | Observer (relevant for Sorcerer/Dragon players only) |

Once done, go to `Configure Settings > System Settings > Castle Falkenstein` to associate these 4 deck/piles to the Castle Falkenstein system.

Make sure you shuffle the decks before your players get a chance to draw cards from them also.

(N.B. this pre-requisite may very well be automated in a future version).

## New Europa-stylized deck
This system is pre-configured to support the New Europa-stylized deck avaible free-of-charge on [R. Talsorian Games's website](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).

In order to use it, make sure you download the ZIP file and extract the .jpg images into this folder: `{your FoundryVTT Data/ directory}/cards/RTG-CF-FortuneDeck/`.
Once done, you may then use the dedicated preset within FoundryVTT:

![](./deck-preset.jpg)

# Character Sheet
The same character sheet is used for PCs and NPCs.

As per FoundryVTT default behaviour, if the permission level granted to a non-GM player on a character is 'None' (default), then the character does not appear to the player in the Actors tab.

And here is what happens with higher permission levels:

| Character sheet part | Limited | Observer | Owner  | Host (GM) |
|----------------------|:-------:|:--------:|:------:|:---------:|
| Avatar               | View    | View     | Update | Update    |
| Name                 | View    | View     | Update | Update    |
| Health & Wounds      | -       | View     | Update | Update    |
| Description          | View    | View     | Update | Update    |
| Diary                | -       | View     | Update | Update    |
| Abilities            | -       | View     | Update | Update    |
| Possessions          | -       | View     | Update | Update    |
| Spells               | -       | View     | Update | Update    |
| Host Notes           | -       | -        | -      | Update    |

General recommendation for the Host:
- give each player an 'Owner' permission on their PC
- give all players a 'Limited' permission on PCs which are not their own
- during sessions, give players a 'Limited' permission on NPCs they meet, and do not put secret information in the 'Description' tab of these NPC sheets (unless you explicitly use the 'Secret' formatting option for it)

## Alternative: Diaries as 📖 Journal Entries
To reinforce the notion of character diaries being a part of the world, the Host may elect to use dedicated 📖 Journal Entries for each Player Character's (or NPC's) Diary.
In this case, the 📖 Journal Entry should probably be drag-and-dropped into the Journal tab of the Character Sheet afterwards, for easier access by the player and Host.
