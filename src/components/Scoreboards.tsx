import LoLScoreboard from './LoLScoreboard';
import LoLScoreboardProps from './LoLScoreboard';
// import other scoreboards as they are implemented

export interface ScoreboardProps {
  gameId: number;
  [key: string]: any;
  // Add other common props if needed
}

type ScoreboardComponent = React.FC<ScoreboardProps>;

const scoreboardComponents: { [key: string]: React.FC<any> } = {
  lol: LoLScoreboard,
  // Add other scoreboards here
};

export const getScoreboardComponent = (gamePath: string): ScoreboardComponent | null => {
  return scoreboardComponents[gamePath] || null;
};
