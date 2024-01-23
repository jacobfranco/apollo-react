import { 
    Account as SchemaAccount,
    Status as SchemaStatus
} from 'src/schemas';
import type { LegacyMap } from 'src/utils/legacy';


type Account = SchemaAccount & LegacyMap;
type Status = SchemaStatus & LegacyMap; // TODO: Maybe fix?

// Utility types
type APIEntity = Record<string, any>;

export {
    Account,
    APIEntity,
    Status
}