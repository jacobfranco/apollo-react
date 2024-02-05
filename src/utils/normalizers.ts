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