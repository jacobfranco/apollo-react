import { useActivity } from "src/hooks/useActivity";

export const ActivityTracker: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useActivity();
  return <>{children}</>;
};
