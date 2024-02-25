import clsx from 'clsx';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { spring } from 'react-motion';
import InlineSVG from 'react-inlinesvg';

import { HStack } from 'src/components';
import ReplyIndicator from 'src/features/compose/components/ReplyIndicator';

import Motion from 'src/utils/optional-motion';

import type { Menu, MenuItem } from 'src/components/dropdown-menu';
import type { Status as StatusEntity } from 'src/types/entities';

interface IActionsModal {
  status: StatusEntity;
  actions: Menu;
  onClick: () => void;
  onClose: () => void;
}

// Using this implementation instead of the Icon component
export interface IIcon extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  id?: string;
  alt?: string;
  className?: string;
}

const Icon: React.FC<IIcon> = ({ src, alt, className, ...rest }) => {
  return (
    <div
      className={clsx('svg-icon', className)}
      {...rest}
    >
      <InlineSVG src={src} title={alt} loader={<></>} />
    </div>
  );
};

const ActionsModal: React.FC<IActionsModal> = ({ status, actions, onClick, onClose }) => {
  const renderAction = (action: MenuItem | null, i: number) => {
    if (action === null) {
      return <li key={`sep-${i}`} className='dropdown-menu__separator' />;
    }

    const { icon = null, text, meta = null, active = false, href = '#', destructive } = action;

    const Comp = href === '#' ? 'button' : 'a';
    const compProps = href === '#' ? { onClick: onClick } : { href: href, rel: 'noopener' };

    return (
      <li key={`${text}-${i}`}>
        <HStack
          {...compProps}
          space={2.5}
          data-index={i}
          className={clsx('w-full', { active, destructive })}
          element={Comp}
        >
          {icon && <Icon title={text} src={icon} role='presentation' tabIndex={-1} />}
          <div>
            <div className={clsx({ 'actions-modal__item-label': !!meta })}>{text}</div>
            <div>{meta}</div>
          </div>
        </HStack>
      </li>
    );
  };

  return (
    <Motion defaultStyle={{ top: 100 }} style={{ top: spring(0) }}>
      {({ top }) => (
        <div className='modal-root__modal actions-modal' style={{ top: `${top}%` }}>
          {status && (
            <ReplyIndicator className='actions-modal__status rounded-b-none' status={status} hideActions />
          )}

          <ul className={clsx({ 'with-status': !!status })}>
            {actions && actions.map(renderAction)}

            <li className='dropdown-menu__separator' />

            <li>
              <button type='button' onClick={onClose}>
                <FormattedMessage id='lightbox.close' defaultMessage='Close' />
              </button>
            </li>
          </ul>
        </div>
      )}
    </Motion>
  );
};

export default ActionsModal;