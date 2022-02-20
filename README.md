# Castle Falkenstein system for FoundryVTT
This system is for playing [Castle Falkenstein](https://rtalsoriangames.com/castle-falkenstien/) on [Foundry Virtual Tabletop](https://foundryvtt.com/).

## Supported languages
+ English
+ French
Please submit translation files for other languages as [Issues](https://github.com/admiralnlson/castle-falkenstein-foundryvtt/issues) or [Pull Requests](https://github.com/admiralnlson/castle-falkenstein-foundryvtt/pulls). See examples at [./lang/ folder](./lang/)).

## System Configuration
Before you can use this system, you need to create some decks and card piles within FoundryVTT:

| Create               | Required player permissions                          |
|----------------------|------------------------------------------------------|
| Fortune Deck         | Limited                                              |
| Fortune discard pile | Observer (relevant for Sorcerer/Dragon players only) |
| Fortune Deck         | Limited                                              |
| Sorcery discard pile | Observer (relevant for Sorcerer/Dragon players only) |

Once done, go to `Configure Settings > System Settings > Castle Falkenstein` to associate these 4 deck/piles to the Castle Falkenstein system.

(N.B. this manual process may very well be automated in a future version.)

### New Europa-styled cards
This system is pre-configured to use the 'Castle Falkstein' deck avaible free-of-charge on [R. Talsorian Games's website](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).
In order to use it, make sure you download the ZIP file and extract into this folder: `{your FoundryVTT's Data/ directory}/cards/RTG-CF-FortuneDeck/`.
Then use the preset within FoundryVTT:

![](./images/deck-preset.jpg)

## Character Sheet
The same character sheet is used for PCs and NPCs.

As per FoundryVTT default behaviour, if the permission level granted to a non-GM Player on a character is 'None' (default), then the character does not appear to the player in the Actors tab.

And here is what happens with higher Player permission levels:

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

### Alternative: Diaries as 📖 Journal Entries
To reinforce the notion of character diaries being a part of the world, the Host may elect to use dedicated 📖 Journal Entries for each Player Character's (or NPC's) Diary.
In this case, the 📖 Journal Entry should probably be drag-and-dropped into the Journal tab of the Character Sheet afterwards, for easier access by the player or Host.

## Card hands
It is highly recommended that you use the Castle Falkenstein FoundryVTT system with a Cards UI enhancement module.

| Module                                                                   | Compatibility with the Castle Falkenstein system |
|--------------------------------------------------------------------------|--------------------------------------------------|
| [🦋 Monarch](https://foundryvtt.com/packages/monarch)                    | ✅ Fully integrated                             |
| [Ready To Use Cards](https://foundryvtt.com/packages/ready-to-use-cards) | ⌛ Not compatible yet, but planned               |

## Update notes
See [CHANGELOG](./CHANGELOG.md)

## Planned features
See [TODO](./TODO.md)

## Feedback
Please report bugs and request features as [Issues in this repository](https://github.com/admiralnlson/castle-falkenstein-foundryvtt/issues).

Alternatively, you may also reach me via chat as admiralnlson#2349 on Discord.

Do not address issues you're facing with this system to R. Talsorian Games, they would not be in a position to help you.

## Thanking the author
If this FoundryVTT system is useful to you and you want to say thanks, you may [leave a comment or even buy me coffee](https://ko-fi.com/admiralnlson).

## 