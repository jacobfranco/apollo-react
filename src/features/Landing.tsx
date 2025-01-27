import React from "react";
import { SiteBanner } from "src/components";
import { Column } from "src/components/Column";

const Landing = () => {
  return (
    <Column transparent withHeader={false}>
      <div className="max-w-4xl w-full space-y-8 pt-4 text-center">
        {/* Logo and Heading Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-44 h-44">
            <img
              src="/src/assets/images/big_logo.png"
              alt="Apollo Logo"
              className="w-full h-full"
            />
          </div>

          <h1 className="text-4xl md:text-6xl tracking-tight">
            Be Among The First.
          </h1>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl">
            Apollo is a{" "}
            <span className="text-primary-500">brand-new platform</span>
            <br />
            built entirely for gamers
          </p>
        </div>
      </div>
    </Column>
  );
};

export default Landing;
