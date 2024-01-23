import React from 'react';
import clsx from 'clsx';
import { useTheme } from 'src/hooks';

interface ISiteLogo extends React.ComponentProps<'img'> {
  className?: string;
  theme?: 'dark' | 'light';
}

const SiteLogo: React.FC<ISiteLogo> = ({ className, theme, ...rest }) => {
  let darkMode = useTheme() === 'dark';
  if (theme === 'dark') darkMode = true;
  else if (theme === 'light') darkMode = false;

  const soapboxLogo = darkMode
    ? require('src/assets/logo.png')
    : require('src/assets/logo.png'); // TODO: change ?

  return (
    <img
      className={clsx('object-contain', className)}
      src={soapboxLogo}
      {...rest}
    />
  );
};

export default SiteLogo;
