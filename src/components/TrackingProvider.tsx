import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initializeMetaPixel, trackPageView } from "../utils/tracking";

interface TrackingProviderProps {
  children: React.ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({
  children,
}) => {
  const location = useLocation();

  // Initialize tracking on mount
  useEffect(() => {
    initializeMetaPixel();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return <>{children}</>;
};
