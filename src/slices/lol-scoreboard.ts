import { lolTeamSchema, LolTeam, lolMatchSchema, LolMatch } from 'src/schemas';

// Define constants for teams
const cloud9: LolTeam = lolTeamSchema.parse({
  name: 'Cloud9',
  kills: 21,
  gold: 41624,
  towers: 7,
  logo: '/src/assets/c9.png',
  record: '11-3',
  seed: 2,
});

const teamLiquid: LolTeam = lolTeamSchema.parse({
  name: 'Team Liquid',
  kills: 17,
  gold: 39436,
  towers: 5,
  logo: '/src/assets/tl.png',
  record: '6-8',
  seed: 7,
});

const thieves: LolTeam = lolTeamSchema.parse({
  name: '100 Thieves',
  kills: 5,
  gold: 11924,
  towers: 1,
  logo: '/src/assets/100.png',
  record: '8-6',
  seed: 5,
});

const immortals: LolTeam = lolTeamSchema.parse({
  name: 'Immortals',
  kills: 3,
  gold: 10148,
  towers: 0,
  logo: '/src/assets/immortals.png',
  record: '9-5',
  seed: 4,
});

// Define the state interface using the LolMatch type
export interface LoLScoreboardState {
  matches: LolMatch[];
}

// Update the initial state to conform to the LolMatch type
export const initialLoLScoreboardState: LoLScoreboardState = {
  matches: [
    lolMatchSchema.parse({
      id: 1,
      team1: teamLiquid,
      team2: cloud9,
      seriesInfo: 'LCS Championship Round 1',
      matchNumber: '1',
      leadingTeam: 'C9',
      leadingScore: '1-0',
    }),
    lolMatchSchema.parse({
      id: 2,
      team1: thieves,
      team2: immortals,
      seriesInfo: 'LCS Championship Round 1',
      matchNumber: '1',
      leadingTeam: 'Tied',
      leadingScore: '0-0',
    }),
    lolMatchSchema.parse({
      id: 3,
      team1: thieves,
      team2: cloud9,
      seriesInfo: 'LCS Championship Round 1',
      matchNumber: '1',
      leadingTeam: 'Tied',
      leadingScore: '0-0',
    }),
  ],
};
