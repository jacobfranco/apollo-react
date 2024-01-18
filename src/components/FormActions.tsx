import React from 'react';

import { HStack } from 'src/components'

interface IFormActions {
  children: React.ReactNode;
}

/** Container element to house form actions. */
const FormActions: React.FC<IFormActions> = ({ children }) => (
  <HStack space={2} justifyContent='end'>
    {children}
  </HStack>
);

export default FormActions;