# Castle Falkenstein system for FoundryVTT

This system is for playing [Castle Falkenstein](https://talsorianstore.com/collections/castle-falkenstein) on [Foundry Virtual Tabletop](https://foundryvtt.com/).

Author: admiralnlson (Discord username: admiralnlson#2349).

## Supported languages
English and French.
However localization is supported. Do not hesitate to submit translations for new languages to the project maintainer (see [./lang/ folder](./lang/))


## User guide

### System Configuration
Before you may use this system, you need to create the following card elements:
- Fortune Deck* (with Limited permissions for your players)
- Fortune discard pile (with Observer permissions for your players)
- Sorcery Deck* (with Limited permissions for your players, or at least the ones playing a Sorcerer or Dragon)
- Sorcery discard pile (with Observer permissions for your players, or at least the ones playing a Sorcerer or Dragon)

Once done, go to `Configure Settings > System Settings` and pick these 4 deck/piles.

#### Castle Falkenstein-styled deck
When using this system, an official 'Castle Falkstein' deck preset is available in the deck creation menu.
In order to actually use it however, you have to manually download the deck yourself from [R. Talsorian Games's website](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/), unzip the contents and place the card .jpg files in directory `{your FoundryVTT's Data/ directory}/cards/RTG-CF-FortuneDeck/`.

### Character Sheet
A unique character sheet is used for PCs and NPCs.

As per FoundryVTT default behaviour, if the permission level granted to a non-GM Player on a character is 'None' (default), then the character does not appear to the player in the Actors tab.
Now here is what happens with higher Player permission levels:

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

General recommendation:
- give each player an 'Owner' permission on their PC
- give all players a 'Limited' permission on PCs which are not their own
- give all players a 'Limited' permission on NPCs they know exist, and do not put any sensible information in the 'Description' tab of these NPC sheets.

### Alternative: Diaries as 📖 Journal Entries
To reinforce the notion of character diaries being a part of the world of Castle Falkenstein, the Host may elect to use dedicated 📖 Journal Entries for each Player Character's (or NPC's) Diary.
In this case, the 📖 Journal Entry should probably be drag-and-dropped into the Journal tab of the Character Sheet afterwards, for easier access by the player or Host.

### Card hands
It is highly recommended that you use this system with a Cards UI enhancement module.

| Module                                                                   | Compatibility with the Castle Falkenstein system |
|--------------------------------------------------------------------------|--------------------------------------------------|
| [🦋 Monarch](https://foundryvtt.com/packages/monarch)                    | ✅ Full compatibility                           |
| [Ready To Use Cards](https://foundryvtt.com/packages/ready-to-use-cards) | ⌛ Not compatible yet, but planned               |

## Update notes
See [here](./CHANGELOG.md)

## Feedback
Please report bugs and request Bugs as [Issues in this repository](https://github.com/admiralnlson/castle-falkenstein-foundryvtt/issues).

Alternatively, you may also reach me at at admiralnlson#2349 on Discord.

## Thanking the author
If this FoundryVTT system is useful to you and you want to say thanks, you may [leave a comment or even buy me coffee](https://ko-fi.com/admiralnlson).
