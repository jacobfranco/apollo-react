import { Map as ImmutableMap, type Collection } from 'immutable';

import type { Status } from 'src/schemas';

export const shouldFilter = (
  status: Pick<Status, 'in_reply_to_id' | 'visibility'> & { repost: unknown },
  columnSettings: Collection<any, any>,
) => {
  const shows = ImmutableMap({
    repost: status.repost !== null,
    reply: status.in_reply_to_id !== null,
    direct: status.visibility === 'direct',
  });

  return shows.some((value, key) => {
    return columnSettings.getIn(['shows', key]) === false && value;
  });
};