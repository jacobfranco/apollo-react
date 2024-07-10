import React from 'react';
import { Layout } from 'src/components';

interface GamesPageProps {
  children: React.ReactNode;
}

const GamesPage: React.FC<GamesPageProps> = ({ children }) => {
  return (
    <>
      <Layout.Main>
        <h1 className="text-2xl font-bold mb-6">Games</h1>
        {children}
      </Layout.Main>
      <Layout.Aside />
    </>
  );
};

export default GamesPage;
