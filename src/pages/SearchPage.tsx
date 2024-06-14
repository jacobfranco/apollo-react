import React from 'react';

import LinkFooter from 'src/features/LinkFooter';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  CtaBanner,
  SuggestedGroupsPanel,
} from 'src/features/AsyncComponents';
import { useAppSelector } from 'src/hooks';

import { Layout } from 'src/components';

interface ISearchPage {
  children: React.ReactNode;
}

const SearchPage: React.FC<ISearchPage> = ({ children }) => {
  const me = useAppSelector(state => state.me);

  return (
    <>
      <Layout.Main>
        {children}

        {!me && (
          <CtaBanner />
        )}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <SignUpPanel />
        )}
          <TrendsPanel limit={5} />

        {me && (
          <WhoToFollowPanel limit={3} />
        )}

          <SuggestedGroupsPanel />

        <LinkFooter />
      </Layout.Aside>
    </>
  );
};

export default SearchPage;