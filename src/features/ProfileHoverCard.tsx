import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { usePopper } from 'react-popper';
import { useHistory } from 'react-router-dom';

import { fetchRelationships } from 'src/actions/accounts';
import {
  closeProfileHoverCard,
  updateProfileHoverCard,
} from 'src/actions/profile-hover-card';
import { useAccount } from 'src/api/hooks';
import Badge from 'src/components/Badge';
import ActionButton from 'src/features/ActionButton';
import { UserPanel } from 'src/features/AsyncComponents';
import { useAppSelector, useAppDispatch } from 'src/hooks';

import { showProfileHoverCard } from 'src/components/HoverRefWrapper';
import { dateFormatOptions } from 'src/components/RelativeTimestamp';
import { HStack, Icon, Stack, Text } from 'src/components';
import { Card, CardBody } from 'src/components/Card'

import type { Account } from 'src/schemas';
import type { AppDispatch } from 'src/store';

const getBadges = (
  account?: Pick<Account, 'admin' | 'moderator'>,
  // TODO: Prime user ? This was patron account so maybe go back through and replace all that
): JSX.Element[] => {
  const badges = [];

  if (account?.admin) {
    badges.push(<Badge key='admin' slug='admin' title={<FormattedMessage id='account_moderation_modal.roles.admin' defaultMessage='Admin' />} />);
  } else if (account?.moderator) {
    badges.push(<Badge key='moderator' slug='moderator' title={<FormattedMessage id='account_moderation_modal.roles.moderator' defaultMessage='Moderator' />} />);
  }

  return badges;
};

const handleMouseEnter = (dispatch: AppDispatch): React.MouseEventHandler => {
  return () => {
    dispatch(updateProfileHoverCard());
  };
};

const handleMouseLeave = (dispatch: AppDispatch): React.MouseEventHandler => {
  return () => {
    dispatch(closeProfileHoverCard(true));
  };
};

interface IProfileHoverCard {
  visible?: boolean;
}

/** Popup profile preview that appears when hovering avatars and display names. */
export const ProfileHoverCard: React.FC<IProfileHoverCard> = ({ visible = true }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const intl = useIntl();

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const me = useAppSelector(state => state.me);
  const accountId: string | undefined = useAppSelector(state => state.profile_hover_card.accountId || undefined);
  const { account } = useAccount(accountId, { withRelationship: true });
  const targetRef = useAppSelector(state => state.profile_hover_card.ref?.current);
  const badges = getBadges(account);

  useEffect(() => {
    if (accountId) dispatch(fetchRelationships([accountId]));
  }, [dispatch, accountId]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      showProfileHoverCard.cancel();
      dispatch(closeProfileHoverCard());
    });

    return () => {
      unlisten();
    };
  }, []);

  const { styles, attributes } = usePopper(targetRef, popperElement);

  if (!account) return null;
  const accountBio = { __html: account.note_emojified };
  const memberSinceDate = intl.formatDate(account.created_at, { month: 'long', year: 'numeric' });
  const followedBy = me !== account.id && account.relationship?.followed_by === true;

  return (
    <div
      className={clsx({
        'absolute transition-opacity w-[320px] z-[101] top-0 left-0': true,
        'opacity-100': visible,
        'opacity-0 pointer-events-none': !visible,
      })}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      onMouseEnter={handleMouseEnter(dispatch)}
      onMouseLeave={handleMouseLeave(dispatch)}
    >
      <Card variant='rounded' className='relative isolate overflow-hidden'>
        <CardBody>
          <Stack space={2}>
            <UserPanel
              accountId={account.id}
              action={<ActionButton account={account} small />}
              badges={badges}
            />

              <HStack alignItems='center' space={0.5}>
                <Icon
                  src={require('@tabler/icons/calendar.svg')}
                  className='h-4 w-4 text-gray-800 dark:text-gray-200'
                />

                <Text size='sm' title={intl.formatDate(account.created_at, dateFormatOptions)}>
                  <FormattedMessage
                    id='account.member_since' defaultMessage='Joined {date}' values={{
                      date: memberSinceDate,
                    }}
                  />
                </Text>
              </HStack>

            {account.note.length > 0 && (
              <Text size='sm' dangerouslySetInnerHTML={accountBio} />
            )}
          </Stack>

          {followedBy && (
            <div className='absolute left-2 top-2'>
              <Badge
                slug='opaque'
                title={<FormattedMessage id='account.follows_you' defaultMessage='Follows you' />}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileHoverCard;