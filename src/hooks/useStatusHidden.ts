import {
  revealStatus as revealStatusAction,
  hideStatus as hideStatusAction,
  toggleStatusHidden as toggleStatusHiddenAction,
} from "src/actions/statuses";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useGetState } from "src/hooks/useGetState";

export function useStatusHidden() {
  const getState = useGetState();
  const dispatch = useAppDispatch();

  const revealStatus = (statusId: string) => {
    dispatch(revealStatusAction(statusId));
  };

  const hideStatus = (statusId: string) => {
    dispatch(hideStatusAction(statusId));
  };

  const toggleStatusHidden = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(toggleStatusHiddenAction(status));
    }
  };

  return { revealStatus, hideStatus, toggleStatusHidden };
}
