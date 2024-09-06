import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesCurve } from 'react-sparklines';
import { shortNumberFormat } from '../utils/numbers';
import { HStack, Stack, Text } from 'src/components';
import type { Space as SpaceType } from 'src/types/entities';

interface ISpace {
  space: SpaceType;
}

const Space: React.FC<ISpace> = ({ space }) => {
  const count = Number(space.history?.get(0)?.accounts);
  return (
    <HStack alignItems='center' justifyContent='between' data-testid='space'>
      <Stack>
        <Link to={`/s/${space.url}`} className='hover:underline'>
          <Text tag='span' size='sm' weight='semibold'>/s/{space.name}</Text>
        </Link>
        {Boolean(count) && (
          <Text theme='muted' size='sm'>
            <FormattedMessage
              id='trends.count_by_accounts'
              defaultMessage='{count} {rawCount, plural, one {person} other {people}} discussing'
              values={{
                rawCount: count,
                count: <strong>{shortNumberFormat(count)}</strong>,
              }}
            />
          </Text>
        )}
      </Stack>
      {space.history && (
        <div className='w-[40px]' data-testid='sparklines'>
          <Sparklines
            width={40}
            height={28}
            data={space.history.reverse().map((day) => +day.uses).toArray()}
          >
            <SparklinesCurve style={{ fill: 'none' }} color='#818cf8' />
          </Sparklines>
        </div>
      )}
    </HStack>
  );
};

export default Space;