import React from 'react';

import { Spinner, Card, CardBody } from 'src/components';

const ColumnLoading = () => (
  <Card variant='rounded'>
    <CardBody>
      <Spinner />
    </CardBody>
  </Card>
);

export default ColumnLoading;