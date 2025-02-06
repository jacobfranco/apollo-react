// Define the fbq function type
type FbqFunction = {
  (action: string, event: string, params?: object): void;
  callMethod?: (...args: any[]) => void;
  queue?: any[];
  loaded?: boolean;
  version?: string;
  push?: (...args: any[]) => void;
};

declare global {
  interface Window {
    fbq: FbqFunction;
    _fbq: FbqFunction;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Meta Pixel
export const initializeMetaPixel = (): void => {
  const pixelId = "1074943017182590";

  // Initialize fbq if it doesn't exist
  if (!(window as any).fbq) {
    (window as any).fbq = function () {
      (window as any).fbq.callMethod
        ? (window as any).fbq.callMethod.apply((window as any).fbq, arguments)
        : (window as any).fbq.queue.push(arguments);
    };

    if (!(window as any)._fbq) {
      (window as any)._fbq = (window as any).fbq;
    }

    (window as any).fbq.push = (window as any).fbq;
    (window as any).fbq.loaded = true;
    (window as any).fbq.version = "2.0";
    (window as any).fbq.queue = [];
  }

  // Load the Meta Pixel script
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  // Initialize the pixel
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
};

// Track signup events
export const trackSignup = (): void => {
  // Meta Pixel signup tracking
  if (typeof window.fbq === "function") {
    window.fbq("track", "CompleteRegistration");
  }

  // Google tag signup tracking
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-16828222863/Q-9pCIfr9ZQaEI-bpdg-",
    });
  }
};

// Track page views for SPA
export const trackPageView = (path: string): void => {
  // Meta Pixel page view
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }

  // Google tag page view
  if (typeof window.gtag === "function") {
    window.gtag("config", "AW-16828222863", {
      page_path: path,
    });
  }
};
