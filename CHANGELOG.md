# Changelog

## [v1.1.0](https://github.com/admiralnlson/castle-falkenstein-fvtt/releases/tag/v1.1.0) - 2022/04/03
### Added
+ New 'Chance' action in Fortune card hands, which draws a single Fortune card and immediately plays it (displayed in chat)

### Changed
+ New easier-to-read visuals for the mini-cards in dialogs and chat messages
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
