import { entitiesTransaction } from 'src/entity-store/actions';
import { useAppDispatch } from 'src/hooks/useAppDispatch';

import type { EntityTypes } from 'src/entity-store/entities';
import type { EntitiesTransaction, Entity } from 'src/entity-store/types';

type Updater<TEntity extends Entity> = Record<string, (entity: TEntity) => TEntity>

type Changes = Partial<{
  [K in keyof EntityTypes]: Updater<EntityTypes[K]>
}>

function useTransaction() {
  const dispatch = useAppDispatch();

  function transaction(changes: Changes): void {
    dispatch(entitiesTransaction(changes as EntitiesTransaction));
  }

  return { transaction };
}

export { useTransaction };