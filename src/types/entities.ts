import { Account as SchemaAccount } from 'src/schemas';
import { 
    HistoryRecord,
    StatusRecord,
    TagRecord,
} from 'src/normalizers'

import {
    Record as ImmutableRecord
} from 'immutable'

import type { LegacyMap } from 'src/utils/legacy';

type History = ReturnType<typeof HistoryRecord>;
type Tag = ReturnType<typeof TagRecord>;


type Account = SchemaAccount & LegacyMap;

interface Status extends ReturnType<typeof StatusRecord> {
    quote: EmbeddedEntity<Status>;
    repost: EmbeddedEntity<Status>;
  }

// Utility types
type APIEntity = Record<string, any>;
type EmbeddedEntity<T extends object> = null | string | ReturnType<ImmutableRecord.Factory<T>>;

export {
    Account,
    APIEntity,
    EmbeddedEntity,
    History,
    Status,
    Tag
}

export type {
    Relationship
} from 'src/schemas'