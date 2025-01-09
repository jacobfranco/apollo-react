import chartBarIcon from "@tabler/icons/outline/chart-bar.svg";
import { defineMessages, useIntl } from "react-intl";

import { addPoll, removePoll } from "src/actions/compose";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useCompose } from "src/hooks/useCompose";

import ComposeFormButton from "./ComposeFormButton";

const messages = defineMessages({
  add_poll: { id: "poll_button.add_poll", defaultMessage: "Add a poll" },
  remove_poll: { id: "poll_button.remove_poll", defaultMessage: "Remove poll" },
});

interface IPollButton {
  composeId: string;
  disabled?: boolean;
}

const PollButton: React.FC<IPollButton> = ({ composeId, disabled }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const compose = useCompose(composeId);

  const unavailable = compose.is_uploading;
  const active = compose.poll !== null;

  const onClick = () => {
    if (active) {
      dispatch(removePoll(composeId));
    } else {
      dispatch(addPoll(composeId));
    }
  };

  if (unavailable) {
    return null;
  }

  return (
    <ComposeFormButton
      icon={chartBarIcon}
      title={intl.formatMessage(
        active ? messages.remove_poll : messages.add_poll
      )}
      active={active}
      disabled={disabled}
      onClick={onClick}
    />
  );
};

export default PollButton;
