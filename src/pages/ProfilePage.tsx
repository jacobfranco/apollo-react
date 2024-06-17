import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, useHistory } from 'react-router-dom';

import { useAccountLookup } from 'src/api/hooks';
import { Column, Header, Layout, Tabs } from 'src/components';
import {
  WhoToFollowPanel,
  ProfileInfoPanel,
  ProfileMediaPanel,
  ProfileFieldsPanel,
  SignUpPanel,
  CtaBanner,
} from 'src/features/AsyncComponents';
import LinkFooter from 'src/features/LinkFooter'
import { useAppSelector } from 'src/hooks';

interface IProfilePage {
  params?: {
    username?: string;
  };
  children: React.ReactNode;
}

/** Page to display a user's profile. */
const ProfilePage: React.FC<IProfilePage> = ({ params, children }) => {
  const history = useHistory();
  const username = params?.username || '';

  const { account } = useAccountLookup(username, { withRelationship: true });

  const me = useAppSelector(state => state.me);

  const tabItems = [
    {
      text: <FormattedMessage id='account.posts' defaultMessage='Posts' />,
      to: `/@${username}`,
      name: 'profile',
    },
    {
      text: <FormattedMessage id='account.posts_with_replies' defaultMessage='Posts & replies' />,
      to: `/@${username}/with_replies`,
      name: 'replies',
    },
    {
      text: <FormattedMessage id='account.media' defaultMessage='Media' />,
      to: `/@${username}/media`,
      name: 'media',
    },
  ];

  if (account) {
    const ownAccount = account.id === me;
    if (ownAccount) {
      tabItems.push({
        text: <FormattedMessage id='navigation_bar.favourites' defaultMessage='Likes' />,
        to: `/@${account.username}/likes`,
        name: 'likes',
      });
    }
  }

  let activeItem;
  const pathname = history.location.pathname.replace(`@${username}/`, '');
  if (pathname.endsWith('/with_replies')) {
    activeItem = 'replies';
  } else if (pathname.endsWith('/media')) {
    activeItem = 'media';
  } else if (pathname.endsWith('/likes')) {
    activeItem = 'likes';
  } else {
    activeItem = 'profile';
  }

  const showTabs = !['/following', '/followers', '/pins'].some(path => pathname.endsWith(path));

  return (
    <>
      <Layout.Main>
        <Column size='lg' label={account ? `@${username})}` : ''} withHeader={false}>
          <div className='space-y-4'>
            <Header account={account} />
            <ProfileInfoPanel username={username} account={account} />

            {account && showTabs && (
              <Tabs key={`profile-tabs-${account.id}`} items={tabItems} activeItem={activeItem} />
            )}

            {children}
          </div>
        </Column>

        {!me && (
          <CtaBanner />
        )}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <SignUpPanel />
        )}

        <ProfileMediaPanel account={account} />
        {(account && account.fields.length > 0) && (
          <ProfileFieldsPanel account={account} />
        )}
        {me && (
          <WhoToFollowPanel limit={3} />
        )}
        <LinkFooter key='link-footer' />
      </Layout.Aside>
    </>
  );
};

export default ProfilePage;