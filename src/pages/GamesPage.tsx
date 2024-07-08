// src/pages/GamesPage.tsx
import React from 'react';
import { Layout } from 'src/components';
import { Link } from 'react-router-dom';
import Games from '../features/Games';

const GamesPage: React.FC = () => {
  return (
    <>
      <Layout.Main>
        <h1 className="text-2xl font-bold mb-6">Games</h1>
        <Games />
      </Layout.Main>
      <Layout.Aside />
    </>
  );
};

export default GamesPage;
