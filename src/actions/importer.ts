import { APIEntity } from 'src/types/entities';
import { AppDispatch, RootState } from 'src/store'
import { Entities } from 'src/entity-store/entities';
import { importEntities } from 'src/entity-store/actions';
import { accountSchema } from 'src/schemas';
import { filteredArray } from 'src/schemas/utils';

const ACCOUNT_IMPORT  = 'ACCOUNT_IMPORT';
const ACCOUNTS_IMPORT = 'ACCOUNTS_IMPORT';

const importAccount = (data: APIEntity) =>
  (dispatch: AppDispatch, _getState: () => RootState) => {
    dispatch({ type: ACCOUNT_IMPORT, account: data });
    try {
      const account = accountSchema.parse(data);
      dispatch(importEntities([account], Entities.ACCOUNTS));
    } catch (e) {
      //
    }
  };

  const importAccounts = (data: APIEntity[]) =>
  (dispatch: AppDispatch, _getState: () => RootState) => {
    dispatch({ type: ACCOUNTS_IMPORT, accounts: data });
    try {
      const accounts = filteredArray(accountSchema).parse(data);
      dispatch(importEntities(accounts, Entities.ACCOUNTS));
    } catch (e) {
      //
    }
  };

const importFetchedAccount = (account: APIEntity) =>
  importFetchedAccounts([account]);

const importFetchedAccounts = (accounts: APIEntity[], args = { should_refetch: false }) => {
  const { should_refetch } = args;
  const normalAccounts: APIEntity[] = [];

  const processAccount = (account: APIEntity) => {
    if (!account.id) return;

    if (should_refetch) {
      account.should_refetch = true;
    }

    normalAccounts.push(account);

    if (account.moved) {
      processAccount(account.moved);
    }
  };

  accounts.forEach(processAccount);

  return importAccounts(normalAccounts);
};

export {
    ACCOUNT_IMPORT,
    ACCOUNTS_IMPORT,
    importAccount,
    importAccounts,
    importFetchedAccount,
    importFetchedAccounts,
  };