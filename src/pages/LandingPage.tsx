import React from "react";

import { Layout, SidebarNavigation } from "src/components";
import LinkFooter from "src/features/LinkFooter";
import {
  TrendsPanel,
  SignUpPanel,
  CtaBanner,
} from "src/features/AsyncComponents";
import { useAppSelector } from "src/hooks";

interface ILandingPage {
  children: React.ReactNode;
}

const LandingPage: React.FC<ILandingPage> = ({ children }) => {
  const me = useAppSelector((state) => state.me);

  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>
      <Layout.Main className="space-y-3 pt-3 sm:pt-0 dark:divide-gray-800">
        {children}

        {!me && <CtaBanner />}
      </Layout.Main>

      <Layout.Aside>
        {!me && <SignUpPanel />}
        <TrendsPanel limit={5} />

        <LinkFooter />
      </Layout.Aside>
    </Layout>
  );
};

export default LandingPage;
