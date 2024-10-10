// RangeIconButton.tsx
import clsx from 'clsx';
import React from 'react';
import { Text } from 'src/components';

interface IRangeIconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Start date to display (e.g., "Oct 7"). */
  startDate: string;
  /** Year for the start date (e.g., "2024"). */
  startYear: string;
  /** End date to display (e.g., "Oct 13"). */
  endDate: string;
  /** Year for the end date (e.g., "2024"). */
  endYear: string;
  /** Predefined styles to display for the button. */
  theme?: 'seamless' | 'outlined' | 'secondary' | 'transparent' | 'dark';
  /** Override the data-testid */
  'data-testid'?: string;
}

/** A clickable button with a range of dates displayed in multiple lines. */
const RangeIconButton = React.forwardRef(
  (
    props: IRangeIconButton,
    ref: React.ForwardedRef<HTMLButtonElement>
  ): JSX.Element => {
    const {
      className,
      startDate,
      startYear,
      endDate,
      endYear,
      theme = 'seamless',
      ...filteredProps
    } = props;

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'flex flex-col items-center space-y-1 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-0',
          {
            'bg-white dark:bg-transparent': theme === 'seamless',
            'border border-solid bg-transparent border-gray-400 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 focus:border-primary-500 text-gray-900 dark:text-gray-100 focus:ring-primary-500':
              theme === 'outlined',
            'border-transparent bg-primary-100 dark:bg-primary-800 hover:bg-primary-50 dark:hover:bg-primary-700 focus:bg-primary-100 dark:focus:bg-primary-800 text-primary-500 dark:text-primary-200':
              theme === 'secondary',
            'bg-gray-900 text-white':
              theme === 'dark',
            'opacity-50': filteredProps.disabled,
          },
          className
        )}
        {...filteredProps}
        data-testid={filteredProps['data-testid'] || 'range-icon-button'}
      >
        <div className="range-line-text flex flex-col items-center">
          <div className="flex items-center space-x-2">
            {/* Start Date and Year */}
            <div className="flex flex-col items-center">
              <Text tag="span" theme="inherit" size="md" className="range-line-text__date">
                {startDate}
              </Text>
              <Text tag="span" theme="inherit" size="xs" className="range-line-text__year">
                {startYear}
              </Text>
            </div>

            {/* Dash Separator */}
            <span className="range-line-text__dash">-</span>

            {/* End Date and Year */}
            <div className="flex flex-col items-center">
              <Text tag="span" theme="inherit" size="md" className="range-line-text__date">
                {endDate}
              </Text>
              <Text tag="span" theme="inherit" size="xs" className="range-line-text__year">
                {endYear}
              </Text>
            </div>
          </div>
        </div>
      </button>
    );
  }
);

export default RangeIconButton;
