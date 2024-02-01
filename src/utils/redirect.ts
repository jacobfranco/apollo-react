import { useEffect } from 'react';

const LOCAL_STORAGE_REDIRECT_KEY = 'apollo:redirect-uri';

const useCachedLocationHandler = () => {
    const removeCachedRedirectUri = () => localStorage.removeItem(LOCAL_STORAGE_REDIRECT_KEY);
  
    useEffect(() => {
      window.addEventListener('beforeunload', removeCachedRedirectUri);
  
      return () => {
        window.removeEventListener('beforeunload', removeCachedRedirectUri);
      };
    }, []);
  
    return null;
  };

  export {
    useCachedLocationHandler
  }