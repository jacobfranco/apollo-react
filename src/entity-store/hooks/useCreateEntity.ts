import { z } from "zod";

import { HTTPError } from "src/api/HTTPError";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useLoading } from "src/hooks/useLoading";

import { importEntities } from "../actions.ts";

import { parseEntitiesPath } from "./utils.ts";

import type {
  EntityCallbacks,
  EntityFn,
  EntitySchema,
  ExpandedEntitiesPath,
} from "./types.ts";
import type { Entity } from "../types.ts";

interface UseCreateEntityOpts<TEntity extends Entity = Entity> {
  schema?: EntitySchema<TEntity>;
}

function useCreateEntity<TEntity extends Entity = Entity, Data = unknown>(
  expandedPath: ExpandedEntitiesPath,
  entityFn: EntityFn<Data>,
  opts: UseCreateEntityOpts<TEntity> = {}
) {
  const dispatch = useAppDispatch();

  const [isSubmitting, setPromise] = useLoading();
  const { entityType, listKey } = parseEntitiesPath(expandedPath);

  async function createEntity(
    data: Data,
    callbacks: EntityCallbacks<TEntity, HTTPError> = {}
  ): Promise<void> {
    try {
      const result = await setPromise(entityFn(data));
      const schema = opts.schema || z.custom<TEntity>();
      const entity = schema.parse(await result.json());

      // TODO: optimistic updating
      dispatch(importEntities([entity], entityType, listKey, "start"));

      if (callbacks.onSuccess) {
        callbacks.onSuccess(entity);
      }
    } catch (error) {
      if (error instanceof HTTPError) {
        if (callbacks.onError) {
          callbacks.onError(error);
        }
      } else {
        throw error;
      }
    }
  }

  return {
    createEntity,
    isSubmitting,
  };
}

export { useCreateEntity };
