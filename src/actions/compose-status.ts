import { AppDispatch, RootState } from "src/store";

import type { Status } from "src/types/entities";

export const COMPOSE_SET_STATUS = "COMPOSE_SET_STATUS" as const;

export interface ComposeSetStatusAction {
  type: typeof COMPOSE_SET_STATUS;
  id: string;
  status: Status;
  rawText: string;
  spoilerText?: string;
  contentType?: string | false;
  withRedraft?: boolean;
}

export const setComposeToStatus =
  (
    status: Status,
    rawText: string,
    spoilerText?: string,
    contentType?: string | false,
    withRedraft?: boolean
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const action: ComposeSetStatusAction = {
      type: COMPOSE_SET_STATUS,
      id: "compose-modal",
      status,
      rawText,
      spoilerText,
      contentType,
      withRedraft,
    };

    dispatch(action);
  };
