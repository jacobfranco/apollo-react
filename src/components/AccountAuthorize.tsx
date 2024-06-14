import React from 'react';

import { authorizeFollowRequest, rejectFollowRequest } from 'src/actions/accounts';
import { useAccount } from 'src/api/hooks';
import { Account, AuthorizeRejectButtons } from 'src/components';
import { useAppDispatch } from 'src/hooks';

interface IAccountAuthorize {
  id: string;
}

const AccountAuthorize: React.FC<IAccountAuthorize> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { account } = useAccount(id);

  const onAuthorize = () => dispatch(authorizeFollowRequest(id));
  const onReject = () => dispatch(rejectFollowRequest(id));

  if (!account) return null;

  return (
    <div className='p-2.5'>
      <Account
        account={account}
        action={
          <AuthorizeRejectButtons
            onAuthorize={onAuthorize}
            onReject={onReject}
            countdown={1000}
          />
        }
      />
    </div>
  );
};

export default AccountAuthorize;