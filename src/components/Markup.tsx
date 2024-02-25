import React from 'react';

import Text, { IText } from 'src/components/Text';
import 'src/styles/components/Markup.css';

interface IMarkup extends IText {
}

/** Styles HTML markup returned by the API, such as in account bios and statuses. */
const Markup = React.forwardRef<any, IMarkup>((props, ref) => {
  return (
    <Text ref={ref} {...props} data-markup />
  );
});

export default Markup;