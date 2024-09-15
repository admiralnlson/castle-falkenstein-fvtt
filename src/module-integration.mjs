export class CastleFalkensteinModuleIntegration {

  static async integrateItemPiles() {
    game.itempiles.API.addSystemIntegration({

      "VERSION": "0.1.0",

      // The actor class type is the type of actor that will be used for the default item pile actor that is created on first item drop.
      "ACTOR_CLASS_TYPE": "loot",

      // The item class type that will be used for the default loot item.
	    //"ITEM_CLASS_LOOT_TYPE": "possession",

      // The item class type that will be used for the default weapon item.
      "ITEM_CLASS_WEAPON_TYPE": "weapon",

      // The item class type that will be used for the default equipment item.
      //"ITEM_CLASS_EQUIPMENT_TYPE": "equipment",

      // The currencies used in this system
      //"CURRENCIES": Array<{ primary: boolean, type: string ["attribute"/"item"], img: string, abbreviation: string, data: Object<{ path: string } / { uuid: string } / { item: object }>, exchangeRate: number }>

      // The secondary currencies used in this system
      //"SECONDARY_CURRENCIES": Array<{ type: string ["attribute"/"item"], img: string, abbreviation: string, data: Object<{ path: string } / { uuid: string } / { item: object }> }>

      // How many decimals should be shown for fractional amounts of currency (only works when only 1 currency is configured)
      //"CURRENCY_DECIMAL_DIGITS": Number

      // The property path to the system’s item price attribute
      //"ITEM_PRICE_ATTRIBUTE": "system.price",

      // The property path to the system’s item quantity attribute
      "ITEM_QUANTITY_ATTRIBUTE": "system.quantity",

      // The property path to the system’s item quantity per price attribute
      //"QUANTITY_FOR_PRICE_ATTRIBUTE": "system.quantityPerPrice"

      // What items are ignored and nost listed in item pile dialogs
      "ITEM_FILTERS": [
        {
          "path": "type",
          "filters": "ability,spell"
        }
      ],

      // How items are detected to be the same in this system. Data that distingues items differently than others, such as temporary items.
      "ITEM_SIMILARITIES": ["name", "type"],

      // Which types of items are considered to be unique, no matter what. The types configured here cannot be stacked and can only ever have a quantity of 1.
      //"UNSTACKABLE_ITEM_TYPES": ["weapon", "possession"],

      // The system specific default values for item pile actors created in this system
      //"PILE_DEFAULTS": {}

      // The system specific default values for item pile tokens created in this system
      //"TOKEN_FLAG_DEFAULTS": {}

      // An optional function that gets run over items before picked up, traded, or bought
      //"ITEM_TRANSFORMER": Function

      // An optional function that gets run when fetching the price modifier of an actor
      //"PRICE_MODIFIER_TRANSFORMER": Function

      // An optional function that runs and sets up system specific hooks relating to Item Piles
      //"SYSTEM_HOOKS": Function
    
      // An optional function that runs and sets up system specific sheet hooks to handle system specific implementations
      //"SHEET_OVERRIDES": Function

    });
  }

}