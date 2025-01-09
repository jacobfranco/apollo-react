import { useEffect, useState } from "react";
import { z } from "zod";

import { HTTPError } from "src/api/HTTPError";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useLoading } from "src/hooks/useLoading";

import { importEntities } from "../actions";
import { findEntity } from "../selectors";
import { Entity } from "../types";

import { EntityFn } from "./types";
import { type UseEntityOpts } from "./useEntity";

/** Entities will be filtered through this function until it returns true. */
type LookupFn<TEntity extends Entity> = (entity: TEntity) => boolean;

function useEntityLookup<TEntity extends Entity>(
  entityType: string,
  lookupFn: LookupFn<TEntity>,
  entityFn: EntityFn<void>,
  opts: UseEntityOpts<TEntity> = {}
) {
  const { schema = z.custom<TEntity>() } = opts;

  const dispatch = useAppDispatch();
  const [fetchedEntity, setFetchedEntity] = useState<TEntity | undefined>();
  const [isFetching, setPromise] = useLoading(true);
  const [error, setError] = useState<unknown>();

  const entity = useAppSelector(
    (state) => findEntity(state, entityType, lookupFn) ?? fetchedEntity
  );
  const isEnabled = opts.enabled ?? true;
  const isLoading = isFetching && !entity;

  const fetchEntity = async () => {
    try {
      const response = await setPromise(entityFn());
      const json = await response.json();
      const entity = schema.parse(json);
      setFetchedEntity(entity);
      dispatch(importEntities([entity], entityType));
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    if (!entity || opts.refetch) {
      fetchEntity();
    }
  }, [isEnabled]);

  return {
    entity,
    fetchEntity,
    isFetching,
    isLoading,
    isUnauthorized: error instanceof HTTPError && error.response.status === 401,
    isForbidden: error instanceof HTTPError && error.response.status === 403,
  };
}

export { useEntityLookup };
