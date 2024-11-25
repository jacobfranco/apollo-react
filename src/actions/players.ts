import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "src/store";
import api from "src/api";
import { playerSchema, Player } from "src/schemas/player";
import { ZodError } from "zod";

export const FETCH_PLAYER_REQUEST = "players/FETCH_PLAYER_REQUEST";
export const FETCH_PLAYER_SUCCESS = "players/FETCH_PLAYER_SUCCESS";
export const FETCH_PLAYER_FAILURE = "players/FETCH_PLAYER_FAILURE";

export const FETCH_PLAYERS_REQUEST = "players/FETCH_REQUEST";
export const FETCH_PLAYERS_SUCCESS = "players/FETCH_SUCCESS";
export const FETCH_PLAYERS_FAILURE = "players/FETCH_FAILURE";

export const FETCH_PLAYERS_BY_ROSTER_REQUEST =
  "players/FETCH_BY_ROSTER_REQUEST";
export const FETCH_PLAYERS_BY_ROSTER_SUCCESS =
  "players/FETCH_BY_ROSTER_SUCCESS";
export const FETCH_PLAYERS_BY_ROSTER_FAILURE =
  "players/FETCH_BY_ROSTER_FAILURE";

export const fetchPlayerRequest = (playerId: number) => ({
  type: FETCH_PLAYER_REQUEST,
  payload: playerId,
});

export const fetchPlayerSuccess = (player: Player) => ({
  type: FETCH_PLAYER_SUCCESS,
  payload: player,
});

export const fetchPlayerFailure = (playerId: number, error: string) => ({
  type: FETCH_PLAYER_FAILURE,
  payload: { playerId, error },
});

export const fetchPlayersRequest = () => ({ type: FETCH_PLAYERS_REQUEST });

export const fetchPlayersSuccess = (players: Player[]) => ({
  type: FETCH_PLAYERS_SUCCESS,
  payload: players,
});

export const fetchPlayersFailure = (error: string) => ({
  type: FETCH_PLAYERS_FAILURE,
  payload: error,
});

export const fetchPlayersByRosterRequest = (rosterId: number) => ({
  type: FETCH_PLAYERS_BY_ROSTER_REQUEST,
  payload: rosterId,
});

export const fetchPlayersByRosterSuccess = (
  rosterId: number,
  players: Player[]
) => ({
  type: FETCH_PLAYERS_BY_ROSTER_SUCCESS,
  payload: { rosterId, players },
});

export const fetchPlayersByRosterFailure = (
  rosterId: number,
  error: string
) => ({
  type: FETCH_PLAYERS_BY_ROSTER_FAILURE,
  payload: { rosterId, error },
});

export const fetchPlayerById = (
  gamePath: string,
  playerId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchPlayerRequest(playerId));
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/players/${playerId}`);
      const parsedData = playerSchema.parse(response.data);
      dispatch(fetchPlayerSuccess(parsedData));
    } catch (error: any) {
      const errorMessage =
        error instanceof ZodError
          ? "Invalid data format from API"
          : error.message;
      dispatch(fetchPlayerFailure(playerId, errorMessage));
    }
  };
};

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

export const fetchPlayersByRosterId = (
  rosterId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchPlayersByRosterRequest(rosterId));
    try {
      const client = api(getState);
      const response = await client.get(`/api/rosters/${rosterId}/players`);
      const parsedData = playerSchema.array().parse(response.data);
      dispatch(fetchPlayersByRosterSuccess(rosterId, parsedData));
    } catch (error: any) {
      const errorMessage =
        error instanceof ZodError
          ? "Invalid data format from API"
          : error.message;
      dispatch(fetchPlayersByRosterFailure(rosterId, errorMessage));
    }
  };
};
