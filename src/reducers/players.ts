import { Record, Map as ImmutableMap } from "immutable";
import { Player } from "src/schemas/player";
import {
  FETCH_PLAYER_REQUEST,
  FETCH_PLAYER_SUCCESS,
  FETCH_PLAYER_FAILURE,
  FETCH_PLAYERS_REQUEST,
  FETCH_PLAYERS_SUCCESS,
  FETCH_PLAYERS_FAILURE,
  FETCH_PLAYERS_BY_ROSTER_FAILURE,
  FETCH_PLAYERS_BY_ROSTER_REQUEST,
  FETCH_PLAYERS_BY_ROSTER_SUCCESS,
} from "src/actions/players";

interface PlayersStateProps {
  playersById: ImmutableMap<number, Player>;
  loading: boolean;
  error: string | null;
  playersByRosterId: ImmutableMap<number, number[]>;
  rosterLoading: ImmutableMap<number, boolean>;
  rosterError: ImmutableMap<number, string | null>;
}

const PlayersStateRecord = Record<PlayersStateProps>({
  playersById: ImmutableMap<number, Player>(),
  loading: false,
  error: null,
  playersByRosterId: ImmutableMap<number, number[]>(),
  rosterLoading: ImmutableMap<number, boolean>(),
  rosterError: ImmutableMap<number, string | null>(),
});

type PlayersState = Record<PlayersStateProps> & Readonly<PlayersStateProps>;

const initialState: PlayersState = new PlayersStateRecord();

export default function playersReducer(
  state: PlayersState = initialState,
  action: any
): PlayersState {
  switch (action.type) {
    case FETCH_PLAYER_REQUEST:
      return state.set("loading", true).set("error", null);

    case FETCH_PLAYER_SUCCESS: {
      const player = action.payload;
      const playersById = state.get("playersById").set(player.id, player);
      return state.set("playersById", playersById).set("loading", false);
    }

    case FETCH_PLAYER_FAILURE:
      return state.set("loading", false).set("error", action.payload.error);
    case FETCH_PLAYERS_REQUEST:
      return state.merge({ loading: true, error: null }) as PlayersState;

    case FETCH_PLAYERS_SUCCESS: {
      const playersArray = action.payload as Player[];
      let playersById = state.get("playersById");
      playersArray.forEach((player) => {
        playersById = playersById.set(player.id, player);
      });
      return state.merge({
        playersById,
        loading: false,
      }) as PlayersState;
    }

    case FETCH_PLAYERS_FAILURE:
      return state.merge({
        loading: false,
        error: action.payload,
      }) as PlayersState;
    case FETCH_PLAYERS_BY_ROSTER_REQUEST:
      return state
        .setIn(["rosterLoading", action.payload], true)
        .setIn(["rosterError", action.payload], null);

    case FETCH_PLAYERS_BY_ROSTER_SUCCESS: {
      const { rosterId, players } = action.payload as {
        rosterId: number;
        players: Player[];
      };
      let playersById = state.get("playersById");
      players.forEach((player: Player) => {
        playersById = playersById.set(player.id, player);
      });
      return state
        .set("playersById", playersById)
        .setIn(
          ["playersByRosterId", rosterId],
          players.map((p: Player) => p.id)
        )
        .setIn(["rosterLoading", rosterId], false)
        .setIn(["rosterError", rosterId], null);
    }

    case FETCH_PLAYERS_BY_ROSTER_FAILURE:
      return state
        .setIn(["rosterLoading", action.payload.rosterId], false)
        .setIn(["rosterError", action.payload.rosterId], action.payload.error)
        .setIn(["playersByRosterId", action.payload.rosterId], []);

    default:
      return state;
  }
}
