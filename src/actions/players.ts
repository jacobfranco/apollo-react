import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "src/store";
import api from "src/api";
import { playerSchema, Player } from "src/schemas/player";
import { ZodError } from "zod";

// Action Types
export const FETCH_PLAYERS_REQUEST = "players/FETCH_REQUEST";
export const FETCH_PLAYERS_SUCCESS = "players/FETCH_SUCCESS";
export const FETCH_PLAYERS_FAILURE = "players/FETCH_FAILURE";

// Action Creators
export const fetchPlayersRequest = () => ({ type: FETCH_PLAYERS_REQUEST });

export const fetchPlayersSuccess = (players: Player[]) => ({
  type: FETCH_PLAYERS_SUCCESS,
  payload: players,
});

export const fetchPlayersFailure = (error: string) => ({
  type: FETCH_PLAYERS_FAILURE,
  payload: error,
});

// Thunk Action to Fetch Players
export const fetchPlayers = (
  gamePath: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchPlayersRequest());
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/players`);
      console.log("API Response Data:", response.data);
      const parsedData = playerSchema.array().parse(response.data);
      dispatch(fetchPlayersSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error("Zod Validation Errors:", error.errors);
        dispatch(fetchPlayersFailure("Invalid data format from API"));
      } else {
        dispatch(fetchPlayersFailure(error.message));
      }
    }
  };
};
