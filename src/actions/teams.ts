// src/actions/teams.ts

import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "src/store";
import api from "src/api";
import { teamSchema, Team } from "src/schemas/team";
import { ZodError } from "zod";

export const FETCH_TEAMS_REQUEST = "teams/FETCH_REQUEST";
export const FETCH_TEAMS_SUCCESS = "teams/FETCH_SUCCESS";
export const FETCH_TEAMS_FAILURE = "teams/FETCH_FAILURE";

export const fetchTeamsRequest = () => ({ type: FETCH_TEAMS_REQUEST });
export const fetchTeamsSuccess = (teams: Team[]) => ({
  type: FETCH_TEAMS_SUCCESS,
  payload: teams,
});
export const fetchTeamsFailure = (error: string) => ({
  type: FETCH_TEAMS_FAILURE,
  payload: error,
});

// Removed useTeamData from here

// Thunk action to fetch teams
export const fetchTeams = (
  gamePath: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchTeamsRequest());
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/teams`);
      console.log("API Response Data:", response.data);
      const parsedData = teamSchema.array().parse(response.data);

      // Dispatch without enhancing
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
