import React from "react";

import LinkFooter from "src/features/LinkFooter";
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  CtaBanner,
  TrendingSpacesPanel,
} from "src/features/AsyncComponents";
import { useAppSelector } from "src/hooks";

import { Layout, SidebarNavigation } from "src/components";

interface IStatusPage {
  children: React.ReactNode;
}

const StatusPage: React.FC<IStatusPage> = ({ children }) => {
  const me = useAppSelector((state) => state.me);

  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>
      <Layout.Main>
        {children}

        {!me && <CtaBanner />}
      </Layout.Main>

      <Layout.Aside>
        {!me && <SignUpPanel />}
        <TrendsPanel limit={5} />
        <TrendingSpacesPanel limit={3} />
        {me && <WhoToFollowPanel limit={3} />}
        <LinkFooter />
      </Layout.Aside>
    </Layout>
  );
};

export default StatusPage;
