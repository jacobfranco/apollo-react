import { Record, Map as ImmutableMap } from "immutable";
import { Team } from "src/schemas/team";
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_FAILURE,
} from "src/actions/teams";

interface TeamsStateProps {
  teamsById: ImmutableMap<number, Team>;
  loading: boolean;
  error: string | null;
}

const TeamsStateRecord = Record<TeamsStateProps>({
  teamsById: ImmutableMap<number, Team>(),
  loading: false,
  error: null,
});

type TeamsState = Record<TeamsStateProps> & Readonly<TeamsStateProps>;

const initialState: TeamsState = new TeamsStateRecord();

export default function teamsReducer(
  state: TeamsState = initialState,
  action: any
): TeamsState {
  switch (action.type) {
    case FETCH_TEAMS_REQUEST:
      return state.merge({ loading: true, error: null }) as TeamsState;

    case FETCH_TEAMS_SUCCESS: {
      const teamsArray = action.payload as Team[];
      let teamsById = state.get("teamsById");
      teamsArray.forEach((team) => {
        teamsById = teamsById.set(team.id, team);
      });
      return state.merge({
        teamsById,
        loading: false,
      }) as TeamsState;
    }

    case FETCH_TEAMS_FAILURE:
      return state.merge({
        loading: false,
        error: action.payload,
      }) as TeamsState;

    default:
      return state;
  }
}
