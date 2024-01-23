import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface IPortal {
  children: React.ReactNode;
}

/**
 * Portal
 */
const Portal: React.FC<IPortal> = ({ children }) => {
  const [isRendered, setIsRendered] = useState<boolean>(false);

  useLayoutEffect(() => {
    setIsRendered(true);
  }, []);

  if (!isRendered) {
    return null;
  }

  return (
    ReactDOM.createPortal(
      children,
      document.getElementById('apollo') as HTMLDivElement, // TODO: Make sure that this is reflected at the top of structure
    )
  );
};

export default Portal;