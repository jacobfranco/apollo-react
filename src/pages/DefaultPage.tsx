import React from "react";

import {
  WhoToFollowPanel,
  TrendsPanel,
  TrendingSpacesPanel,
  SignUpPanel,
  CtaBanner,
} from "src/features/AsyncComponents";
import { useAppSelector } from "src/hooks";

import { Layout, SidebarNavigation } from "src/components";
import LinkFooter from "src/features/LinkFooter";

interface IDefaultPage {
  children: React.ReactNode;
}

const DefaultPage: React.FC<IDefaultPage> = ({ children }) => {
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
        <LinkFooter key="link-footer" />
      </Layout.Aside>
    </Layout>
  );
};

export default DefaultPage;
