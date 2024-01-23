import React from 'react';

import { useAccount } from 'src/api/hooks';
import Account from 'src/components/Account';

interface IAutosuggestAccount {
  id: string;
}

const AutosuggestAccount: React.FC<IAutosuggestAccount> = ({ id }) => {
  const { account } = useAccount(id);
  if (!account) return null;

  return (
    <div className='snap-start snap-always'>
      <Account account={account} hideActions showProfileHoverCard={false} />
    </div>
  );

};

export default AutosuggestAccount;