import React, { useCallback } from 'react';

import { QuotedStatus } from 'src/components';
import { useAppSelector } from 'src/hooks';
import { makeGetStatus } from 'src/selectors';

interface IQuotedStatusContainer {
  /** Status ID to the quoted status. */
  statusId: string;
}

const QuotedStatusContainer: React.FC<IQuotedStatusContainer> = ({ statusId }) => {
  const getStatus = useCallback(makeGetStatus(), []);

  const status = useAppSelector(state => getStatus(state, { id: statusId }));

  if (!status) {
    return null;
  }

  return (
    <QuotedStatus
      status={status}
    />
  );
};

export default QuotedStatusContainer;