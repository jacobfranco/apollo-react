import { mentionCompose as mentionComposeAction } from "src/actions/compose";
import { EntityTypes, Entities } from "src/entity-store/entities";
import { useAppDispatch } from "src/hooks/useAppDispatch";

export function useMentionCompose() {
  const dispatch = useAppDispatch();

  const mentionCompose = (account: EntityTypes[Entities.ACCOUNTS]) => {
    dispatch(mentionComposeAction(account));
  };

  return { mentionCompose };
}
