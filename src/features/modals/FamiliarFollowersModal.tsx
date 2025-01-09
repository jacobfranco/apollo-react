import { OrderedSet as ImmutableOrderedSet } from "immutable";
import { FormattedMessage } from "react-intl";

import ScrollableList from "src/components/ScrollableList";
import Modal from "src/components/Modal";
import Spinner from "src/components/Spinner";
import AccountContainer from "src/containers/AccountContainer";
import { useAppSelector } from "src/hooks/useAppSelector";
import { makeGetAccount } from "src/selectors/index";

const getAccount = makeGetAccount();

interface IFamiliarFollowersModal {
  accountId: string;
  onClose: (string: string) => void;
}

const FamiliarFollowersModal = ({
  accountId,
  onClose,
}: IFamiliarFollowersModal) => {
  const account = useAppSelector((state) => getAccount(state, accountId));
  const familiarFollowerIds: ImmutableOrderedSet<string> = useAppSelector(
    (state) =>
      state.user_lists.familiar_followers.get(accountId)?.items ||
      ImmutableOrderedSet()
  );

  const onClickClose = () => {
    onClose("FAMILIAR_FOLLOWERS");
  };

  let body;

  if (!account || !familiarFollowerIds) {
    body = <Spinner />;
  } else {
    const emptyMessage = (
      <FormattedMessage
        id="account.familiar_followers.empty"
        defaultMessage="No one you know follows {name}."
        values={{ name: account.display_name }}
      />
    );

    body = (
      <ScrollableList
        scrollKey="familiar_followers"
        emptyMessage={emptyMessage}
        itemClassName="pb-3"
        style={{ height: "80vh" }}
        useWindowScroll={false}
      >
        {familiarFollowerIds.map((id) => (
          <AccountContainer key={id} id={id} />
        ))}
      </ScrollableList>
    );
  }

  return (
    <Modal
      title={
        <FormattedMessage
          id="column.familiar_followers"
          defaultMessage="People you know following {name}"
          values={{ name: account ? account.display_name : "" }}
        />
      }
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default FamiliarFollowersModal;
