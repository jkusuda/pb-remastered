// Gen 1 Evolution Family Map
// Maps every Pokémon to its base-form Pokédex number.
// Used for shared candy pools (e.g. Sandslash → Sandshrew candy).

export const POKEMON_FAMILIES: Record<number, number> = {
  1: 1, 2: 1, 3: 1,         // Bulbasaur line
  4: 4, 5: 4, 6: 4,         // Charmander line
  7: 7, 8: 7, 9: 7,         // Squirtle line
  10: 10, 11: 10, 12: 10,   // Caterpie line
  13: 13, 14: 13, 15: 13,   // Weedle line
  16: 16, 17: 16, 18: 16,   // Pidgey line
  19: 19, 20: 19,            // Rattata line
  21: 21, 22: 21,            // Spearow line
  23: 23, 24: 23,            // Ekans line
  25: 25, 26: 25,            // Pikachu line
  27: 27, 28: 27,            // Sandshrew line
  29: 29, 30: 29, 31: 29,   // Nidoran♀ line
  32: 32, 33: 32, 34: 32,   // Nidoran♂ line
  35: 35, 36: 35,            // Clefairy line
  37: 37, 38: 37,            // Vulpix line
  39: 39, 40: 39,            // Jigglypuff line
  41: 41, 42: 41,            // Zubat line
  43: 43, 44: 43, 45: 43,   // Oddish line
  46: 46, 47: 46,            // Paras line
  48: 48, 49: 48,            // Venonat line
  50: 50, 51: 50,            // Diglett line
  52: 52, 53: 52,            // Meowth line
  54: 54, 55: 54,            // Psyduck line
  56: 56, 57: 56,            // Mankey line
  58: 58, 59: 58,            // Growlithe line
  60: 60, 61: 60, 62: 60,   // Poliwag line
  63: 63, 64: 63, 65: 63,   // Abra line
  66: 66, 67: 66, 68: 66,   // Machop line
  69: 69, 70: 69, 71: 69,   // Bellsprout line
  72: 72, 73: 72,            // Tentacool line
  74: 74, 75: 74, 76: 74,   // Geodude line
  77: 77, 78: 77,            // Ponyta line
  79: 79, 80: 79,            // Slowpoke line
  81: 81, 82: 81,            // Magnemite line
  83: 83,                    // Farfetch'd
  84: 84, 85: 84,            // Doduo line
  86: 86, 87: 86,            // Seel line
  88: 88, 89: 88,            // Grimer line
  90: 90, 91: 90,            // Shellder line
  92: 92, 93: 92, 94: 92,   // Gastly line
  95: 95,                    // Onix
  96: 96, 97: 96,            // Drowzee line
  98: 98, 99: 98,            // Krabby line
  100: 100, 101: 100,        // Voltorb line
  102: 102, 103: 102,        // Exeggcute line
  104: 104, 105: 104,        // Cubone line
  106: 106,                  // Hitmonlee
  107: 107,                  // Hitmonchan
  108: 108,                  // Lickitung
  109: 109, 110: 109,        // Koffing line
  111: 111, 112: 111,        // Rhyhorn line
  113: 113,                  // Chansey
  114: 114,                  // Tangela
  115: 115,                  // Kangaskhan
  116: 116, 117: 116,        // Horsea line
  118: 118, 119: 118,        // Goldeen line
  120: 120, 121: 120,        // Staryu line
  122: 122,                  // Mr. Mime
  123: 123,                  // Scyther
  124: 124,                  // Jynx
  125: 125,                  // Electabuzz
  126: 126,                  // Magmar
  127: 127,                  // Pinsir
  128: 128,                  // Tauros
  129: 129, 130: 129,        // Magikarp line
  131: 131,                  // Lapras
  132: 132,                  // Ditto
  133: 133, 134: 133, 135: 133, 136: 133, // Eevee + eeveelutions
  137: 137,                  // Porygon
  138: 138, 139: 138,        // Omanyte line
  140: 140, 141: 140,        // Kabuto line
  142: 142,                  // Aerodactyl
  143: 143,                  // Snorlax
  144: 144,                  // Articuno
  145: 145,                  // Zapdos
  146: 146,                  // Moltres
  147: 147, 148: 147, 149: 147, // Dratini line
  150: 150,                  // Mewtwo
  151: 151,                  // Mew
};

export function getFamilyId(pokedexNumber: number): number {
  return POKEMON_FAMILIES[pokedexNumber] ?? pokedexNumber;
}
