import React from 'react';
import { Layout } from 'src/components';

interface GamesPageProps {
  children: React.ReactNode;
}

const GamesPage: React.FC<GamesPageProps> = ({ children }) => {
  return (
    <>
      <Layout.Main>
        {children}
      </Layout.Main>
      <Layout.Aside />
    </>
  );
};

export default GamesPage;
