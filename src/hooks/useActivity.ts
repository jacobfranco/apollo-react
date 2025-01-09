import { useEffect } from "react";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { trackUserActivity } from "../actions/activity";

export const useActivity = () => {
  const dispatch = useAppDispatch();
  const { account } = useOwnAccount();

  useEffect(() => {
    if (!account?.id) return;

    // Check if we've already tracked today
    const lastTrackedDate = localStorage.getItem(`lastTracked_${account.id}`);
    const today = new Date().toISOString().split("T")[0];

    if (lastTrackedDate === today) {
      return; // Already tracked today
    }

    // Track first activity of the day
    dispatch(trackUserActivity(account.id));
    localStorage.setItem(`lastTracked_${account.id}`, today);
  }, [dispatch, account?.id]);
};
