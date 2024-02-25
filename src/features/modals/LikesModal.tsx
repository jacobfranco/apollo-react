import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchLikes, expandLikes } from 'src/actions/interactions';
import { Modal, ScrollableList, Spinner } from 'src/components';
import AccountContainer from 'src/containers/AccountContainer';
import { useAppDispatch, useAppSelector } from 'src/hooks';

interface ILikesModal {
  onClose: (type: string) => void;
  statusId: string;
}

const LikesModal: React.FC<ILikesModal> = ({ onClose, statusId }) => {
  const dispatch = useAppDispatch();

  const accountIds = useAppSelector((state) => state.user_lists.liked_by.get(statusId)?.items);
  const next = useAppSelector((state) => state.user_lists.liked_by.get(statusId)?.next);

  const fetchData = () => {
    dispatch(fetchLikes(statusId));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClickClose = () => {
    onClose('LIKES');
  };

  const handleLoadMore = () => {
    if (next) {
      dispatch(expandLikes(statusId, next!));
    }
  };

  let body;

  if (!accountIds) {
    body = <Spinner />;
  } else {
    const emptyMessage = <FormattedMessage id='empty_column.likes' defaultMessage='No one has liked this post yet. When someone does, they will show up here.' />;

    body = (
      <ScrollableList
        scrollKey='likes'
        emptyMessage={emptyMessage}
        className='max-w-full'
        itemClassName='pb-3'
        style={{ height: '80vh' }}
        useWindowScroll={false}
        onLoadMore={handleLoadMore}
        hasMore={!!next}
      >
        {accountIds.map(id =>
          <AccountContainer key={id} id={id} />,
        )}
      </ScrollableList>
    );
  }

  return (
    <Modal
      title={<FormattedMessage id='column.likes' defaultMessage='Likes' />}
      onClose={onClickClose}
    >
      {body}
    </Modal>
  );
};

export default LikesModal;