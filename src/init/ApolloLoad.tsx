import React, { useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useLocale } from "src/hooks/useLocale";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { fetchMe } from "src/actions/me";
import { fetchApolloConfig } from "src/actions/apollo";
import LoadingScreen from "src/components/LoadingScreen";
import MESSAGES from "src/messages";

interface IApolloLoad {
  children: React.ReactNode;
}

const loadInitial = () => {
  return async (dispatch: any) => {
    console.log("loadInitial: Starting to fetch 'me' and Apollo config...");
    await dispatch(fetchMe());
    console.log("loadInitial: 'me' fetched. Now fetching Apollo config...");
    await dispatch(fetchApolloConfig());
    console.log("loadInitial: Apollo config fetched.");
  };
};

/** Initial data loader. */
const ApolloLoad: React.FC<IApolloLoad> = ({ children }) => {
  const dispatch = useAppDispatch();

  const me = useAppSelector((state) => state.me);
  const { account } = useOwnAccount();
  const swUpdating = useAppSelector((state) => state.meta.swUpdating);
  const { locale } = useLocale();

  const [messages, setMessages] = useState<Record<string, string>>({});
  const [localeLoading, setLocaleLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Log state whenever it changes
  console.log("ApolloLoad render:", {
    me,
    account,
    isLoaded,
    localeLoading,
    swUpdating,
    locale,
  });

  // Determine if we should show loading
  const showLoading = [
    me === null,
    me && !account,
    !isLoaded,
    localeLoading,
    swUpdating,
  ].some(Boolean);

  console.log("showLoading:", showLoading);

  // Load locale messages
  useEffect(() => {
    console.log("useEffect [locale]: Loading locale messages for:", locale);
    MESSAGES[locale]()
      .then((loadedMessages) => {
        console.log("useEffect [locale]: Successfully loaded messages");
        setMessages(loadedMessages);
        setLocaleLoading(false);
      })
      .catch((error) => {
        console.error(
          "useEffect [locale]: Error loading locale messages:",
          error
        );
      });
  }, [locale]);

  // Load initial data from the API
  useEffect(() => {
    console.log("useEffect [initial load]: Dispatching initial data load");
    dispatch(loadInitial())
      .then(() => {
        console.log("useEffect [initial load]: Initial data load complete");
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(
          "useEffect [initial load]: Initial data load failed:",
          error
        );
        setIsLoaded(true);
      });
  }, [dispatch]);

  if (showLoading) {
    console.log("ApolloLoad: Still loading, rendering <LoadingScreen />");
    return <LoadingScreen />;
  }

  console.log("ApolloLoad: Data loaded, rendering children");
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default ApolloLoad;
