import gavelIcon from "@tabler/icons/outline/gavel.svg";
import usersIcon from "@tabler/icons/outline/users.svg";
import { FormattedMessage } from "react-intl";

import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Text from "src/components/Text";
import { GroupRoles } from "src/schemas/group-member";
import { Group } from "src/types/entities";

interface IGroupRelationship {
  group: Group;
}

const GroupRelationship = ({ group }: IGroupRelationship) => {
  const isOwner = group.relationship?.role === GroupRoles.OWNER;
  const isAdmin = group.relationship?.role === GroupRoles.ADMIN;

  if (!isOwner && !isAdmin) {
    return null;
  }

  return (
    <HStack
      space={1}
      alignItems="center"
      data-testid="group-relationship"
      className="text-primary-600 dark:text-accent-blue"
    >
      <Icon className="size-4" src={isOwner ? usersIcon : gavelIcon} />

      <Text tag="span" weight="medium" size="sm" theme="inherit">
        {isOwner ? (
          <FormattedMessage id="group.role.owner" defaultMessage="Owner" />
        ) : (
          <FormattedMessage id="group.role.admin" defaultMessage="Admin" />
        )}
      </Text>
    </HStack>
  );
};

export default GroupRelationship;
