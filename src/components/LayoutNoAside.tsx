import clsx from 'clsx';
import React from 'react';
import StickyBox from 'react-sticky-box';

interface ISidebar {
  children: React.ReactNode;
}

interface ILayout {
  children: React.ReactNode;
}

interface LayoutNoAsideComponent extends React.FC<ILayout> {
  Sidebar: React.FC<ISidebar>;
  Main: React.FC<React.HTMLAttributes<HTMLDivElement>>;
}

/** Layout container without Aside */
const LayoutNoAside: LayoutNoAsideComponent = ({ children }) => (
  <div className='relative flex grow flex-col black:pt-0 sm:pt-4'>
    <div className='mx-auto w-full max-w-3xl grow sm:px-6 md:grid md:max-w-7xl md:grid-cols-12 md:gap-8 md:px-8'>
      {children}
    </div>
  </div>
);

/** Left sidebar container in the UI. */
const Sidebar: React.FC<ISidebar> = ({ children }) => (
  <div className='hidden lg:col-span-3 lg:block'>
    <StickyBox offsetTop={80} className='pb-4'>
      {children}
    </StickyBox>
  </div>
);

/** Center column container in the UI. Takes the full space of Main + Aside */
const Main: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
  <main
    className={clsx(
      'md:col-span-12 lg:col-span-9 xl:col-span-9 pb-36 black:border-gray-800 lg:black:border-l', // Adjust col-span to take up Sidebar and previous Aside columns
      className
    )}
  >
    {children}
  </main>
);

LayoutNoAside.Sidebar = Sidebar;
LayoutNoAside.Main = Main;

export default LayoutNoAside;
