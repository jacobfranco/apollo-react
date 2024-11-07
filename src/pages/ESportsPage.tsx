import React from "react";
import { SidebarNavigation } from "src/components";
import Layout from "src/components/Layout";

interface IEsportPage {
  children: React.ReactNode;
}

const ESportsPage: React.FC<IEsportPage> = ({ children }) => {
  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>

      <Layout.Main noAside>{children}</Layout.Main>
    </Layout>
  );
};

export default ESportsPage;
