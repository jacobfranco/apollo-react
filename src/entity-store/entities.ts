import type * as Schemas from 'src/schemas';

enum Entities {
  ACCOUNTS = 'Accounts',
  GROUPS = 'Groups',
  RELATIONSHIPS = 'Relationships',
  STATUSES = 'Statuses'
}

interface EntityTypes {
  [Entities.ACCOUNTS]: Schemas.Account;
  [Entities.GROUPS]: Schemas.Group;
  [Entities.RELATIONSHIPS]: Schemas.Relationship;
  [Entities.STATUSES]: Schemas.Status;
}

export { Entities, type EntityTypes };