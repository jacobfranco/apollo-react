import clsx from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useLocation, useRouteMatch } from 'react-router-dom';

// import { groupComposeModal } from 'soapbox/actions/compose'; TODO: Implement groups
import { openModal } from 'src/actions/modals';
// mport { useGroupLookup } from 'soapbox/api/hooks';
import { Avatar, HStack, Icon } from 'src/components';
import { useAppDispatch } from 'src/hooks';

const messages = defineMessages({
  publish: { id: 'compose_form.publish', defaultMessage: 'Post' },
});

/** FloatingActionButton (aka FAB), a composer button that floats in the corner on mobile. */
const FloatingActionButton: React.FC = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/group/')) {
    return // <GroupFAB />; TODO: Implement groups
  }

  return <HomeFAB />;
};

const HomeFAB: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const handleOpenComposeModal = () => {
    dispatch(openModal('COMPOSE'));
  };

  return (
    <button
      onClick={handleOpenComposeModal}
      className={clsx(
        'inline-flex appearance-none items-center rounded-full border p-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
        'border-transparent bg-secondary-500 text-gray-100 hover:bg-secondary-400 focus:bg-secondary-500 focus:ring-secondary-300',
      )}
      aria-label={intl.formatMessage(messages.publish)}
    >
      <Icon
        src={require('@tabler/icons/pencil-plus.svg')}
        className='h-6 w-6'
      />
    </button>
  );
};

/* TODO: Implmement groups
const GroupFAB: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const match = useRouteMatch<{ groupSlug: string }>('/group/:groupSlug');
  const { entity: group } = useGroupLookup(match?.params.groupSlug || '');

  if (!group) return null;

  const handleOpenComposeModal = () => {
    dispatch(groupComposeModal(group));
  };

  return (
    <button
      onClick={handleOpenComposeModal}
      className={clsx(
        'inline-flex appearance-none items-center rounded-full border p-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
        'border-transparent bg-secondary-500 text-gray-100 hover:bg-secondary-400 focus:bg-secondary-500 focus:ring-secondary-300',
      )}
      aria-label={intl.formatMessage(messages.publish)}
    >
      <HStack space={3} alignItems='center'>
        <Avatar className='-my-3 -ml-2 border-white' size={42} src={group.avatar} />
        <Icon
          src={require('@tabler/icons/pencil-plus.svg')}
          className='h-6 w-6'
        />
      </HStack>
    </button>
  );
};
*/ 

export default FloatingActionButton;