import {
  List as ImmutableList,
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from "immutable";

import { normalizeHistory } from "./history";

import type { History } from "src/types/entities";

export const SpaceRecord = ImmutableRecord({
  id: "",
  name: "",
  linkUrl: "",
  imageUrl: "",
  history: null as ImmutableList<History> | null,
  following: false,
});

const normalizeHistoryList = (space: ImmutableMap<string, any>) => {
  if (space.get("history")) {
    return space.update("history", ImmutableList(), (attachments) => {
      return attachments.map(normalizeHistory);
    });
  } else {
    return space.set("history", null);
  }
};

export const normalizeSpace = (space: Record<string, any>) => {
  return SpaceRecord(
    ImmutableMap(fromJS(space)).withMutations((space) => {
      normalizeHistoryList(space);
    })
  );
};
