import React from "react";
import SidebarNavigation from "src/components/SidebarNavigation";
import Layout from "src/components/Layout";
import { LatestAccountsPanel } from "src/features/AsyncComponents";

import LinkFooter from "src/features/LinkFooter";

interface IAdminPage {
  children: React.ReactNode;
}

const AdminPage: React.FC<IAdminPage> = ({ children }) => {
  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>
      <Layout.Main>{children}</Layout.Main>

      <Layout.Aside>
        <LatestAccountsPanel limit={5} />
        <LinkFooter />
      </Layout.Aside>
    </Layout>
  );
};

export default AdminPage;
