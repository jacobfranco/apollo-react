import lockIcon from "@tabler/icons/outline/lock.svg";
import worldIcon from "@tabler/icons/outline/world.svg";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import GroupAvatar from "src/components/GroupAvatar";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import GroupActionButton from "src/components/GroupActionButton";
import { Group as GroupEntity } from "src/types/entities";
import { shortNumberFormat } from "src/utils/numbers";

interface IGroupListItem {
  group: GroupEntity;
  withJoinAction?: boolean;
}

const GroupListItem = (props: IGroupListItem) => {
  const { group, withJoinAction = true } = props;

  return (
    <HStack
      alignItems="center"
      justifyContent="between"
      data-testid="group-list-item"
    >
      <Link
        key={group.id}
        to={`/group/${group.slug}`}
        className="overflow-hidden"
      >
        <HStack alignItems="center" space={2}>
          <GroupAvatar group={group} size={44} />

          <Stack className="overflow-hidden">
            <Text weight="bold" truncate>
              {group.display_name}
            </Text>

            <HStack
              className="text-gray-700 dark:text-gray-600"
              space={1}
              alignItems="center"
            >
              <Icon
                className="size-4.5"
                src={group.locked ? lockIcon : worldIcon}
              />

              <Text theme="inherit" tag="span" size="sm" weight="medium">
                {group.locked ? (
                  <FormattedMessage
                    id="group.privacy.locked"
                    defaultMessage="Private"
                  />
                ) : (
                  <FormattedMessage
                    id="group.privacy.public"
                    defaultMessage="Public"
                  />
                )}
              </Text>

              {typeof group.members_count !== "undefined" && (
                <>
                  <span>&bull;</span>{" "}
                  {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                  <Text theme="inherit" tag="span" size="sm" weight="medium">
                    {shortNumberFormat(group.members_count)}{" "}
                    {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                    <FormattedMessage
                      id="groups.discover.search.results.member_count"
                      defaultMessage="{members, plural, one {member} other {members}}"
                      values={{
                        members: group.members_count,
                      }}
                    />
                  </Text>
                </>
              )}
            </HStack>
          </Stack>
        </HStack>
      </Link>

      {withJoinAction && <GroupActionButton group={group} />}
    </HStack>
  );
};

export default GroupListItem;
