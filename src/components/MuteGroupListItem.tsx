import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import { useUnmuteGroup } from "src/api/hooks/index";
import GroupAvatar from "src/components/GroupAvatar";
import Button from "src/components/Button";
import HStack from "src/components/HStack";
import Text from "src/components/Text";
import { type Group } from "src/schemas";
import toast from "src/toast";

interface IMuteGroupListItem {
  group: Group;
  onUnmute(): void;
}

const messages = defineMessages({
  unmuteSuccess: {
    id: "group.unmute.success",
    defaultMessage: "Unmuted the group",
  },
});

const MuteGroupListItem = ({ group, onUnmute }: IMuteGroupListItem) => {
  const intl = useIntl();

  const unmuteGroup = useUnmuteGroup(group);

  const handleUnmute = () => {
    unmuteGroup.mutate(undefined, {
      onSuccess() {
        onUnmute();
        toast.success(intl.formatMessage(messages.unmuteSuccess));
      },
    });
  };

  return (
    <HStack alignItems="center" justifyContent="between">
      <HStack alignItems="center" space={3}>
        <GroupAvatar group={group} size={42} />

        <Text weight="semibold" size="sm" truncate>
          {group.display_name}
        </Text>
      </HStack>

      <Button theme="primary" type="button" onClick={handleUnmute} size="sm">
        <FormattedMessage id="group.unmute.label" defaultMessage="Unmute" />
      </Button>
    </HStack>
  );
};

export default MuteGroupListItem;
