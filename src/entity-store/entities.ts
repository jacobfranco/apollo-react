import type * as Schemas from 'src/schemas';

enum Entities {
  ACCOUNTS = 'Accounts',
  RELATIONSHIPS = 'Relationships'
}

interface EntityTypes {
  [Entities.ACCOUNTS]: Schemas.Account;
  [Entities.RELATIONSHIPS]: Schemas.Relationship;
}

export { Entities, type EntityTypes };