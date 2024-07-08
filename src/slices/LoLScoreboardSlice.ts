export interface Team {
  name: string;
  kills: number;
  gold: number;
  towers: number;
  logo: string;
  record: string;
  seed: number;
}

export interface Game {
  id: number;
  team1: Team;
  team2: Team;
  seriesInfo: string;
  gameNumber: string;
  leadingTeam: string;
  leadingScore: string;

}

export interface LoLScoreboardState {
  games: Game[];
}

export const initialLoLScoreboardState: LoLScoreboardState = {
  games: [
    {
      id: 1,
      team1: {
        name: 'C9',
        kills: 21,
        gold: 41624,
        towers: 7,
        logo: '/src/assets/c9.png',
        record: '11-3',
        seed: 2
      },
      team2: {
        name: 'TL',
        kills: 17,
        gold: 39436,
        towers: 5,
        logo: '/src/assets/tl.png',
        record: '6-8',
        seed: 7
      },
      seriesInfo: 'LCS Championship Round 1',
      gameNumber: "1",
      leadingTeam: "C9",
      leadingScore: "1-0"
    },
    {
      id: 2,
      team1: {
        name: '100',
        kills: 5,
        gold: 11924,
        towers: 1,
        logo: '/src/assets/100.png',
        record: '8-6',
        seed: 5
      },
      team2: {
        name: 'IMM',
        kills: 3,
        gold: 10148,
        towers: 0,
        logo: '/src/assets/immortals.png',
        record: '9-5',
        seed: 4
      },
      seriesInfo: "LCS Championship Round 1",
      gameNumber: "1",
      leadingTeam: "Tied",
      leadingScore: "0-0"
    },
  ],
};
