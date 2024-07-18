import LoLScoreboard from './LoLScoreboard';
import ValorantScoreboard from './ValorantScoreboard';

export interface ScoreboardProps {
  gameId: number;
  [key: string]: any;
  // Add other common props if needed
}

type ScoreboardComponent = React.FC<ScoreboardProps>;

const scoreboardComponents: { [key: string]: React.FC<any> } = {
  lol: LoLScoreboard,
  valorant: ValorantScoreboard,
};

export const getScoreboardComponent = (gamePath: string): ScoreboardComponent | null => {
  return scoreboardComponents[gamePath] || null;
};
