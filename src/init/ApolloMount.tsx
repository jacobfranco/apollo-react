import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';
// @ts-ignore: it doesn't have types
import { ScrollContext } from 'react-router-scroll-4';

import * as BuildConfig from 'src/build-config';
import LoadingScreen from 'src/components/LoadingScreen';
import SiteErrorBoundary from 'src/components/SiteErrorBoundary';
import {
  ModalContainer,
  OnboardingWizard,
} from 'src/features/AsyncComponents';
import {
  useAppSelector,
  useLoggedIn,
  useOwnAccount,
  useApolloConfig,
} from 'src/hooks';
import { useCachedLocationHandler } from 'src/utils/redirect';

const GdprBanner = React.lazy(() => import('src/components/GdprBanner'));
const EmbeddedStatus = React.lazy(() => import('src/features/EmbeddedStatus'));
const UI = React.lazy(() => import('src/features/UI'));

/** Highest level node with the Redux store. */
const ApolloMount = () => {
  useCachedLocationHandler();

  const { isLoggedIn } = useLoggedIn();
  const { account } = useOwnAccount();
  const apolloConfig = useApolloConfig();

  const needsOnboarding = useAppSelector(state => state.onboarding.needsOnboarding);
  const showOnboarding = account && needsOnboarding;
  const { redirectRootNoLogin, gdpr } = apolloConfig;

  // @ts-ignore: I don't actually know what these should be, lol
  const shouldUpdateScroll = (prevRouterProps, { location }) => {
    return !(location.state?.apolloModalKey && location.state?.apolloModalKey !== prevRouterProps?.location?.state?.apolloModalKey);
  };

  return (
    <SiteErrorBoundary>
      <BrowserRouter basename={BuildConfig.FE_SUBDIRECTORY}>
        <CompatRouter>
          <ScrollContext shouldUpdateScroll={shouldUpdateScroll}>
            <Switch>
              {(!isLoggedIn && redirectRootNoLogin) && (
                <Redirect exact from='/' to={redirectRootNoLogin} />
              )}

              <Route
                path='/embed/:statusId'
                render={(props) => (
                  <Suspense>
                    <EmbeddedStatus params={props.match.params} />
                  </Suspense>
                )}
              />

              <Redirect from='/@:username/:statusId/embed' to='/embed/:statusId' />

              <Route>
                <Suspense fallback={<LoadingScreen />}>
                  {showOnboarding
                    ? <OnboardingWizard />
                    : <UI />
                  }
                </Suspense>

                <Suspense>
                  <ModalContainer />
                </Suspense>

                {(gdpr && !isLoggedIn) && (
                  <Suspense>
                    <GdprBanner />
                  </Suspense>
                )}

                <div id='toaster'>
                  <Toaster
                    position='top-right'
                    containerClassName='top-10'
                    containerStyle={{ top: 75 }}
                  />
                </div>
              </Route>
            </Switch>
          </ScrollContext>
        </CompatRouter>
      </BrowserRouter>
    </SiteErrorBoundary>
  );
};

export default ApolloMount;