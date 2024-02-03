import { Account as SchemaAccount } from 'src/schemas';
import { 
    FilterRecord,
    FilterKeywordRecord,
    FilterStatusRecord,
    HistoryRecord,
    StatusRecord,
    TagRecord,
} from 'src/normalizers'

import {
    Record as ImmutableRecord
} from 'immutable'

import type { LegacyMap } from 'src/utils/legacy';

type Filter = ReturnType<typeof FilterRecord>;
type FilterKeyword = ReturnType<typeof FilterKeywordRecord>;
type FilterStatus = ReturnType<typeof FilterStatusRecord>;
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
    Filter,
    FilterKeyword,
    FilterStatus,
    History,
    Status,
    Tag
}

export type {
    Group,
  GroupMember,
  GroupRelationship,
    Relationship
} from 'src/schemas'