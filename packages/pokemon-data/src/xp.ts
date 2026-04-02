// Gen 1 Pokemon XP Map
// Basic: 100, Middle: 200, Final: 300, Legendary/Mythical: 1000
// Shiny bonus: +2000 (stacks with base)

export const POKEMON_BASE_XP: Record<number, number> = {
  1: 100, 2: 200, 3: 300,         // Bulbasaur line
  4: 100, 5: 200, 6: 300,         // Charmander line
  7: 100, 8: 200, 9: 300,         // Squirtle line
  10: 100, 11: 200, 12: 300,      // Caterpie line
  13: 100, 14: 200, 15: 300,      // Weedle line
  16: 100, 17: 200, 18: 300,      // Pidgey line
  19: 100, 20: 300,                // Rattata line
  21: 100, 22: 300,                // Spearow line
  23: 100, 24: 300,                // Ekans line
  25: 100, 26: 300,                // Pikachu line
  27: 100, 28: 300,                // Sandshrew line
  29: 100, 30: 200, 31: 300,      // Nidoran♀ line
  32: 100, 33: 200, 34: 300,      // Nidoran♂ line
  35: 100, 36: 300,                // Clefairy line
  37: 100, 38: 300,                // Vulpix line
  39: 100, 40: 300,                // Jigglypuff line
  41: 100, 42: 300,                // Zubat line
  43: 100, 44: 200, 45: 300,      // Oddish line
  46: 100, 47: 300,                // Paras line
  48: 100, 49: 300,                // Venonat line
  50: 100, 51: 300,                // Diglett line
  52: 100, 53: 300,                // Meowth line
  54: 100, 55: 300,                // Psyduck line
  56: 100, 57: 300,                // Mankey line
  58: 100, 59: 300,                // Growlithe line
  60: 100, 61: 200, 62: 300,      // Poliwag line
  63: 100, 64: 200, 65: 300,      // Abra line
  66: 100, 67: 200, 68: 300,      // Machop line
  69: 100, 70: 200, 71: 300,      // Bellsprout line
  72: 100, 73: 300,                // Tentacool line
  74: 100, 75: 200, 76: 300,      // Geodude line
  77: 100, 78: 300,                // Ponyta line
  79: 100, 80: 300,                // Slowpoke line
  81: 100, 82: 300,                // Magnemite line
  83: 300,                         // Farfetch'd
  84: 100, 85: 300,                // Doduo line
  86: 100, 87: 300,                // Seel line
  88: 100, 89: 300,                // Grimer line
  90: 100, 91: 300,                // Shellder line
  92: 100, 93: 200, 94: 300,      // Gastly line
  95: 300,                         // Onix
  96: 100, 97: 300,                // Drowzee line
  98: 100, 99: 300,                // Krabby line
  100: 100, 101: 300,              // Voltorb line
  102: 100, 103: 300,              // Exeggcute line
  104: 100, 105: 300,              // Cubone line
  106: 300, 107: 300,              // Hitmonlee, Hitmonchan
  108: 300,                         // Lickitung
  109: 100, 110: 300,              // Koffing line
  111: 100, 112: 300,              // Rhyhorn line
  113: 300,                         // Chansey
  114: 300,                         // Tangela
  115: 300,                         // Kangaskhan
  116: 100, 117: 300,              // Horsea line
  118: 100, 119: 300,              // Goldeen line
  120: 100, 121: 300,              // Staryu line
  122: 300,                         // Mr. Mime
  123: 300,                         // Scyther
  124: 300,                         // Jynx
  125: 300,                         // Electabuzz
  126: 300,                         // Magmar
  127: 300,                         // Pinsir
  128: 300,                         // Tauros
  129: 100, 130: 300,              // Magikarp line
  131: 300,                         // Lapras
  132: 300,                         // Ditto
  133: 100, 134: 300, 135: 300, 136: 300, // Eevee + eeveelutions
  137: 300,                         // Porygon
  138: 100, 139: 300,              // Omanyte line
  140: 100, 141: 300,              // Kabuto line
  142: 300,                         // Aerodactyl
  143: 300,                         // Snorlax
  144: 1000, 145: 1000, 146: 1000, // Legendary birds
  147: 100, 148: 200, 149: 300,    // Dratini line
  150: 1000, 151: 1000,            // Mewtwo, Mew
};

export function getPokemonBaseXp(pokedexNumber: number, isShiny: boolean): number {
  const base = POKEMON_BASE_XP[pokedexNumber] ?? 100;
  return isShiny ? base + 2000 : base;
}
