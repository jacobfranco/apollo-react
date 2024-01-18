import { RootState } from "src/store";
import type { Account as AccountSchema } from 'src/schemas';
import { Entities } from 'src/entity-store/entities';

export function selectAccount(state: RootState, accountId: string) {
    return state.entities[Entities.ACCOUNTS]?.store[accountId] as AccountSchema | undefined;
  }

  export function selectOwnAccount(state: RootState) {
    if (state.me) {
      return selectAccount(state, state.me);
    }
  }