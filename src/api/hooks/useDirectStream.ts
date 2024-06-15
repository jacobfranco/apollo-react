import { useLoggedIn } from 'src/hooks/useLoggedIn';

import { useTimelineStream } from './useTimelineStream';

function useDirectStream() {
  const { isLoggedIn } = useLoggedIn();

  return useTimelineStream(
    'direct',
    'direct',
    null,
    null,
    { enabled: isLoggedIn },
  );
}

export { useDirectStream };