import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { openModal } from "src/actions/modals";
import LoadingScreen from "src/components/LoadingScreen";
import { ScrollContext } from "src/components/ScrollContext";
import SiteErrorBoundary from "src/components/SiteErrorBoundary";
import { ModalContainer } from "src/features/AsyncComponents";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useLoggedIn } from "src/hooks/useLoggedIn";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { useApolloConfig } from "src/hooks/useApolloConfig";
import { useCachedLocationHandler } from "src/utils/redirect";

const GdprBanner = lazy(() => import("src/components/GdprBanner"));
const EmbeddedStatus = lazy(() => import("src/features/EmbeddedStatus"));
const UI = lazy(() => import("src/features/UI"));

/** Highest level node with the Redux store. */
const ApolloMount = () => {
  useCachedLocationHandler();

  const { isLoggedIn } = useLoggedIn();
  const { account } = useOwnAccount();
  const dispatch = useAppDispatch();

  const apolloConfig = useApolloConfig();

  const needsOnboarding = useAppSelector(
    (state) => state.onboarding.needsOnboarding
  );
  const showOnboarding = account && needsOnboarding;

  if (showOnboarding) {
    dispatch(openModal("ONBOARDING_FLOW"));
  }

  const { redirectRootNoLogin, gdpr } = apolloConfig;

  return (
    <SiteErrorBoundary>
      <BrowserRouter>
        <CompatRouter>
          <ScrollContext>
            <Switch>
              {!isLoggedIn && redirectRootNoLogin && (
                <Redirect exact from="/" to={redirectRootNoLogin} />
              )}

              <Route
                path="/embed/:statusId"
                render={(props) => (
                  <Suspense>
                    <EmbeddedStatus params={props.match.params} />
                  </Suspense>
                )}
              />

              <Redirect
                from="/@:username/:statusId/embed"
                to="/embed/:statusId"
              />

              <Route>
                <Suspense fallback={<LoadingScreen />}>
                  <UI />
                </Suspense>

                <Suspense>
                  <ModalContainer />
                </Suspense>

                {gdpr && !isLoggedIn && (
                  <Suspense>
                    <GdprBanner />
                  </Suspense>
                )}

                <div id="toaster">
                  <Toaster
                    position="top-right"
                    containerClassName="top-10"
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
