import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchReposts, expandReposts } from 'src/actions/interactions';
import { fetchStatus } from 'src/actions/statuses';
import { Modal, ScrollableList, Spinner } from 'src/components';
import AccountContainer from 'src/containers/AccountContainer';
import { useAppDispatch, useAppSelector } from 'src/hooks';

interface IRepostsModal {
  onClose: (string: string) => void;
  statusId: string;
}

const RepostsModal: React.FC<IRepostsModal> = ({ onClose, statusId }) => {
  const dispatch = useAppDispatch();
  const accountIds = useAppSelector((state) => state.user_lists.reposted_by.get(statusId)?.items);
  const next = useAppSelector((state) => state.user_lists.reposted_by.get(statusId)?.next);

  const fetchData = () => {
    dispatch(fetchReposts(statusId));
    dispatch(fetchStatus(statusId));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClickClose = () => {
    onClose('REPOSTS');
  };

  const handleLoadMore = () => {
    if (next) {
      dispatch(expandReposts(statusId, next!));
    }
  };

  let body;

  if (!accountIds) {
    body = <Spinner />;
  } else {
    const emptyMessage = <FormattedMessage id='status.reposts.empty' defaultMessage='No one has reposted this post yet. When someone does, they will show up here.' />;

    body = (
      <ScrollableList
        scrollKey='reposts'
        emptyMessage={emptyMessage}
        className='max-w-full'
        itemClassName='pb-3'
        style={{ height: '80vh' }}
        useWindowScroll={false}
        onLoadMore={handleLoadMore}
        hasMore={!!next}
      >
        {accountIds.map((id) =>
          <AccountContainer key={id} id={id} />,
        )}
      </ScrollableList>
    );
  }

  return (
    <Modal
      title={<FormattedMessage id='column.reposts' defaultMessage='Reposts' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default RepostsModal;