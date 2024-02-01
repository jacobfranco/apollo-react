/** Register the ServiceWorker. */
function registerSW(path: string) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(path, { scope: '/' });
    }
  }
  
  /** Prevent a new ServiceWorker from being installed. */
  function lockSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register = () => {
        throw new Error('ServiceWorker already registered.');
      };
    }
  }

  export {
    registerSW,
    lockSW
  }