import clsx from 'clsx';
import React from 'react';

interface IBackgroundShapes {
  /** Whether the shapes should be absolute positioned or fixed. */
  position?: 'fixed' | 'absolute';
}

/** Gradient that appears in the background of the UI. */
const BackgroundShapes: React.FC<IBackgroundShapes> = ({ position = 'fixed' }) => (
  <div className={clsx(position, 'pointer-events-none inset-x-0 top-0 flex justify-center overflow-hidden')}>
   <div className='h-screen w-screen bg-gradient-light dark:bg-gradient-dark' />
  </div>
);

export default BackgroundShapes;