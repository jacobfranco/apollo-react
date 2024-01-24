import { Account as SchemaAccount } from 'src/schemas';
import { 
    StatusRecord 
} from 'src/normalizers'

import {
    Record as ImmutableRecord
} from 'immutable'

import type { LegacyMap } from 'src/utils/legacy';


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
    Status
}

export type {
    Relationship
} from 'src/schemas'