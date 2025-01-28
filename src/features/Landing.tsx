import React from "react";
import { Column } from "src/components/Column";

import BigLogo from "src/assets/images/big_logo.png";

const Landing = () => {
  const bigLogo = BigLogo;

  return (
    <Column transparent withHeader={false}>
      <div className="max-w-4xl w-full space-y-8 pt-4 text-center">
        {/* Logo and Heading Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-44 h-44">
            <img src={bigLogo} alt="" className="w-full h-full" />
          </div>

          <h1 className="text-4xl md:text-6xl tracking-tight">
            Be Among The First.
          </h1>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <p className="text-md md:text-lg">
            Welcome to Apollo, a new online ecosystem{" "}
            <span className="text-primary-500">for the gaming community</span>
            <br />
          </p>
        </div>
      </div>
    </Column>
  );
};

export default Landing;
