import {
  like as likeAction,
  unlike as unlikeAction,
  toggleLike as toggleLikeAction,
} from "src/actions/interactions";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useGetState } from "src/hooks/useGetState";

export function useLike() {
  const getState = useGetState();
  const dispatch = useAppDispatch();

  const like = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(likeAction(status));
    }
  };

  const unlike = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(unlikeAction(status));
    }
  };

  const toggleLike = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(toggleLikeAction(status));
    }
  };

  return { like, unlike, toggleLike };
}
