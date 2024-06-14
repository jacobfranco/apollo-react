import React from 'react';

import LinkFooter from 'src/features/LinkFooter';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  CtaBanner,
} from 'src/features/AsyncComponents';
import { useAppSelector } from 'src/hooks';

import { Layout } from 'src/components';

interface IStatusPage {
  children: React.ReactNode;
}

const StatusPage: React.FC<IStatusPage> = ({ children }) => {
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
        <LinkFooter />
      </Layout.Aside>
    </>
  );
};

export default StatusPage;