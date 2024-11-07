import clsx from "clsx";
import React, { Suspense } from "react";
import StickyBox from "react-sticky-box";

interface ISidebar {
  children: React.ReactNode;
}

interface IAside {
  children?: React.ReactNode;
}

interface ILayout {
  children: React.ReactNode;
}

interface IMainProps extends React.HTMLAttributes<HTMLDivElement> {
  noAside?: boolean;
  fullWidth?: boolean;
}

interface LayoutComponent extends React.FC<ILayout> {
  Sidebar: React.FC<ISidebar>;
  Main: React.FC<IMainProps>;
  Aside: React.FC<IAside>;
}

/** Layout container, to hold Sidebar, Main, and Aside. */
const Layout: LayoutComponent = ({ children }) => (
  <div className="relative flex grow flex-col black:pt-0 sm:pt-4">
    <div className="mx-auto w-full max-w-3xl grow sm:px-6 md:grid md:max-w-7xl md:grid-cols-12 md:gap-8 md:px-8">
      {children}
    </div>
  </div>
);

/** Left sidebar container in the UI. */
const Sidebar: React.FC<ISidebar> = ({ children }) => (
  <div className="hidden lg:col-span-3 lg:block">
    <StickyBox offsetTop={80} className="pb-4">
      {children}
    </StickyBox>
  </div>
);

/** Center column container in the UI. */
const Main: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    noAside?: boolean;
    fullWidth?: boolean;
  }
> = ({ children, className, noAside = false, fullWidth = false }) => {
  const mainClasses = clsx(
    "pb-36 black:border-gray-800",
    {
      "md:col-span-12 lg:col-span-9 xl:col-span-6 lg:black:border-l xl:black:border-r":
        !noAside && !fullWidth,
      "md:col-span-12 lg:col-span-9 xl:col-span-9 lg:black:border-l":
        noAside && !fullWidth,
      "md:col-span-12 lg:col-span-12": fullWidth,
    },
    className
  );
  return <main className={mainClasses}>{children}</main>;
};

/** Right sidebar container in the UI. */
const Aside: React.FC<IAside> = ({ children }) => (
  <aside className="hidden xl:col-span-3 xl:block">
    <StickyBox offsetTop={80} className="space-y-6 pb-12">
      <Suspense>{children}</Suspense>
    </StickyBox>
  </aside>
);

Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.Aside = Aside;

export default Layout;
