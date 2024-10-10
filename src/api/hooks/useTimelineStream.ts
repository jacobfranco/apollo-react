import { useEffect, useRef } from 'react';

import { connectTimelineStream } from 'src/actions/streaming';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getAccessToken } from 'src/utils/auth';
import * as BuildConfig from 'src/build-config';

function useTimelineStream(...args: Parameters<typeof connectTimelineStream>) {
  // TODO: get rid of streaming.ts and move the actual opts here.
  const [timelineId, path] = args;
  const { enabled = true } = args[4] ?? {};

  const dispatch = useAppDispatch();
  const stream = useRef<(() => void) | null>(null);

  const accessToken = useAppSelector(getAccessToken);
  const streamingUrl = BuildConfig.STREAMING_URL;

  const connect = () => {
    if (enabled && streamingUrl && !stream.current) {
      stream.current = dispatch(connectTimelineStream(...args));
    }
  };

  const disconnect = () => {
    if (stream.current) {
      stream.current();
      stream.current = null;
    }
  };

  useEffect(() => {
    connect();
    return disconnect;
  }, [accessToken, streamingUrl, timelineId, path, enabled]);

  return {
    disconnect,
  };
}

export { useTimelineStream };