import { Account as SchemaAccount } from 'src/schemas';
import {
  // AdminAccountRecord,
  // AdminReportRecord,
  AttachmentRecord,
  ChatRecord,
  ChatMessageRecord,
  EmojiRecord,
  FieldRecord,
  FilterRecord,
  FilterKeywordRecord,
  FilterStatusRecord,
  HistoryRecord,
  MentionRecord,
  NotificationRecord,
  SpaceRecord,
  StatusRecord,
  TagRecord,
} from 'src/normalizers'

import {
  Record as ImmutableRecord
} from 'immutable'

import type { LegacyMap } from 'src/utils/legacy';
import { z } from 'zod';

type Attachment = ReturnType<typeof AttachmentRecord>;
type Chat = ReturnType<typeof ChatRecord>;
type ChatMessage = ReturnType<typeof ChatMessageRecord>;
type Emoji = ReturnType<typeof EmojiRecord>;
type Field = ReturnType<typeof FieldRecord>;
type Filter = ReturnType<typeof FilterRecord>;
type FilterKeyword = ReturnType<typeof FilterKeywordRecord>;
type FilterStatus = ReturnType<typeof FilterStatusRecord>;
type History = ReturnType<typeof HistoryRecord>;
type Mention = ReturnType<typeof MentionRecord>;
type Notification = ReturnType<typeof NotificationRecord>;
type Space = ReturnType<typeof SpaceRecord>;
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
  Chat,
  ChatMessage,
  EmbeddedEntity,
  Emoji,
  Field,
  Filter,
  FilterKeyword,
  FilterStatus,
  History,
  Mention,
  Notification,
  Space,
  Status,
  Tag
}

export type {
  Card,
  EmojiReaction,
  Group,
  GroupMember,
  GroupRelationship,
  LiveMatch,
  Poll,
  PollOption,
  Relationship
} from 'src/schemas'