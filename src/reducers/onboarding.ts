import { ONBOARDING_START, ONBOARDING_END } from 'src/actions/onboarding';

import type { OnboardingActions } from 'src/actions/onboarding';

type OnboardingState = {
  needsOnboarding: boolean;
}

const initialState: OnboardingState = {
  needsOnboarding: false,
};

export default function onboarding(state: OnboardingState = initialState, action: OnboardingActions): OnboardingState {
  switch (action.type) {
    case ONBOARDING_START:
      return { ...state, needsOnboarding: true };
    case ONBOARDING_END:
      return { ...state, needsOnboarding: false };
    default:
      return state;
  }
}