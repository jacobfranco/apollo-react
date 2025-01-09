import alertTriangleIcon from "@tabler/icons/outline/alert-triangle.svg";
import { defineMessages, useIntl } from "react-intl";

import { changeComposeSpoilerness } from "src/actions/compose";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useCompose } from "src/hooks/useCompose";

import ComposeFormButton from "./ComposeFormButton";

const messages = defineMessages({
  marked: {
    id: "compose_form.spoiler.marked",
    defaultMessage: "Text is hidden behind warning",
  },
  unmarked: {
    id: "compose_form.spoiler.unmarked",
    defaultMessage: "Text is not hidden",
  },
});

interface ISpoilerButton {
  composeId: string;
}

const SpoilerButton: React.FC<ISpoilerButton> = ({ composeId }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const active = useCompose(composeId).spoiler;

  const onClick = () => dispatch(changeComposeSpoilerness(composeId));

  return (
    <ComposeFormButton
      icon={alertTriangleIcon}
      title={intl.formatMessage(active ? messages.marked : messages.unmarked)}
      active={active}
      onClick={onClick}
    />
  );
};

export default SpoilerButton;
