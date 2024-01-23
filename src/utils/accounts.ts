import type { Account } from 'src/schemas';

export const getAcct = (account: Pick<Account, 'fqn' | 'acct'>, displayFqn: boolean): string => (
    displayFqn === true ? account.fqn ?? '' : account.acct ?? ''
);

  