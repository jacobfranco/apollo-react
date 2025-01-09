import clsx from "clsx";
import { useEffect, useState } from "react";
import ReactSwipeableViews from "react-swipeable-views";

import { endOnboarding } from "src/actions/onboarding";
import HStack from "src/components/HStack";
import Modal from "src/components/Modal";
import Stack from "src/components/Stack";
import AvatarSelectionModal from "src/components/AvatarStep";
import BioStep from "src/components/BioStep";
import CompletedModal from "src/components/CompletedStep";
import CoverPhotoSelectionModal from "src/components/CoverPhotoSelectionStep";
import DisplayNameStep from "src/components/DisplayNameStep";
import StartModal from "src/components/StartStep";
import SuggestedAccountsModal from "src/components/SuggestedAccountsStep";
import { useAppDispatch } from "src/hooks/useAppDispatch";

interface IOnboardingFlowModal {
  onClose(): void;
}

const OnboardingFlowModal: React.FC<IOnboardingFlowModal> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleSwipe = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleDotClick = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleComplete = () => {
    dispatch(endOnboarding());
    onClose();
  };

  const steps = [
    <StartModal onClose={handleComplete} onNext={handleNextStep} />,
    <AvatarSelectionModal onClose={handleComplete} onNext={handleNextStep} />,
    <DisplayNameStep onClose={handleComplete} onNext={handleNextStep} />,
    <BioStep onClose={handleComplete} onNext={handleNextStep} />,
    <CoverPhotoSelectionModal
      onClose={handleComplete}
      onNext={handleNextStep}
    />,
    <SuggestedAccountsModal onClose={handleComplete} onNext={handleNextStep} />,
  ];

  steps.push(
    <CompletedModal onComplete={handleComplete} onClose={handleComplete} />
  );

  const handleKeyUp = ({ key }: KeyboardEvent): void => {
    switch (key) {
      case "ArrowLeft":
        handlePreviousStep();
        break;
      case "ArrowRight":
        handleNextStep();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Stack
      space={4}
      justifyContent="center"
      alignItems="center"
      className="relative w-full"
    >
      <Modal width="2xl" onClose={handleComplete} theme="transparent">
        <Stack space={4}>
          <ReactSwipeableViews
            animateHeight
            index={currentStep}
            onChangeIndex={handleSwipe}
          >
            {steps.map((step, i) => (
              <div key={i} className="w-full">
                <div
                  className={clsx({
                    "transition-opacity ease-linear": true,
                    "opacity-0 duration-500": currentStep !== i,
                    "opacity-100 duration-75": currentStep === i,
                  })}
                >
                  {step}
                </div>
              </div>
            ))}
          </ReactSwipeableViews>
        </Stack>
        <div className="relative flex w-full justify-center">
          <HStack
            space={3}
            alignItems="center"
            justifyContent="center"
            className="absolute h-10"
          >
            {steps.map((_, i) => (
              <button
                key={i}
                tabIndex={0}
                onClick={() => handleDotClick(i)}
                className={clsx({
                  "w-5 h-5 rounded-full focus:ring-primary-600 focus:ring-2 focus:ring-offset-2":
                    true,
                  "bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-700/75 hover:bg-gray-400":
                    i !== currentStep,
                  "bg-primary-600": i === currentStep,
                })}
              />
            ))}
          </HStack>
        </div>
      </Modal>
    </Stack>
  );
};

export default OnboardingFlowModal;
