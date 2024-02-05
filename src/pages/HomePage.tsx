import clsx from 'clsx';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { uploadCompose } from 'src/actions/compose';
import LinkFooter from 'src/features/LinkFooter';
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  PromoPanel,
  CtaBanner,
  AnnouncementsPanel,
} from 'src/features/AsyncComponents';
import { useAppSelector, useOwnAccount, useDraggedFiles, useAppDispatch } from 'src/hooks';

import { Avatar, HStack, Layout, Card, CardBody } from 'src/components';
import ComposeForm from '../features/compose/components/ComposeForm';

interface IHomePage {
  children: React.ReactNode;
}

const HomePage: React.FC<IHomePage> = ({ children }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const me = useAppSelector(state => state.me);
  const { account } = useOwnAccount();

  const composeId = 'home';
  const composeBlock = useRef<HTMLDivElement>(null);

  const { isDragging, isDraggedOver } = useDraggedFiles(composeBlock, (files) => {
    dispatch(uploadCompose(composeId, files, intl));
  });

  const acct = account ? account.acct : '';
  const avatar = account ? account.avatar : '';

  return (
    <>
      <Layout.Main className='space-y-3 pt-3 sm:pt-0 dark:divide-gray-800'>
        {me && (
          <Card
            className={clsx('relative z-[1] transition', {
              'border-2 border-primary-600 border-dashed z-[99]': isDragging,
              'ring-2 ring-offset-2 ring-primary-600': isDraggedOver,
            })}
            variant='rounded'
            ref={composeBlock}
          >
            <CardBody>
              <HStack alignItems='start' space={4}>
                <Link to={`/@${acct}`}>
                  <Avatar src={avatar} size={46} />
                </Link>

                <div className='w-full translate-y-0.5'>
                  <ComposeForm
                    id={composeId}
                    shouldCondense
                    autoFocus={false}
                    clickableAreaRef={composeBlock}
                  />
                </div>
              </HStack>
            </CardBody>
          </Card>
        )}

        {children}

        {!me && (
          <CtaBanner />
        )}
      </Layout.Main>

      <Layout.Aside>
        {!me && (
          <SignUpPanel />
        )}
        {me && (
          <AnnouncementsPanel />
        )}
        
         <TrendsPanel limit={5} />
        
        <PromoPanel />
        {me && (
          <WhoToFollowPanel limit={3} />
        )}
        <LinkFooter />
      </Layout.Aside>
    </>
  );
};

export default HomePage;