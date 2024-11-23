import { Record, Map as ImmutableMap } from "immutable";
import { Team } from "src/schemas/team";
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_FAILURE,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_FAILURE,
} from "src/actions/teams";

interface TeamsStateProps {
  teamsById: ImmutableMap<number, Team>;
  loading: boolean;
  error: string | null;
  loadingTeamIds: Set<number>;
  teamErrors: ImmutableMap<number, string>;
}

const TeamsStateRecord = Record<TeamsStateProps>({
  teamsById: ImmutableMap<number, Team>(),
  loading: false,
  error: null,
  loadingTeamIds: new Set<number>(),
  teamErrors: ImmutableMap<number, string>(),
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

    case FETCH_TEAM_REQUEST: {
      const teamId = action.payload as number;
      const loadingTeamIds = new Set(state.get("loadingTeamIds"));
      loadingTeamIds.add(teamId);
      return state.merge({
        loadingTeamIds,
      }) as TeamsState;
    }

    case FETCH_TEAM_SUCCESS: {
      const team = action.payload as Team;
      const teamsById = state.get("teamsById").set(team.id, team);
      const loadingTeamIds = new Set(state.get("loadingTeamIds"));
      loadingTeamIds.delete(team.id);
      const teamErrors = state.get("teamErrors").delete(team.id);
      return state.merge({
        teamsById,
        loadingTeamIds,
        teamErrors,
      }) as TeamsState;
    }

    case FETCH_TEAM_FAILURE: {
      const { teamId, error } = action.payload;
      const loadingTeamIds = new Set(state.get("loadingTeamIds"));
      loadingTeamIds.delete(teamId);
      const teamErrors = state.get("teamErrors").set(teamId, error);
      return state.merge({
        loadingTeamIds,
        teamErrors,
      }) as TeamsState;
    }

    default:
      return state;
  }
}
