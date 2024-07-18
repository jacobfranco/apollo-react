export interface GameConfig {
  name: string;
  path: string;
  isEsport: boolean;
  hasApiSupport: boolean;
}

const gameConfig: GameConfig[] = [
  {
    name: "League of Legends",
    path: "lol",
    isEsport: true,
    hasApiSupport: true,
  },
  {
    name: "Elden Ring",
    path: "eldenring",
    isEsport: false,
    hasApiSupport: false,
  },
  {
    name: "Valorant",
    path: "valorant",
    isEsport: true,
    hasApiSupport: false,
  },
  {
    name: "Animal Crossing",
    path: "animalcrossing",
    isEsport: false,
    hasApiSupport: false,
  },
  {
    name: "The First Descendent",
    path: "firstdescendent",
    isEsport: false,
    hasApiSupport: false,
  },
];

export default gameConfig;
