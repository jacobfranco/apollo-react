import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from "immutable";

// TODO: Implement mfa

import {
  FETCH_TOKENS_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
} from "../actions/security.ts";

import type { AnyAction } from "redux";

const TokenRecord = ImmutableRecord({
  id: 0,
  app_name: "",
  valid_until: "",
});

const ReducerRecord = ImmutableRecord({
  tokens: ImmutableList<Token>(),
  mfa: ImmutableMap({
    settings: ImmutableMap({
      totp: false,
    }),
  }),
});

type State = ReturnType<typeof ReducerRecord>;

export type Token = ReturnType<typeof TokenRecord>;

const deleteToken = (state: State, tokenId: number) => {
  return state.update("tokens", (tokens) => {
    return tokens.filterNot((token) => token.id === tokenId);
  });
};

export default function security(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case FETCH_TOKENS_SUCCESS:
      return state.set("tokens", ImmutableList(action.tokens.map(TokenRecord)));
    case REVOKE_TOKEN_SUCCESS:
      return deleteToken(state, action.id);
    default:
      return state;
  }
}
