import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface IScrollContext {
  children: React.ReactNode;
}

export const ScrollContext: React.FC<IScrollContext> = ({ children }) => {
  const location = useLocation<{ apolloModalKey?: number } | undefined>();

  useEffect(() => {
    // HACK: Don't scroll when navigating between posts.
    // Surely there's a better way, so that components can negate the behavior from within instead of out here.
    if (location.pathname.includes("/posts/")) {
      return;
    }

    if (!location.state?.apolloModalKey) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return children;
};
