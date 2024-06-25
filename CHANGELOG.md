# Changelog

## [v3.6.2](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.6.2) - 2023/06/26
## Fixed
+ Host Characters may use Feats again.
+ Attempting to open a Host character's Sorcery hand will no longer create extraneous Host Fortune Hands.
+ Host Characters may cast spells again.

## [v3.6.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.6.1) - 2023/06/23
## Fixed
- When a Host Character's name or permissions change, players will no longer see an error saying they're lacking permissions to update cards.
- When a Host Character is deleted, the Host's Fortune Hand no longer also gets deleted.
- When removing Player permissions on a Character, turning it into a Host Character, the Character's dedicated Fortune Hand is now automatically deleted.

## [v3.6.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.6.0) - 2024/06/02
## Added
- Support for "The Thaumixology Variation". The description of this Variation on the Great Game by @admiralnlson may be found in the [USERGUIDE](./doc/USERGUIDE.md).
## Changed
- Cards played as part of a Feat are now selected from within the Fortune hand itself, rather than a separate form.
- Drawn cards will now consistently appear on the right side of hands.
- Partially removed transparency in Fortune and Sorcery hands for better readability.
- The default icon for weapons is now a saber and pistol.
## Fixed
- Drag-and-dropping a card onto itself no longer changes the order of cards in one's hand.
- Cards in chat messages will now display in the same order as they appeared in the Fortune or Sorcery hand from which they originate.

## [v3.5.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.5.0) - 2024/05/25
### Added
- Support for Foundry V12 added
- Comme Il Faut Lorebook: The Manual of Primal Forces Raised
- Comme Il Faut Lorebook: lshigami's Realm of the Senses
### Changed
- As it turns out, versions v2.6.0 to v2.10.0 were not compatible with Foundry v10. As a consequence, these versions have been renamed v3.0.0 to v3.4.0.
- Updating settings for the Divorce, Hard Limit & Half-Off Variations will now update [Perform Feat] windows accordingly.
### Fixed
+ The Divorce Variation is now disabled by default.
+ If the Host deleted their Fortune hand without refreshing the game afterwards to recreate it, Host characters could end up with a Fortune hand of their own.
+ [Firefox] Removed white specks appearing at the bottom of selectable cards and suits in the [Perform Feat] window.

## [v3.4.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.4.0) - 2024/05/13
### Renamed version
- **This version was initially named 2.10.0. But it broke support for Foundry V10 so it was later renamed.**
### Added
+ Support for "The Divorce Variation"
+ Support for "The Hard Limit Variation"
+ Support for "The Half-Off Variation"
+ Particle effect in chat for Wild Spells
+ A check now prevents Hosts from inadvertently dropping a card from a Fortune stack (deck, hand) onto a Sorcery one, or vice versa.
### Changed
+ [GM Screen module] Improved the display of GM Screen character sheets, and allowed usage of [Perform Feat] and [Define Spell] from within them
### Fixed
+ The additional modifier label in the Define Spell dialog was going blank if edited.
+ The 'Show Others' option on spells was not displaying the thaumic level and description of spells.
+ Fixed statblock for the '.44 Drop Pistol' (damage: 4/5/6 (D) -> 3/4/5 (C))
### Removed
+ [🦋Monarch module] Dropped support for this alternative cards UI module.

## [v3.3.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.3.0) - 2023/11/19
### Renamed version
- **This version was initially named 2.9.0. But it broke support for Foundry V10 so it was later renamed.**
### Added
+ When a Feat is being performed, in case the Fortune Hand contains fewer than 4 cards, a Dialog now proposes to refill it beforehand.
### Changed
+ Cards are now drawn at random, instead of from the top of the deck. As a consequence, automatic reshuffling of decks becomes unnecessary and has been removed.
+ Cards in hands no longer overlap as much.
+ The 'Release Power' control on a Sorcery card now appears when the card is hovered. Clicking the card to zoom in on it is no longer required.
+ Compendium - Abilities: changed default Sorcery rank to 'Poor'.
+ [🦋Monarch module] Removed control labels to align with the minimalistic style of the Native UI.
### Fixed
+ [v2.8.0 regression] When drawing a Chance card, an error notification was appearing despite everything actually working fine.
+ [v2.8.0 regression] After manual deletion of the Fortune or Sorcery deck, the new automatically-created one failed to register correctly.

## [v3.2.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.2.0) - 2023/11/05
### Renamed version
- **This version was initially named 2.8.0. But it broke support for Foundry V10 so it was later renamed.**
### Added
+ Weapons now have Max Range, Conceal & Harm Rank properties, as per Comme Il Faut.
+ A new system setting allows Hosts to define whether Wounds, Harm Rank or both, must appear.
+ Compendium: replaced gunpowder weapons from the corebook with the 'over-exhaustive' list from "Comme Il Faut".
+ Compendium: added abilities from "Comme Il Faut" and "The Memoirs of Auberon of Faerie". This includes a suit change for Etherealness (♠->♣) and Kindred Powers (♣->♦).
+ A custom modifier may now be added during Spell Definition, e.g. to account for an Artefact the character possesses.
+ The name and aspect of the ongoing spell as well as Power Gathering progress are now displayed in Native UI Sorcery Hands.
+ When casting a spell before enough Power has been Gathered, a confirmation prompt appears. If confirmed, the spellcast is marked as 'forced' in the chat.
+ When casting a spell, the chat message will now display if it is a Wild Spell, or if there are any Harmonics.
### Changed
+ Aligned Spell Definitions with the ones documented in 'Comme Il Faut'.
+ When Power is Released, no chat message is produced anymore.
+ The click area for controls in native UI card hands has been decreased to match their actual sizes.
### Fixed
+ When Gathered Power does not match the Spell Aspect, the card displayed in the chat message is now semi-transparent (same as in [Perform Feat] & [Cast Spell] messages).
+ [Firefox] In Sorcery hands, cards which are in focus now display correctly with the 'Release Power' control below them.
+ [French translation] Joker names now translate also.
+ [French translation] Compendium folder names now translate also.

## [v3.1.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.1.1) - 2023/10/24
### Renamed version
- **This version was initially named 2.7.1. But it broke support for Foundry V10 so it was later renamed.**
### Fixed
+ Fixed an issue where players lacked permissions to shuffle back cards into decks.

## [v3.1.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.1.0) - 2023/10/23
### Renamed version
- **This version was initially named 2.7.0. But it broke support for Foundry V10 so it was later renamed.**
### Changed
+ Fortune and Sorcery discard piles have been removed. As per official rules, a card, once played, is now directly shuffled back into the deck.
### Fixed
+ It is now possible to drag-and-drop a card onto an empty native UI hand (already worked for a non-empty hand).
+ The Black Joker no longer disguises himself as a Red Joker.
+ A horizontal scrollbar now appears if a large number of cards are played at once, e.g. as part of a spellcast.

## [v3.0.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.0.1) - 2023/07/24
### Renamed version
- **This version was initially named 2.6.1. But it broke support for Foundry V10 so it was later renamed.**
### Fixed
+ Abilities in the Compendium were not displaying correctly.
+ Sorting Items (abilities, weapons, possessions, spells) on a character sheet was not always behaving as expected.

## [v3.0.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v3.0.0) - 2023/07/02
### Renamed version
- **This version was initially named 2.6.0. But it broke support for Foundry V10 so it was later renamed.**
### Added [The Specializations Variation]
+ Ability specializations can now be formally defined in the Abilities tab of the character sheet.
+ A sorcery specialization may now be used when casting a spell.
### Added [Foundry V11+ only]
+ The "Full Text search" function in the Actors sidebar now allows to search text present in character Descriptions.
+ The Host may use this same function to search for text present in character Diaries or Host Notes.

## [v2.5.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v2.5.0) - 2023/06/24
### Added
+ The "Perform Feat" window will now automatically refresh if the corresponding Fortune hand is refilled.
### Fixed
+ It is once again possible to drop an Item (ability, weapon, spell) by aiming below the corresponding list on the character sheet (as opposed to exactly *on* the list).

## [v2.4.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v2.4.0) - 2023/05/27
### Added [Foundry V11+ only]
+ Compatibility with Foundry V11
+ Official visual for the system in the Setup menu.
+ Compendium packs folder structure.

## [v2.3.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v2.3.0) - 2022/11/18
### Changed
+ Official RTG card visuals now have rounded corners like most playing cards have.
+ The character sheet shortcut in Fortune (resp. Sorcery) card hands now also activates the Abilities (resp. Spells) tab.
### Fixed
+ Native UI cards were not displaying correctly on Firefox.

## [v2.2.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v2.2.0) - 2022/11/15
### Added
+ The size of cards in the native cards UI may not be customized via client settings.
### Fixed
+ When popping out a cards hand via the `PopOut!` module, the resulting window is now better sized.

## [v2.1.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v2.1.0) - 2022/11/13
### Changed
+ Reduced whitespace around official RTG card visuals
+ Improved compatibility with custom card visuals which have a different width/height ratio

## [v2.0.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v2.0.0) - 2022/11/13
### Added
+ The system now has a native user interface for card hands. The '🦋Monarch' module remains usable as an alternative.
### Changed
+ As from this version of the system, Foundry V10 is the minimum required generation. Hosts who cannot migrate from V9 to V10 will need to keep using Castle Falkenstein v1.x
+ Character descriptions, diaries, host notes and ability/spell/weapon/possession descriptions now make use of the ProseMirror editor (the one proposed by default in V10 journals).
+ Card names will now be translated based on each user's language preference (assuming this language is supported by the system of course).
+ Chat messages the system generates will now, like OOC (Out Of Character) messages, have a border the same color as the user who triggered them.
+ System settings are no longer configured in a separate window (since Foundry V10 now has a dedicated tab for system configuration).
### Fixed
+ Abilities/spells/weapon/possessions dragged onto the hotbar will now produce adequate macros again.

## [v1.4.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.4.0) - 2022/08/11
### Added
+ The Host now has their own Fortune hand, used for Host characters feats (N.B. sorcerer Host characters still use individual sorcery hands).
+ A shortcut button was added in fortune and sorcery hands to open the character's sheet.
### Changed
+ In the weapons compendium, animal sizes were renamed to match the ones documented in sourcebook "Curious Creatures" (Large becomes Medium ; Very Large becomes Large). A mapping to Dragon attacks was also added for convenience.
+ Decks will now be automatically reshuffled when a discard pile is reset or deleted.
+ Resetting or deleting a character's fortune or sorcery hand will now discard the cards it contained, rather than directly reinjecting them into the deck without reshuffle.
+ Deleting a character will now automatically delete (discard) any fortune or sorcery hand they had.
### Fixed
+ Duplicated characters will no longer reuse the fortune or sorcery hands of the copied character, and have their own.
+ Tokens with 'Link Actor Data' disabled will no longer give the impression that the sorcery hand has become unusable.

## [v1.3.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.3.0) - 2022/05/30
### Added
+ The default macro icon of each ability, weapon, possession or spell may now be customized in the respective sheets.

## [v1.2.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.2.0) - 2022/05/21
### Added
+ Weapons list in the character sheet Possessions tab
+ Weapons compendium - English
+ Weapons compendium - French translation (requires the Babele module)
### Changed
+ Minor cosmetic & user xp updates

## [v1.1.2](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.1.2) - 2022/05/16
### Fixed
+ Fixed a v1.1.1 regression where:
  + Discard piles were no longer automatically reschuffling into empty decks
  + The 'Show Players' button on Actors was no longer doing anything
  + Monarch sheets were no longer set as the default for hands and cards (new worlds only)

## [v1.1.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.1.1) - 2022/05/05
### Fixed
+ Character health now defaults to empty (previously was given the arbitrary value of 10).
+ Character sheets used on the 'GM Screen' module will now also display correctly after a refresh.
+ Non system-specific card hands will now display correctly.

## [v1.1.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.1.0) - 2022/04/03
### Added
+ New 'Chance' action in Fortune card hands, which draws a single Fortune card and immediately plays it (displayed in chat)

### Changed
+ New easier-to-read visuals for the mini-cards displayed in dialogs and chat messages
+ The 'Draw' action button in Fortune card hands was renamed 'Refill' to better reflect what it does

### Fixed
+ The character sheet layout no longer breaks when the window is decreased in size.

## [v1.0.3](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.0.3) - 2022/03/23
### Fixed
+ False positive warning about players lacking permissions on decks

## [v1.0.2](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.0.2) - 2022/03/22
### Fixed
+ False positive warning about Host lacking permissions on decks
+ Replaced hard dependencies (on libWrapper and 🦋Monarch) which are not respected by the FoundryVTT client. Replaced with soft dependencies instead.

## [v1.0.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.0.1) - 2022/03/20
### Fixed
+ Issue in French translation of Lorebook 'Realm of The Unknown Mind'

## [v1.0.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.0.0) - 2022/03/20
### Changed
+ System made generally available
### Added
+ Compendium packs for Lorebooks/spells mentioned in the Corebook (English + French (requires Babele module))
+ Warning in case joining player has insufficient permission on decks or discard piles (useful for Hosts who run 2+ player tables within the same world, with each their own separate decks/discard piles).

## [v0.3.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v0.3.1) - 2022/03/16
### Changed
+ libWrapper (code controller) module is now an official dependency.
### Fixed
+ Babele compendium translations were not activating.
+ French cards folder translation was missing.

## [v0.3.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v0.3.0) - 2022/03/16
### Added
+ With permission from RTG, added a deck preset based on [R. Talsorian Games Castle Falkenstein Fortune Deck visuals](https://rtalsoriangames.com/2020/07/24/falkenstein-friday-the-fortune-deck/).
+ Fortune/Sorcery decks (based on preset above) and discard piles are now created automatically the first time the game is started. They are recreated on F5 if one of them is missing. Users may still use their own custom decks if preferred via system settings.
+ 🦋Monarch module (Card UI enhancement) module was made a dependency.
+ Card hand permissions are now updated accordingly each time character permissions are.
+ When a player draws a card from a deck and there are none left to draw, the corresponding discard pile is now shuffled back into the deck to satisfy the request.
+ Compendium pack for Abilities mentioned in the Corebook (English + French (requires Babele module))

## [v0.2.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v0.2.0) - 2022/03/07
Core system functions available.
