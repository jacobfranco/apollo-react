import React from "react";

import { Layout, SidebarNavigation } from "src/components";

interface IEmptyPage {
  children: React.ReactNode;
}

const EmptyPage: React.FC<IEmptyPage> = ({ children }) => {
  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>
      <Layout.Main>{children}</Layout.Main>

      <Layout.Aside />
    </Layout>
  );
};

export default EmptyPage;
