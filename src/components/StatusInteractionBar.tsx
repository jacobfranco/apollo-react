import clsx from 'clsx'; import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { openModal } from 'src/actions/modals';
import { HStack, Text } from 'src/components';
import { useAppSelector, useAppDispatch } from 'src/hooks';
import { shortNumberFormat } from 'src/utils/numbers';

import type { Status } from 'src/types/entities';

interface IStatusInteractionBar {
  status: Status;
}

const StatusInteractionBar: React.FC<IStatusInteractionBar> = ({ status }): JSX.Element | null => {
  const me = useAppSelector(({ me }) => me);
  const dispatch = useAppDispatch();
  const { account } = status;

  if (!account || typeof account !== 'object') return null;

  const onOpenUnauthorizedModal = () => {
    dispatch(openModal('UNAUTHORIZED'));
  };

  const onOpenRepostsModal = (username: string, statusId: string): void => {
    dispatch(openModal('REPOSTS', {
      username,
      statusId,
    }));
  };

  const onOpenLikesModal = (username: string, statusId: string): void => {
    dispatch(openModal('LIKES', {
      username,
      statusId,
    }));
  };

  const handleOpenRepostsModal: React.EventHandler<React.MouseEvent> = (e) => {
    e.preventDefault();

    if (!me) onOpenUnauthorizedModal();
    else onOpenRepostsModal(account.id, status.id);
  };

  const getReposts = () => {
    if (status.reposts_count) {
      return (
        <InteractionCounter count={status.reposts_count} onClick={handleOpenRepostsModal}>
          <FormattedMessage
            id='status.interactions.reposts'
            defaultMessage='{count, plural, one {Repost} other {Reposts}}'
            values={{ count: status.reposts_count }}
          />
        </InteractionCounter>
      );
    }

    return null;
  };

  const getQuotes = () => {
    if (status.quotes_count) {
      return (
        <InteractionCounter count={status.quotes_count} to={`/@${status.getIn(['account', 'username'])}/posts/${status.id}/quotes`}>
          <FormattedMessage
            id='status.interactions.quotes'
            defaultMessage='{count, plural, one {Quote} other {Quotes}}'
            values={{ count: status.quotes_count }}
          />
        </InteractionCounter>
      );
    }

    return null;
  };

  const handleOpenLikesModal: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    e.preventDefault();

    if (!me) onOpenUnauthorizedModal();
    else onOpenLikesModal(account.id, status.id);
  };

  const getLikes = () => {
    if (status.likes_count) {
      return (
        <InteractionCounter count={status.likes_count} onClick={handleOpenLikesModal}>
          <FormattedMessage
            id='status.interactions.likes'
            defaultMessage='{count, plural, one {Like} other {Likes}}'
            values={{ count: status.likes_count }}
          />
        </InteractionCounter>
      );
    }

    return null;
  };


  return (
    <HStack space={3}>
      {getReposts()}
      {getQuotes()}
      {getLikes()}
    </HStack>
  );
};

interface IInteractionCounter {
  count: number;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  to?: string;
}

const InteractionCounter: React.FC<IInteractionCounter> = ({ count, children, onClick, to }) => {

  const className = clsx({ // TODO: Maybe restore ?
    'text-gray-600 dark:text-gray-700': true,
  });

  const body = (
    <HStack space={1} alignItems='center'>
      <Text weight='bold'>
        {shortNumberFormat(count)}
      </Text>

      <Text tag='div' theme='muted'>
        {children}
      </Text>
    </HStack>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <button
      type='button'
      onClick={onClick}
      className={className}
    >
      {body}
    </button>
  );
};

export default StatusInteractionBar;