import z from 'zod';

/** Use new value only if old value is undefined */
export const mergeDefined = (oldVal: any, newVal: any) => oldVal === undefined ? newVal : oldVal;

/** Legacy normalizer transition helper function. */
export const maybeFromJS = (value: any): unknown => {
    if ('toJS' in value) {
      return value.toJS();
    } else {
      return value;
    }
  };

  /** Normalize entity ID */
export const normalizeId = (id: any): string | null => {
  return z.string().nullable().catch(null).parse(id);
};