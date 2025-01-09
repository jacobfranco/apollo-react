import {
  repost as repostAction,
  unrepost as unrepostAction,
  toggleRepost as toggleRepostAction,
} from "src/actions/interactions";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useGetState } from "src/hooks/useGetState";

export function useRepost() {
  const getState = useGetState();
  const dispatch = useAppDispatch();

  const repost = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(repostAction(status));
    }
  };

  const unrepost = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(unrepostAction(status));
    }
  };

  const toggleRepost = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(toggleRepostAction(status));
    }
  };

  return { repost, unrepost, toggleRepost };
}
