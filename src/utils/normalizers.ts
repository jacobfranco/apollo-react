/** Legacy normalizer transition helper function. */
export const maybeFromJS = (value: any): unknown => {
    if ('toJS' in value) {
      return value.toJS();
    } else {
      return value;
    }
  };