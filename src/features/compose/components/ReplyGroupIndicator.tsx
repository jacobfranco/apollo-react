import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import Link from "src/components/Link";
import Text from "src/components/Text";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Group } from "src/schemas/index";
import { makeGetStatus } from "src/selectors";

interface IReplyGroupIndicator {
  composeId: string;
}

const ReplyGroupIndicator = (props: IReplyGroupIndicator) => {
  const { composeId } = props;

  const getStatus = useCallback(makeGetStatus(), []);

  const status = useAppSelector((state) =>
    getStatus(state, { id: state.compose.get(composeId)?.in_reply_to! })
  );
  const group = status?.group as Group;

  if (!group) {
    return null;
  }

  return (
    <Text theme="muted" size="sm">
      <FormattedMessage
        id="compose.reply_group_indicator.message"
        defaultMessage="Posting to {groupLink}"
        values={{
          groupLink: (
            <Link to={`/group/${group.slug}`}>{group.display_name}</Link>
          ),
        }}
      />
    </Text>
  );
};

export default ReplyGroupIndicator;
