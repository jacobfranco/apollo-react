import arrowLeftIcon from "@tabler/icons/outline/arrow-left.svg";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import Modal from "src/components/Modal";
import Account from "src/components/ReplyMentionsAccount";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useCompose } from "src/hooks/useCompose";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { statusToMentionsAccountIdsArray } from "src/reducers/compose";
import { makeGetStatus } from "src/selectors/index";

import type {
  Account as AccountEntity,
  Status as StatusEntity,
} from "src/types/entities";

interface IReplyMentionsModal {
  composeId: string;
  onClose: (string: string) => void;
}

const ReplyMentionsModal: React.FC<IReplyMentionsModal> = ({
  composeId,
  onClose,
}) => {
  const compose = useCompose(composeId);

  const getStatus = useCallback(makeGetStatus(), []);
  const status = useAppSelector<StatusEntity | null>((state) =>
    getStatus(state, { id: compose.in_reply_to! })
  );
  const { account } = useOwnAccount();

  const mentions = statusToMentionsAccountIdsArray(status!, account!);
  const author = (status?.account as AccountEntity).id;

  const onClickClose = () => {
    onClose("REPLY_MENTIONS");
  };

  return (
    <Modal
      title={
        <FormattedMessage
          id="navigation_bar.in_reply_to"
          defaultMessage="In reply to"
        />
      }
      onClose={onClickClose}
      closeIcon={arrowLeftIcon}
      closePosition="left"
    >
      <div className="block min-h-[300px] flex-1 flex-row overflow-y-auto">
        {mentions.map((accountId) => (
          <Account
            composeId={composeId}
            key={accountId}
            accountId={accountId}
            author={author === accountId}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ReplyMentionsModal;
