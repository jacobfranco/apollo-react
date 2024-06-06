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
  return async(dispatch, getState) => {
    console.log('Loading initial data...');
    // Await for authenticated fetch
    await dispatch(fetchMe());
    console.log('Fetched user data (me)');
    // Await for configuration
    await dispatch(loadApolloConfig());
    console.log('Fetched Apollo configuration');
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
  console.log('Initial state values:', initialStateValues);


  console.log('Current state values:', {
    me,
    account: account ? account : 'Account not loaded',
    isLoaded,
    localeLoading,
    swUpdating,
  });
  /** Whether to display a loading indicator. */
  const showLoading = [
    me === null,
    me && !account,
    !isLoaded,
    localeLoading,
    swUpdating,
  ].some(Boolean);

  console.log('Show loading screen:', showLoading);

  // Load the user's locale
  useEffect(() => {
    MESSAGES[locale]().then(messages => {
      setMessages(messages);
      setLocaleLoading(false);
      console.log('Locale messages loaded');
    }).catch(error => { 
      console.error('Error loading locale messages:', error);
    });
  }, [locale]);

   // Load initial data from the API
   useEffect(() => {
    dispatch(loadInitial()).then(() => {
      setIsLoaded(true);
      console.log('Initial data loading complete');
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