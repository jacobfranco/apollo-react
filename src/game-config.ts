export interface GameConfig {
  name: string;
  path: string;
  isEsport: boolean;
}

const gameConfig: GameConfig[] = [
  { name: 'League of Legends', path: 'lol', isEsport: true },
  { name: 'Elden Ring', path: 'eldenring', isEsport: false },
  { name: 'Valorant', path: 'valorant', isEsport: false },
];

export default gameConfig;
