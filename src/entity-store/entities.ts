import type * as Schemas from 'src/schemas';

enum Entities {
  ACCOUNTS = 'Accounts',
  GROUPS = 'Groups',
  GROUP_MEMBERSHIPS = 'GroupMemberships',
  GROUP_MUTES = 'GroupMutes',
  GROUP_RELATIONSHIPS = 'GroupRelationships',
  RELATIONSHIPS = 'Relationships',
  STATUSES = 'Statuses'
}

interface EntityTypes {
  [Entities.ACCOUNTS]: Schemas.Account;
  [Entities.GROUPS]: Schemas.Group;
  [Entities.GROUP_MEMBERSHIPS]: Schemas.GroupMember;
  [Entities.GROUP_RELATIONSHIPS]: Schemas.GroupRelationship;
  [Entities.RELATIONSHIPS]: Schemas.Relationship;
  [Entities.STATUSES]: Schemas.Status;
}

export { Entities, type EntityTypes };