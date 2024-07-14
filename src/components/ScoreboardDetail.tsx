// src/components/ScoreboardDetail.tsx
import LolScoreboardDetail from './LolScoreboardDetail';
import ValorantScoreboardDetail from './ValorantScoreboardDetail';

export interface ScoreboardDetailProps {
  gameId: number;
  [key: string]: any;
}

type ScoreboardDetailComponent = React.FC<ScoreboardDetailProps>;

const scoreboardDetailComponents: { [key: string]: ScoreboardDetailComponent } = {
  lol: LolScoreboardDetail,
  valorant: ValorantScoreboardDetail,
};

export const getScoreboardDetailComponent = (gamePath: string): ScoreboardDetailComponent | null => {
  return scoreboardDetailComponents[gamePath] || null;
};
