# Castle Falkenstein FoundryVTT system - User Guide

# Setup required from the Host

## Fortune & Sorcery decks
This system natively supports decks based on [RTG's official Fortune Deck visuals](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).

<img src="../src/cards/01.png" alt="Ace of Hearts" width="200"/> <img src="../src/cards/13.png" alt="King of Hearts" width="200"/> <img src="../src/cards/54.png" alt="Joker" width="200"/>

Fortune and Sorcery Decks and discard piles are automatically created when the world is first loaded by the Host.

### Different language
If you started your Castle Falkenstein world before selecting your preferred language in FoundryVTT core settings, you may:
- Reset the 2 Decks (this will recall all cards from player hands and discard piles if cards had already been drawn)
- Select your language of choice in Foundry VTT core settings
- Delete the Fortune and Sorcery Decks, and finally
- press F5 to recreate them in that language.
Note this only affects the _names_ of cards. The visuals of cards shared by RTG are English only.

### Custom decks
Hosts may also use custom decks if they so desire. The following setup is required.

| Create                |of type | which has player permissions                         |
| :-------------------- | :----- | :--------------------------------------------------- |
| Fortune Deck          |Deck    | Limited                                              |
| Fortune discard pile  |Pile    | Observer                                             |
| Fortune Deck          |Deck    | Limited (relevant for Sorcerer/Dragon players only)  |
| Sorcery discard pile  |Pile    | Observer (relevant for Sorcerer/Dragon players only) |

To use RTG's official Fortune Deck visuals, make sure to select the dedicated preset within FoundryVTT:

![](./deck-preset.jpg)

Note that, at this stage, custom decks created with this preset, unlike automatically created Decks, are always in English.

Once you're done, go to `Configure Settings > System Settings > Castle Falkenstein` to register your customer deck.

Make sure you shuffle the decks before your players get a chance to draw cards from them also. The system won't do it for you.

## Host hand
At this stage, the system assumes that the Host will either
  + not use FoundryVTT for their own Fortune and Sorcery hands or
  + use Fortune and Sorcery hands specific to each 'Host character' (a.k.a. NPC) and delete them when no longer necessary so as to return any cards left within them to their origin decks
  + use a generic "Host" character (and possibly generic ability too) for the sole purpose of showing the Fortune card they are playing

This may evolve based on user feedback.

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
- give each player an 'Owner' permission on their Player Character
- give all players a 'Limited' permission on Player Characters which are not their own
- during sessions, give players a 'Limited' permission on Host characters (NPC Actors) PCs meet.

### Abilities
To initialize a character with all core abilities in one go, go to the Items tab and drag-and-drop the 'Abilities' folder to your character.

The folder will only appear if the Host first goes to the Compendium tab, look for 'Core Abilities', right clicks it and select'Import All Content'.

## Alternative: Diaries as 📖 Journal Entries
To reinforce the notion of character diaries being a part of the world, the Host may elect to use dedicated 📖 Journal Entries for each Player Character's (or NPC's) Diary.
In this case, the 📖 Journal Entry should probably be drag-and-dropped into the Journal tab of the Character Sheet afterwards, for easier access by the player and Host.
