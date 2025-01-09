import plusIcon from "@tabler/icons/outline/plus.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { useEffect } from "react";
import { defineMessages, useIntl } from "react-intl";

import { fetchAccount } from "src/actions/accounts";
import { addToMentions, removeFromMentions } from "src/actions/compose";
import { useAccount } from "src/api/hooks";
import AccountComponent from "src/components/Account";
import IconButton from "src/components/IconButton";
import HStack from "src/components/HStack";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useCompose } from "src/hooks/useCompose";

const messages = defineMessages({
  remove: {
    id: "reply_mentions.account.remove",
    defaultMessage: "Remove from mentions",
  },
  add: { id: "reply_mentions.account.add", defaultMessage: "Add to mentions" },
});

interface IAccount {
  composeId: string;
  accountId: string;
  author: boolean;
}

const Account: React.FC<IAccount> = ({ composeId, accountId, author }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const compose = useCompose(composeId);
  const { account } = useAccount(accountId);
  const added = !!account && compose.to?.includes(account.username);

  const onRemove = () => dispatch(removeFromMentions(composeId, accountId));
  const onAdd = () => dispatch(addToMentions(composeId, accountId));

  useEffect(() => {
    if (accountId && !account) {
      dispatch(fetchAccount(accountId));
    }
  }, []);

  if (!account) return null;

  let button;

  if (added) {
    button = (
      <IconButton
        src={xIcon}
        iconClassName="h-5 w-5"
        title={intl.formatMessage(messages.remove)}
        onClick={onRemove}
      />
    );
  } else {
    button = (
      <IconButton
        src={plusIcon}
        iconClassName="h-5 w-5"
        title={intl.formatMessage(messages.add)}
        onClick={onAdd}
      />
    );
  }

  return (
    <HStack
      space={1}
      alignItems="center"
      justifyContent="between"
      className="p-2.5"
    >
      <div className="w-5/6">
        <AccountComponent
          account={account}
          withRelationship={false}
          withLinkToProfile={false}
        />
      </div>
      {!author && button}
    </HStack>
  );
};

export default Account;
