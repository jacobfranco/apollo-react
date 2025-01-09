import { ExponentialBackoff, Websocket, WebsocketBuilder } from "websocket-ts";

import { getAccessToken } from "src/utils/auth";
import * as BuildConfig from "src/build-config";

import type { AppDispatch, RootState } from "src/store";
import { urls } from "./utils/urls";

const randomIntUpTo = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));

interface ConnectStreamCallbacks {
  onConnect(): void;
  onDisconnect(): void;
  onReceive(websocket: Websocket, data: unknown): void;
}

type PollingRefreshFn = (dispatch: AppDispatch, done?: () => void) => void;

export function connectStream(
  path: string,
  pollingRefresh: PollingRefreshFn | null = null,
  callbacks: (
    dispatch: AppDispatch,
    getState: () => RootState
  ) => ConnectStreamCallbacks
) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const streamingAPIBaseURL = urls.STREAMING_URL;
    const accessToken = getAccessToken(getState());
    const { onConnect, onDisconnect, onReceive } = callbacks(
      dispatch,
      getState
    );

    let polling: NodeJS.Timeout | null = null;

    const setupPolling = () => {
      if (pollingRefresh) {
        pollingRefresh(dispatch, () => {
          polling = setTimeout(
            () => setupPolling(),
            20000 + randomIntUpTo(20000)
          );
        });
      }
    };

    const clearPolling = () => {
      if (polling) {
        clearTimeout(polling);
        polling = null;
      }
    };

    let subscription: Websocket;

    // If the WebSocket fails to be created, don't crash the whole page,
    // just proceed without a subscription.
    try {
      subscription = getStream(streamingAPIBaseURL!, accessToken!, path, {
        connected() {
          if (pollingRefresh) {
            clearPolling();
          }

          onConnect();
        },

        disconnected() {
          if (pollingRefresh) {
            polling = setTimeout(() => setupPolling(), randomIntUpTo(40000));
          }

          onDisconnect();
        },

        received(data) {
          onReceive(subscription, data);
        },

        reconnected() {
          if (pollingRefresh) {
            clearPolling();
            pollingRefresh(dispatch);
          }

          onConnect();
        },
      });
    } catch (e) {
      console.error(e);
    }

    const disconnect = () => {
      if (subscription) {
        subscription.close();
      }

      clearPolling();
    };

    return disconnect;
  };
}

export default function getStream(
  streamingAPIBaseURL: string,
  accessToken: string,
  stream: string,
  callbacks: {
    connected: ((ev: Event) => any) | null;
    received: (data: any) => void;
    disconnected: ((ev: Event) => any) | null;
    reconnected: (ev: Event) => any;
  }
) {
  const params = [`stream=${stream}`];
  const baseURL = streamingAPIBaseURL.endsWith("/")
    ? streamingAPIBaseURL.slice(0, -1)
    : streamingAPIBaseURL;

  const ws = new WebsocketBuilder(
    `${baseURL}/api/streaming/?${params.join("&")}`
  )
    .withProtocols(accessToken)
    .withBackoff(new ExponentialBackoff(1000, 6))
    .onOpen((_ws, ev) => {
      callbacks.connected?.(ev);
    })
    .onClose((_ws, ev) => {
      callbacks.disconnected?.(ev);
    })
    .onReconnect((_ws, ev) => {
      callbacks.reconnected(ev);
    })
    .onMessage((_ws, e) => {
      if (!e.data) return;
      try {
        callbacks.received(JSON.parse(e.data));
      } catch (error) {
        console.error(e);
        console.error(`Could not parse streaming event.\n${error}`);
      }
    })
    .build();

  return ws;
}
