const ONBOARDING_START = 'ONBOARDING_START';
const ONBOARDING_END = 'ONBOARDING_END';

const ONBOARDING_LOCAL_STORAGE_KEY = 'apollo:onboarding';

type OnboardingStartAction = {
  type: typeof ONBOARDING_START;
}

type OnboardingEndAction = {
  type: typeof ONBOARDING_END;
}

export type OnboardingActions = OnboardingStartAction | OnboardingEndAction

const checkOnboardingStatus = () => (dispatch: React.Dispatch<OnboardingActions>) => {
  console.log("[checkOnboardingStatus] Checking onboarding status...");
  const needsOnboarding = localStorage.getItem(ONBOARDING_LOCAL_STORAGE_KEY) === '1';
  console.log(`[checkOnboardingStatus] needsOnboarding: ${needsOnboarding}`);
  
  if (needsOnboarding) {
    console.log("[checkOnboardingStatus] Dispatching ONBOARDING_START action");
    dispatch({ type: ONBOARDING_START });
  }
};

const startOnboarding = () => (dispatch: React.Dispatch<OnboardingActions>) => {
  console.log("[startOnboarding] Setting onboarding status to start");
  localStorage.setItem(ONBOARDING_LOCAL_STORAGE_KEY, '1');
  dispatch({ type: ONBOARDING_START });
  console.log("[startOnboarding] Dispatched ONBOARDING_START action");
};

const endOnboarding = () => (dispatch: React.Dispatch<OnboardingActions>) => {
  console.log("[endOnboarding] Ending onboarding and clearing status");
  localStorage.removeItem(ONBOARDING_LOCAL_STORAGE_KEY);
  dispatch({ type: ONBOARDING_END });
  console.log("[endOnboarding] Dispatched ONBOARDING_END action");
};

export {
  ONBOARDING_END,
  ONBOARDING_START,
  checkOnboardingStatus,
  endOnboarding,
  startOnboarding,
};