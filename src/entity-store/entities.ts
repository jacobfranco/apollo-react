import type * as Schemas from 'src/schemas';

enum Entities {
  ACCOUNTS = 'Accounts',
}

interface EntityTypes {
  [Entities.ACCOUNTS]: Schemas.Account;
}

export { Entities, type EntityTypes };