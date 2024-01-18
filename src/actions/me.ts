import type { Account } from 'src/schemas';
import type { APIEntity } from 'src/types/entities';

const ME_FETCH_SUCCESS = 'ME_FETCH_SUCCESS' as const;
const ME_FETCH_FAIL    = 'ME_FETCH_FAIL' as const;

const fetchMeSuccess = (account: Account) => {
    return {
      type: ME_FETCH_SUCCESS,
      me: account,
    };
  };
  
  const fetchMeFail = (error: APIEntity) => ({
    type: ME_FETCH_FAIL,
    error,
    skipAlert: true,
  });

  export {
    ME_FETCH_SUCCESS,
    ME_FETCH_FAIL,
    fetchMeSuccess,
    fetchMeFail
  }