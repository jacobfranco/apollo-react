import React from 'react';
import { FormattedMessage } from 'react-intl';

import { HStack, ProgressBar, Stack, Text } from 'src/components';
import Icon from './Icon';

interface IUploadProgress {
  /** Number between 0 and 100 to represent the percentage complete. */
  progress: number;
}

/** Displays a progress bar for uploading files. */
const UploadProgress: React.FC<IUploadProgress> = ({ progress }) => {
  return (
    <HStack alignItems='center' space={2}>
      <Icon
        src={require('@tabler/icons/outline/cloud-upload.svg')}
        className='h-7 w-7 text-gray-500'
      />

      <Stack space={1}>
        <Text theme='muted'>
          <FormattedMessage id='upload_progress.label' defaultMessage='Uploading…' />
        </Text>

        <ProgressBar progress={progress / 100} size='sm' />
      </Stack>
    </HStack>
  );
};

export default UploadProgress;