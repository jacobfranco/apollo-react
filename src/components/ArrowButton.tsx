import React from 'react';
import clsx from 'clsx';
import Icon from './Icon';

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
  ariaLabel: string;
  disabled?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ src, ariaLabel, disabled, className, ...props }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        'flex items-center justify-center rounded-full p-2 transition-colors duration-100',
        {
          'text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-500': !disabled,
          'cursor-not-allowed opacity-50': disabled,
        },
        className
      )}
      {...props}
    >
      <Icon src={src} className="h-5 w-5" />
    </button>
  );
};

export default ArrowButton;
