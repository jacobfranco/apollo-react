import { replyCompose as replyComposeAction } from "src/actions/compose";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useGetState } from "src/hooks/useGetState";

export function useReplyCompose() {
  const getState = useGetState();
  const dispatch = useAppDispatch();

  const replyCompose = (statusId: string) => {
    const status = getState().statuses.get(statusId);
    if (status) {
      dispatch(replyComposeAction(status));
    }
  };

  return { replyCompose };
}
