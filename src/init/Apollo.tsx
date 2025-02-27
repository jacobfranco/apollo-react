import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Provider } from "react-redux";

import { StatProvider } from "src/contexts/stat-context";
import { queryClient } from "src/queries/client";

import { checkOnboardingStatus } from "src/actions/onboarding";
import { preload } from "src/actions/preload";
import { store } from "src/store";

import ApolloHead from "./ApolloHead";
import ApolloLoad from "./ApolloLoad";
import ApolloMount from "./ApolloMount";
import { ActivityTracker } from "./ActivityTracker";

// Preload happens synchronously
// store.dispatch(preload() as any);

// This happens synchronously
store.dispatch(checkOnboardingStatus() as any);

/** The root React node of the application. */
const Apollo: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ActivityTracker>
          <StatProvider>
            <ApolloHead>
              <ApolloLoad>
                <ApolloMount />
              </ApolloLoad>
            </ApolloHead>
          </StatProvider>
        </ActivityTracker>
      </QueryClientProvider>
    </Provider>
  );
};

export default Apollo;
