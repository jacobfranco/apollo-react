import { AppDispatch, RootState } from "src/store";

import api from "../api";

import { fetchRelationships } from "./accounts";
import { importFetchedAccounts } from "./importer";

import type { APIEntity } from "src/types/entities";

export const FAMILIAR_FOLLOWERS_FETCH_REQUEST =
  "FAMILIAR_FOLLOWERS_FETCH_REQUEST";
export const FAMILIAR_FOLLOWERS_FETCH_SUCCESS =
  "FAMILIAR_FOLLOWERS_FETCH_SUCCESS";
export const FAMILIAR_FOLLOWERS_FETCH_FAIL = "FAMILIAR_FOLLOWERS_FETCH_FAIL";

export const fetchAccountFamiliarFollowers =
  (accountId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({
      type: FAMILIAR_FOLLOWERS_FETCH_REQUEST,
      id: accountId,
    });

    api(getState)
      .get(`/api/accounts/familiar_followers?id[]=${accountId}`)
      .then((response) => response.json())
      .then((data) => {
        const accounts = data.find(
          ({ id }: { id: string }) => id === accountId
        ).accounts;

        dispatch(importFetchedAccounts(accounts));
        dispatch(
          fetchRelationships(accounts.map((item: APIEntity) => item.id))
        );
        dispatch({
          type: FAMILIAR_FOLLOWERS_FETCH_SUCCESS,
          id: accountId,
          accounts,
        });
      })
      .catch((error) =>
        dispatch({
          type: FAMILIAR_FOLLOWERS_FETCH_FAIL,
          id: accountId,
          error,
          skipAlert: true,
        })
      );
  };
