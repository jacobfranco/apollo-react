import React from "react";
import clsx from "clsx";
import InlineSVG from "react-inlinesvg";

import { Counter } from "src/components/";

// Using this implementation instead of the Icon component
export interface IIcon extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  id?: string;
  alt?: string;
  className?: string;
}

interface IIconWithCounter extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  countMax?: number;
  icon?: string;
  src?: string;
}

const Icon: React.FC<IIcon> = ({ src, alt, className, ...rest }) => {
  return (
    <div className={clsx("svg-icon", className)} {...rest}>
      <InlineSVG src={src} title={alt} loader={<></>} />
    </div>
  );
};

const IconWithCounter: React.FC<IIconWithCounter> = ({
  icon,
  count,
  countMax,
  ...rest
}) => {
  return (
    <div className="relative">
      <Icon id={icon} {...(rest as IIcon)} />

      {count > 0 && (
        <span className="absolute -right-3 -top-2">
          <Counter count={count} countMax={countMax} />
        </span>
      )}
    </div>
  );
};

export default IconWithCounter;
