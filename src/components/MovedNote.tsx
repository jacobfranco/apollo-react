import briefcaseIcon from "@tabler/icons/outline/briefcase.svg";
import { FormattedMessage } from "react-intl";

import Account from "src/components/Account";
import Icon from "src/components/Icon";
import HStack from "src/components/HStack";
import Text from "src/components/Text";

import type { Account as AccountEntity } from "src/schemas";

interface IMovedNote {
  from: AccountEntity;
  to: AccountEntity;
}

const MovedNote: React.FC<IMovedNote> = ({ from, to }) => (
  <div className="p-4">
    <HStack className="mb-2" alignItems="center" space={1.5}>
      <Icon
        src={briefcaseIcon}
        className="flex-none text-primary-600 dark:text-primary-400"
      />

      <div className="truncate">
        <Text theme="muted" size="sm" truncate>
          <FormattedMessage
            id="notification.move"
            defaultMessage="{name} moved to {targetName}"
            values={{
              name: from.display_name,
              targetName: to.username,
            }}
          />
        </Text>
      </div>
    </HStack>

    <Account account={to} withRelationship={false} />
  </div>
);

export default MovedNote;
