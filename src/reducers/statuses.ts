import { Map as ImmutableMap, List as ImmutableList } from "immutable";
import DOMPurify from "isomorphic-dompurify";

import { normalizeStatus } from "src/normalizers/index";
import { htmlToPlaintext, stripCompatibilityFeatures } from "src/utils/html";
import { normalizeId } from "src/utils/normalizers";

import { STATUS_IMPORT, STATUSES_IMPORT } from "../actions/importer";
import {
  REPOST_REQUEST,
  REPOST_FAIL,
  UNREPOST_REQUEST,
  UNREPOST_FAIL,
  LIKE_REQUEST,
  UNLIKE_REQUEST,
  LIKE_FAIL,
} from "../actions/interactions";
import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_FAIL,
  STATUS_MUTE_SUCCESS,
  STATUS_UNMUTE_SUCCESS,
  STATUS_REVEAL,
  STATUS_HIDE,
  STATUS_DELETE_REQUEST,
  STATUS_DELETE_FAIL,
  STATUS_TRANSLATE_SUCCESS,
  STATUS_TRANSLATE_UNDO,
  STATUS_UNFILTER,
} from "../actions/statuses";
import { TIMELINE_DELETE } from "../actions/timelines";

import type { AnyAction } from "redux";
import type { APIEntity } from "src/types/entities";

const domParser = new DOMParser();

type StatusRecord = ReturnType<typeof normalizeStatus>;
type APIEntities = Array<APIEntity>;

type State = ImmutableMap<string, ReducerStatus>;

export interface ReducerStatus extends StatusRecord {
  repost: string | null;
  poll: string | null;
  quote: string | null;
}

const minifyStatus = (status: StatusRecord): ReducerStatus => {
  return status.mergeWith((o, n) => n || o, {
    repost: normalizeId(status.getIn(["repost", "id"])),
    poll: normalizeId(status.getIn(["poll", "id"])),
    quote: normalizeId(status.getIn(["quote", "id"])),
  }) as ReducerStatus;
};

// Gets titles of poll options from status
const getPollOptionTitles = ({ poll }: StatusRecord): readonly string[] => {
  if (poll && typeof poll === "object") {
    return poll.options.map(({ title }) => title);
  } else {
    return [];
  }
};

// Gets usernames of mentioned users from status
const getMentionedUsernames = (status: StatusRecord): ImmutableList<string> => {
  return status.mentions.map(({ username }) => `@${username}`);
};

// Creates search text from the status
const buildSearchContent = (status: StatusRecord): string => {
  const pollOptionTitles = getPollOptionTitles(status);
  const mentionedUsernames = getMentionedUsernames(status);

  const fields = ImmutableList([status.spoiler_text, status.content])
    .concat(pollOptionTitles)
    .concat(mentionedUsernames);

  return htmlToPlaintext(fields.join("\n\n")) || "";
};

// Only calculate these values when status first encountered
// Otherwise keep the ones already in the reducer
export const calculateStatus = (
  status: StatusRecord,
  expandSpoilers: boolean = false
): StatusRecord => {
  const searchContent = buildSearchContent(status);

  return status.merge({
    search_index:
      domParser.parseFromString(searchContent, "text/html").documentElement
        .textContent || "",
    content: DOMPurify.sanitize(stripCompatibilityFeatures(status.content), {
      USE_PROFILES: { html: true },
    }),
    hidden: expandSpoilers
      ? false
      : status.spoiler_text.length > 0 || status.sensitive,
  });
};

// Check whether a status is a quote by secondary characteristics
const isQuote = (status: StatusRecord) => {
  return Boolean(status.pleroma.get("quote_url"));
};

// Preserve translation if an existing status already has it
const fixTranslation = (
  status: StatusRecord,
  oldStatus?: StatusRecord
): StatusRecord => {
  if (oldStatus?.translation && !status.translation) {
    return status.set("translation", oldStatus.translation);
  } else {
    return status;
  }
};

// Preserve quote if an existing status already has it
const fixQuote = (
  status: StatusRecord,
  oldStatus?: StatusRecord
): StatusRecord => {
  if (oldStatus && !status.quote && isQuote(status)) {
    return status
      .set("quote", oldStatus.quote)
      .updateIn(
        ["pleroma", "quote_visible"],
        (visible) => visible || oldStatus.pleroma.get("quote_visible")
      );
  } else {
    return status;
  }
};

const fixStatus = (
  state: State,
  status: APIEntity,
  expandSpoilers: boolean
): ReducerStatus => {
  const oldStatus = state.get(status.id);

  return normalizeStatus(status).withMutations((status) => {
    fixTranslation(status, oldStatus);
    fixQuote(status, oldStatus);
    calculateStatus(status, expandSpoilers);
    minifyStatus(status);
  }) as ReducerStatus;
};

const importStatus = (
  state: State,
  status: APIEntity,
  expandSpoilers: boolean
): State => state.set(status.id, fixStatus(state, status, expandSpoilers));

const importStatuses = (
  state: State,
  statuses: APIEntities,
  expandSpoilers: boolean
): State =>
  state.withMutations((mutable) =>
    statuses.forEach((status) => importStatus(mutable, status, expandSpoilers))
  );

const deleteStatus = (state: State, id: string, references: Array<string>) => {
  references.forEach((ref) => {
    state = deleteStatus(state, ref[0], []);
  });

  return state.delete(id);
};

const incrementReplyCount = (state: State, { in_reply_to_id }: APIEntity) => {
  if (in_reply_to_id) {
    return state.updateIn([in_reply_to_id, "replies_count"], 0, (count) => {
      return typeof count === "number" ? count + 1 : 0;
    });
  } else {
    return state;
  }
};

const decrementReplyCount = (state: State, { in_reply_to_id }: APIEntity) => {
  if (in_reply_to_id) {
    return state.updateIn([in_reply_to_id, "replies_count"], 0, (count) => {
      return typeof count === "number" ? Math.max(0, count - 1) : 0;
    });
  } else {
    return state;
  }
};

/** Simulate like/unlike of status for optimistic interactions */
const simulateLike = (
  state: State,
  statusId: string,
  liked: boolean
): State => {
  const status = state.get(statusId);
  if (!status) return state;

  const delta = liked ? +1 : -1;

  const updatedStatus = status.merge({
    liked,
    likes_count: Math.max(0, status.likes_count + delta),
  });

  return state.set(statusId, updatedStatus);
};

interface Translation {
  content: string;
  detected_source_language: string;
  provider: string;
}

/** Import translation from translation service into the store. */
const importTranslation = (
  state: State,
  statusId: string,
  translation: Translation
) => {
  const map = ImmutableMap(translation);
  const result = map.set(
    "content",
    stripCompatibilityFeatures(map.get("content", ""))
  );
  return state.setIn([statusId, "translation"], result);
};

/** Delete translation from the store. */
const deleteTranslation = (state: State, statusId: string) => {
  return state.deleteIn([statusId, "translation"]);
};

const initialState: State = ImmutableMap();

export default function statuses(
  state = initialState,
  action: AnyAction
): State {
  switch (action.type) {
    case STATUS_IMPORT:
      return importStatus(state, action.status, action.expandSpoilers);
    case STATUSES_IMPORT:
      return importStatuses(state, action.statuses, action.expandSpoilers);
    case STATUS_CREATE_REQUEST:
      return action.editing ? state : incrementReplyCount(state, action.params);
    case STATUS_CREATE_FAIL:
      return action.editing ? state : decrementReplyCount(state, action.params);
    case LIKE_REQUEST:
      return simulateLike(state, action.status.id, true);
    case UNLIKE_REQUEST:
      return simulateLike(state, action.status.id, false);
    case LIKE_FAIL:
      return state.get(action.status.id) === undefined
        ? state
        : state.setIn([action.status.id, "liked"], false);
    case REPOST_REQUEST:
      return state.setIn([action.status.id, "reposted"], true);
    case REPOST_FAIL:
      return state.get(action.status.id) === undefined
        ? state
        : state.setIn([action.status.id, "reposted"], false);
    case UNREPOST_REQUEST:
      return state.setIn([action.status.id, "reposted"], false);
    case UNREPOST_FAIL:
      return state.get(action.status.id) === undefined
        ? state
        : state.setIn([action.status.id, "reposted"], true);
    case STATUS_MUTE_SUCCESS:
      return state.setIn([action.id, "muted"], true);
    case STATUS_UNMUTE_SUCCESS:
      return state.setIn([action.id, "muted"], false);
    case STATUS_REVEAL:
      return state.withMutations((map) => {
        action.ids.forEach((id: string) => {
          if (!(state.get(id) === undefined)) {
            map.setIn([id, "hidden"], false);
          }
        });
      });
    case STATUS_HIDE:
      return state.withMutations((map) => {
        action.ids.forEach((id: string) => {
          if (!(state.get(id) === undefined)) {
            map.setIn([id, "hidden"], true);
          }
        });
      });
    case STATUS_DELETE_REQUEST:
      return decrementReplyCount(state, action.params);
    case STATUS_DELETE_FAIL:
      return incrementReplyCount(state, action.params);
    case STATUS_TRANSLATE_SUCCESS:
      return importTranslation(state, action.id, action.translation);
    case STATUS_TRANSLATE_UNDO:
      return deleteTranslation(state, action.id);
    case STATUS_UNFILTER:
      return state.setIn([action.id, "showFiltered"], false);
    case TIMELINE_DELETE:
      return deleteStatus(state, action.id, action.references);
    default:
      return state;
  }
}
