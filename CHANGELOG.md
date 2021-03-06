# Changelog

## [Unreleased v1.4.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.4.0) - 2022/??/??
### Added
- New Host Fortune hand, used for all Host characters (= characters which are not owned by at least one player).
### Changed
- Weapons compendium - Animal sizes now match with the ones documented in sourcebook "Curious Creatures" (Large becomes Medium ; Very Large becomes Large). A mapping to Dragon attacks in animal attack descriptions was also added for convenience.
- Decks will now be automatically reshuffled when fortune/sorcery discard piles are reset or deleted.
- Resetting or deleting a character's fortune or sorcery hand will now discard the cards it contained to the adequate discard pile, rather than reinjecting them in the deck without reshuffle.
- Deleting a character will now also delete any dedicated fortune/sorcery hands they had.
### Fixed
- Duplicated characters will no longer reuse the fortune/sorcery hands of the copied character, and have their own.
- Minor typos

## [v1.3.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.3.0) - 2022/05/30
### Added
- The default macro icon of each ability, weapon, possession or spell may now be customized in the respective sheets.

## [v1.2.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.2.0) - 2022/05/21
### Added
- Weapons list in the character sheet Possessions tab
- Weapons compendium - English
- Weapons compendium - French translation (requires the Babele module)
### Changed
- Minor cosmetic & user xp updates

## [v1.1.2](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.1.2) - 2022/05/16
### Fixed
- Fixed a v1.1.1 regression where:
  - Discard piles were no longer automatically reschuffling into empty decks
  - The 'Show Players' button on Actors was no longer doing anything
  - Monarch sheets were no longer set as the default for hands and cards (new worlds only)

## [v1.1.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.1.1) - 2022/05/05
### Fixed
- Character health now defaults to empty (previously was given the arbitrary value of 10).
- Character sheets used on the 'GM screen' module will now also display correctly after a refresh.
- Non system-specific card hands will now display correctly.

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
+ Replaced hard dependencies (on libWrapper and Monarch) which are not respected by the FoundryVTT client. Replaced with soft dependencies instead.

## [v1.0.1](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.0.1) - 2022/03/20
### Fixed
- Issue in French translation of Lorebook 'Realm of The Unknown Mind'

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
+ Monarch (Card UI enhancement) module was made a dependency.
+ Card hand permissions are now updated accordingly each time character permissions are.
+ When a player draws a card from a deck and there are none left to draw, the corresponding discard pile is now shuffled back into the deck to satisfy the request.
+ Compendium pack for Abilities mentioned in the Corebook (English + French (requires Babele module))

## [v0.2.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v0.2.0) - 2022/03/07
Core system functions available.
