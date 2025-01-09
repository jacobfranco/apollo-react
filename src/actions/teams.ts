import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "src/store";
import api from "src/api";
import { teamSchema, Team } from "src/schemas/team";
import { ZodError } from "zod";

export const FETCH_TEAMS_REQUEST = "teams/FETCH_TEAMS_REQUEST";
export const FETCH_TEAMS_SUCCESS = "teams/FETCH_TEAMS_SUCCESS";
export const FETCH_TEAMS_FAILURE = "teams/FETCH_TEAMS_FAILURE";

export const FETCH_TEAM_REQUEST = "teams/FETCH_TEAM_REQUEST";
export const FETCH_TEAM_SUCCESS = "teams/FETCH_TEAM_SUCCESS";
export const FETCH_TEAM_FAILURE = "teams/FETCH_TEAM_FAILURE";

export const fetchTeamsRequest = () => ({ type: FETCH_TEAMS_REQUEST });

export const fetchTeamsSuccess = (teams: Team[]) => ({
  type: FETCH_TEAMS_SUCCESS,
  payload: teams,
});

export const fetchTeamsFailure = (error: string) => ({
  type: FETCH_TEAMS_FAILURE,
  payload: error,
});

export const fetchTeamRequest = (teamId: number) => ({
  type: FETCH_TEAM_REQUEST,
  payload: teamId,
});

export const fetchTeamSuccess = (team: Team) => ({
  type: FETCH_TEAM_SUCCESS,
  payload: team,
});

export const fetchTeamFailure = (teamId: number, error: string) => ({
  type: FETCH_TEAM_FAILURE,
  payload: { teamId, error },
});

export const fetchTeams = (
  gamePath: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchTeamsRequest());
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/teams`);
      const data = await response.json();
      console.log("API Response Data:", data);
      const parsedData = teamSchema.array().parse(data);
      dispatch(fetchTeamsSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error("Zod Validation Errors:", error.errors);
        dispatch(fetchTeamsFailure("Invalid data format from API"));
      } else {
        dispatch(fetchTeamsFailure(error.message));
      }
    }
  };
};

export const fetchTeamById = (
  gamePath: string,
  teamId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchTeamRequest(teamId));
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/teams/${teamId}`);
      const data = await response.json();
      console.log("API Response Data:", data);
      const parsedData = teamSchema.parse(data);
      dispatch(fetchTeamSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error("Zod Validation Errors:", error.errors);
        dispatch(fetchTeamFailure(teamId, "Invalid data format from API"));
      } else {
        dispatch(fetchTeamFailure(teamId, error.message));
      }
    }
  };
};
