import { Record, Map as ImmutableMap } from "immutable";
import { Player } from "src/schemas/player";
import {
  FETCH_PLAYERS_REQUEST,
  FETCH_PLAYERS_SUCCESS,
  FETCH_PLAYERS_FAILURE,
} from "src/actions/players";

interface PlayersStateProps {
  playersById: ImmutableMap<number, Player>;
  loading: boolean;
  error: string | null;
}

const PlayersStateRecord = Record<PlayersStateProps>({
  playersById: ImmutableMap<number, Player>(),
  loading: false,
  error: null,
});

type PlayersState = Record<PlayersStateProps> & Readonly<PlayersStateProps>;

const initialState: PlayersState = new PlayersStateRecord();

export default function playersReducer(
  state: PlayersState = initialState,
  action: any
): PlayersState {
  switch (action.type) {
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

    default:
      return state;
  }
}
