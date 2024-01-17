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

const startOnboarding = () => (dispatch: React.Dispatch<OnboardingActions>) => {
    localStorage.setItem(ONBOARDING_LOCAL_STORAGE_KEY, '1');
    dispatch({ type: ONBOARDING_START });
  };

  export {
    ONBOARDING_END,
    ONBOARDING_START,
    startOnboarding,
  };