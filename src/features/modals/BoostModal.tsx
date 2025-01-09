import repeatIcon from "@tabler/icons/outline/repeat.svg";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import Icon from "src/components/Icon";
import Modal from "src/components/Modal";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import ReplyIndicator from "src/features/compose/components/ReplyIndicator";
import { Status as StatusEntity } from "src/schemas/index";

import type { Status as LegacyStatus } from "src/types/entities";

const messages = defineMessages({
  cancel_repost: {
    id: "status.cancel_repost_private",
    defaultMessage: "Un-repost",
  },
  repost: { id: "status.repost", defaultMessage: "Repost" },
});

interface IBoostModal {
  status: LegacyStatus;
  onRepost: (status: LegacyStatus) => void;
  onClose: () => void;
}

const BoostModal: React.FC<IBoostModal> = ({ status, onRepost, onClose }) => {
  const intl = useIntl();

  const handleRepost = () => {
    onRepost(status);
    onClose();
  };

  const buttonText = status.reposted ? messages.cancel_repost : messages.repost;

  return (
    <Modal
      title={
        <FormattedMessage id="boost_modal.title" defaultMessage="Repost?" />
      }
      confirmationAction={handleRepost}
      confirmationText={intl.formatMessage(buttonText)}
    >
      <Stack space={4}>
        <ReplyIndicator status={status.toJS() as StatusEntity} hideActions />

        <Text>
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          <FormattedMessage
            id="boost_modal.combo"
            defaultMessage="You can press {combo} to skip this next time"
            values={{
              combo: (
                <span>
                  Shift +{" "}
                  <Icon
                    className="inline-block align-middle"
                    src={repeatIcon}
                  />
                </span>
              ),
            }}
          />
        </Text>
      </Stack>
    </Modal>
  );
};

export default BoostModal;
