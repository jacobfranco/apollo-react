import React from 'react';

import { Spinner } from 'src/components';
import { Card, CardBody } from 'src/components/Card'

const ColumnLoading = () => (
  <Card variant='rounded'>
    <CardBody>
      <Spinner />
    </CardBody>
  </Card>
);

export default ColumnLoading;