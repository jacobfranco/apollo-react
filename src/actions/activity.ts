export const TRACK_USER_ACTIVITY = "TRACK_USER_ACTIVITY";

export const trackUserActivity = (userId: string) => {
  const timestamp = new Date().toISOString();

  return async (dispatch: any) => {
    try {
      await fetch("/api/admin/track-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timestamp }),
      });

      dispatch({
        type: TRACK_USER_ACTIVITY,
        payload: { userId, timestamp },
      });
    } catch (error) {
      console.error("Failed to track activity:", error);
    }
  };
};
