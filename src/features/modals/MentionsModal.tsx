import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React, { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchStatusWithContext } from 'src/actions/statuses';
import { Modal, ScrollableList, Spinner } from 'src/components';
import AccountContainer from 'src/containers/AccountContainer';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { makeGetStatus } from 'src/selectors';

interface IMentionsModal {
  onClose: (type: string) => void;
  statusId: string;
}

const MentionsModal: React.FC<IMentionsModal> = ({ onClose, statusId }) => {
  const dispatch = useAppDispatch();
  const getStatus = useCallback(makeGetStatus(), []);

  const status = useAppSelector((state) => getStatus(state, { id: statusId }));
  const accountIds = status ? ImmutableOrderedSet(status.mentions.map(m => m.get('id'))) : null;

  const fetchData = () => {
    dispatch(fetchStatusWithContext(statusId));
  };

  const onClickClose = () => {
    onClose('MENTIONS');
  };

  useEffect(() => {
    fetchData();
  }, []);

  let body;

  if (!accountIds) {
    body = <Spinner />;
  } else {
    body = (
      <ScrollableList
        scrollKey='mentions'
        className='max-w-full'
        itemClassName='pb-3'
      >
        {accountIds.map(id =>
          <AccountContainer key={id} id={id} />,
        )}
      </ScrollableList>
    );
  }

  return (
    <Modal
      title={<FormattedMessage id='column.mentions' defaultMessage='Mentions' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default MentionsModal;