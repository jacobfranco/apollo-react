import React from 'react';
import LayoutNoAside from 'src/components/LayoutNoAside';

interface IEsportPage {
  children: React.ReactNode;
}

const ESportsPage: React.FC<IEsportPage> = ({ children }) => {
  return (
    <>
      <LayoutNoAside.Main>
        {children}
      </LayoutNoAside.Main>
    </>
  );
};

export default ESportsPage;
