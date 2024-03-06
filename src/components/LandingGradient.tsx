import React from 'react';

/** Fullscreen gradient used as a backdrop to public pages. */
const LandingGradient: React.FC = () => (
  <div
    className={`fixed h-screen w-full bg-gradient-light dark:bg-gradient-dark`}
  />
);

export default LandingGradient;