export function rollEncounter(): { pokedexNumber: number; isShiny: boolean } {
  // Random Gen 1 Pokémon (1-151)
  const pokedexNumber = Math.floor(Math.random() * 151) + 1;
  
  // Shiny rate: 1/512
  const isShiny = Math.random() < 1 / 512;
  
  return { pokedexNumber, isShiny };
}
