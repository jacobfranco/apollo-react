import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Provider } from 'react-redux';

import { StatProvider } from 'src/contexts/stat-context';
import { createGlobals } from 'src/globals';
import { queryClient } from 'src/queries/client';

import { checkOnboardingStatus } from 'src/actions/onboarding';
import { preload } from 'src/actions/preload';
import { store } from 'src/store';

import ApolloHead from './ApolloHead';
import ApolloLoad from './ApolloLoad';
import ApolloMount from './ApolloMount';

console.log('[Apollo] Component setup started.');

// Configure global functions for developers
createGlobals(store);

console.log('[Apollo] Global functions configured.');

// Preload happens synchronously TODO: Implement with backend
// console.log('[Apollo] Dispatching preload...');
// store.dispatch(preload() as any);

// This happens synchronously
console.log('[Apollo] Checking onboarding status...');
store.dispatch(checkOnboardingStatus() as any);

/** The root React node of the application. */
const Apollo: React.FC = () => {
  console.log('[Apollo] Component rendering...');
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StatProvider>
          <ApolloHead>
            <ApolloLoad>
              <ApolloMount />
            </ApolloLoad>
          </ApolloHead>
        </StatProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Apollo;