import React from "react";

import { Layout } from "src/components";

interface IEmptyPage {
  children: React.ReactNode;
}

const DetailPage: React.FC<IEmptyPage> = ({ children }) => {
  return (
    <Layout>
      <Layout.Main noAside fullWidth>
        {children}
      </Layout.Main>
    </Layout>
  );
};

export default DetailPage;
