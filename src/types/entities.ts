import { Account as SchemaAccount } from 'src/schemas';
import type { LegacyMap } from 'src/utils/legacy';

type Account = SchemaAccount & LegacyMap;

// Utility types
type APIEntity = Record<string, any>;

export {
    Account,
    APIEntity
}