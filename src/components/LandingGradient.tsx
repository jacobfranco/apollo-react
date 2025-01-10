import React from "react";

/** Fullscreen gradient used as a backdrop to public pages. */
const LandingGradient: React.FC = () => (
  <div className="light:bg-gradient-sm-light dark:bg-gradient-sm-dark lg:bg-gradient-light lg:dark:bg-gradient-dark h-screen w-screen" />
);

export default LandingGradient;
