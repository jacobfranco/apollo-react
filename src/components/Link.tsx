import React from 'react';
import { Link as Comp, LinkProps } from 'react-router-dom';

const Link = (props: LinkProps) => (
  <Comp
    {...props}
    className='text-primary-500 hover:underline dark:text-primary-500'
  />
);

export default Link;