import { useTimelineStream } from './useTimelineStream';

function useSpaceStream(space: string) {
  return useTimelineStream(
    `space:${space}`,
    `space&space=${space}`,
  );
}

export { useSpaceStream };