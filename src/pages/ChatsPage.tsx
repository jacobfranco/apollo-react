import React from "react";
import { Layout, SidebarNavigation } from "src/components";

interface IChatsPage {
  children: React.ReactNode;
}

/** Custom layout for chats on desktop. */
const ChatsPage: React.FC<IChatsPage> = ({ children }) => {
  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>

      <Layout.Main noAside>{children}</Layout.Main>
    </Layout>
  );
};

export default ChatsPage;
