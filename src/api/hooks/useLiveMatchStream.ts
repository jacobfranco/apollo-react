import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { connectLiveMatchStream } from 'src/actions/streaming';
import { getAccessToken } from 'src/utils/auth';
import * as BuildConfig from 'src/build-config';

const useLiveMatchStream = (matchId: number) => {
  const dispatch = useAppDispatch();
  const stream = useRef<(() => void) | null>(null);

  const accessToken = useAppSelector(getAccessToken);
  const streamingUrl = BuildConfig.STREAMING_URL;
  const path = `live-match/${matchId}`; // WebSocket endpoint path

  const connect = () => {
    if (streamingUrl && !stream.current) {
      console.log(`Attempting to connect to live match stream: ${path}`);
      stream.current = dispatch(connectLiveMatchStream(matchId, path));
    }
  };

  const disconnect = () => {
    if (stream.current) {
      console.log(`Disconnecting from live match stream: ${path}`);
      stream.current(); // Call the disconnect function
      stream.current = null;
    }
  };

  useEffect(() => {
    connect();
    return disconnect; // Ensure disconnect is called when the component unmounts
  }, [dispatch, matchId, accessToken, streamingUrl]);

  return {
    disconnect,
  };
};

export default useLiveMatchStream;
