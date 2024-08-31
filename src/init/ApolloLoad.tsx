import React, { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import { fetchMe } from 'src/actions/me';
import { loadApolloConfig } from 'src/actions/apollo';
import LoadingScreen from 'src/components/LoadingScreen';
import {
  useAppSelector,
  useAppDispatch,
  useOwnAccount,
  useLocale,
} from 'src/hooks';
import MESSAGES from 'src/messages';
import { Entities } from 'src/entity-store/entities';

/** Load initial data from the backend */
const loadInitial = () => {
  // @ts-ignore
  return async (dispatch, getState) => {

    // Await for authenticated fetch
    await dispatch(fetchMe());

    // Await for configuration
    await dispatch(loadApolloConfig());

  };
};

interface IApolloLoad {
  children: React.ReactNode;
}

/** Initial data loader. */
const ApolloLoad: React.FC<IApolloLoad> = ({ children }) => {
  const dispatch = useAppDispatch();

  const me = useAppSelector(state => state.me);
  const { account } = useOwnAccount();
  const swUpdating = useAppSelector(state => state.meta.swUpdating);
  const { locale } = useLocale();

  const [messages, setMessages] = useState<Record<string, string>>({});
  const [localeLoading, setLocaleLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Log the initial state values directly inside the component
  const initialStateValues = useAppSelector(state => ({
    entities: state.entities,
    relationships: state.relationships,
    accounts: state.entities[Entities.ACCOUNTS]?.store,
  }));


  /** Whether to display a loading indicator. */
  const showLoading = [
    me === null,
    me && !account,
    !isLoaded,
    localeLoading,
    swUpdating,
  ].some(Boolean);


  // Load the user's locale
  useEffect(() => {
    MESSAGES[locale]().then(messages => {
      setMessages(messages);
      setLocaleLoading(false);
    }).catch(error => {
      console.error('Error loading locale messages:', error);
    });
  }, [locale]);

  // Load initial data from the API
  useEffect(() => {
    dispatch(loadInitial()).then(() => {
      setIsLoaded(true);
    }).catch(error => {
      console.error('Error loading initial data:', error);
      setIsLoaded(true); // Consider handling this differently as it assumes loading is complete
    });
  }, [dispatch]);

  // intl is part of loading.
  // It's important nothing in here depends on intl.
  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default ApolloLoad;