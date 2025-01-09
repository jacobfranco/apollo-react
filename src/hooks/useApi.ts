import { useMemo } from "react";

import { ApolloClient } from "src/api/ApolloClient";
import * as BuildConfig from "src/build-config";

import { useAppSelector } from "./useAppSelector";
import { useOwnAccount } from "./useOwnAccount";

export function useApi(): ApolloClient {
  const { account } = useOwnAccount();
  const authUserUrl = useAppSelector((state) => state.auth.me);
  const accessToken = useAppSelector((state) =>
    account ? state.auth.users[account.url]?.access_token : undefined
  );
  const baseUrl = new URL(
    BuildConfig.BACKEND_URL || account?.url || authUserUrl || location.origin
  ).origin;

  return useMemo(() => {
    return new ApolloClient(baseUrl, accessToken);
  }, [baseUrl, accessToken]);
}
