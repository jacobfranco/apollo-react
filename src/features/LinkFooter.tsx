import clsx from 'clsx';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { logOut } from 'src/actions/auth';
import { Text } from 'src/components';
// import emojify from 'soapbox/features/emoji'; TODO: Implemment Emoji
import { useOwnAccount, useAppDispatch } from 'src/hooks';
import sourceCode from 'src/utils/code'; // TODO: Implement this

interface IFooterLink {
  to: string;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
  children: React.ReactNode;
}

const FooterLink: React.FC<IFooterLink> = ({ children, className, ...rest }): JSX.Element => {
  return (
    <div>
      <Link className={clsx('text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500', className)} {...rest}>{children}</Link>
    </div>
  );
};

const LinkFooter: React.FC = (): JSX.Element => {
  const { account } = useOwnAccount();

  const dispatch = useAppDispatch();

  const onClickLogOut: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(logOut());
    e.preventDefault();
  };

  return (
    <div className='space-y-2'>
      <div className='divide-x-dot flex flex-wrap items-center text-gray-600'>
        {account && <>
          <FooterLink to='/directory'><FormattedMessage id='navigation_bar.profile_directory' defaultMessage='Profile directory' /></FooterLink>
          <FooterLink to='/blocks'><FormattedMessage id='navigation_bar.blocks' defaultMessage='Blocks' /></FooterLink>
          <FooterLink to='/mutes'><FormattedMessage id='navigation_bar.mutes' defaultMessage='Mutes' /></FooterLink>
          <FooterLink to='/filters'><FormattedMessage id='navigation_bar.filters' defaultMessage='Filters' /></FooterLink>
          <FooterLink to='/followed_tags'><FormattedMessage id='navigation_bar.followed_tags' defaultMessage='Followed hashtags' /></FooterLink>
          {account.admin && (
            <FooterLink to='/soapbox/config'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Soapbox config' /></FooterLink>
          )}
          {account.locked && (
            <FooterLink to='/follow_requests'><FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' /></FooterLink>
          )}
          <FooterLink to='/logout' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></FooterLink>
        </>}
      </div>

      <Text theme='muted' size='sm'>
        {soapboxConfig.linkFooterMessage ? (
          <span
            className='inline-block align-middle'
            dangerouslySetInnerHTML={{ __html: emojify(soapboxConfig.linkFooterMessage) }}
          />
        ) : (
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} (v{code_version}).'
            values={{
              code_name: sourceCode.displayName,
              code_link: <Text theme='subtle' tag='span'><a className='underline' href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a></Text>,
              code_version: sourceCode.version,
            }}
          />
        )}
      </Text>
    </div>
  );
};

export default LinkFooter;