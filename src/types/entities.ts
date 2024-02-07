import { Account as SchemaAccount } from 'src/schemas';
import { 
    AttachmentRecord,
    FilterRecord,
    FilterKeywordRecord,
    FilterStatusRecord,
    HistoryRecord,
    MentionRecord,
    StatusRecord,
    TagRecord,
} from 'src/normalizers'

import {
    Record as ImmutableRecord
} from 'immutable'

import type { LegacyMap } from 'src/utils/legacy';

type Attachment = ReturnType<typeof AttachmentRecord>;
type Filter = ReturnType<typeof FilterRecord>;
type FilterKeyword = ReturnType<typeof FilterKeywordRecord>;
type FilterStatus = ReturnType<typeof FilterStatusRecord>;
type History = ReturnType<typeof HistoryRecord>;
type Mention = ReturnType<typeof MentionRecord>;
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
    Attachment,
    EmbeddedEntity,
    Filter,
    FilterKeyword,
    FilterStatus,
    History,
    Mention,
    Status,
    Tag
}

export type {
  Card,
  Group,
  GroupMember,
  GroupRelationship,
  Poll,
  PollOption,
  Relationship
} from 'src/schemas'