import { expandNotifications } from "src/actions/notifications";
import { expandHomeTimeline } from "src/actions/timelines";
import { useStatContext } from "src/contexts/stat-context";
import { useLoggedIn } from "src/hooks";

import { useTimelineStream } from "./useTimelineStream";

import type { AppDispatch } from "src/store";

function useUserStream() {
  const { isLoggedIn } = useLoggedIn();
  const statContext = useStatContext();

  return useTimelineStream("home", "user", refresh, null, {
    statContext,
    enabled: isLoggedIn,
  });
}

/** Refresh home timeline and notifications. */
function refresh(dispatch: AppDispatch, done?: () => void) {
  return dispatch(
    expandHomeTimeline({}, () => dispatch(expandNotifications({}, done)))
  );
}

export { useUserStream };
