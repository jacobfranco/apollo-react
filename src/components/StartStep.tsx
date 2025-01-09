import confettiIcon from "@tabler/icons/outline/confetti.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { FormattedMessage } from "react-intl";

import Button from "src/components/Button";
import IconButton from "src/components/IconButton";
import Icon from "src/components/Icon";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import SiteLogo from "./SiteLogo";

const closeIcon = xIcon;

interface IStartModal {
  onClose?(): void;
  onNext: () => void;
}

const StartModal: React.FC<IStartModal> = ({ onClose, onNext }) => {
  return (
    <Stack
      space={4}
      justifyContent="center"
      alignItems="center"
      className="w-full rounded-3xl bg-gray-100 px-4 py-8 text-gray-900 shadow-lg black:bg-black dark:bg-secondary-700 dark:text-gray-100 dark:shadow-none sm:p-10"
    >
      <div className="relative w-full">
        <IconButton
          src={closeIcon}
          className="absolute -right-2 -top-6 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 sm:-right-4 rtl:rotate-180"
          onClick={onClose}
        />
        <Stack
          space={2}
          justifyContent="center"
          alignItems="center"
          className=""
        >
          <SiteLogo alt="Logo" className="h-10 w-auto cursor-pointer" />

          <Text align="center" weight="bold" className="text-xl sm:text-2xl">
            <FormattedMessage
              id="onboarding.start.title"
              defaultMessage="Let's set up your profile"
            />
          </Text>
          <Text theme="muted" align="center">
            <FormattedMessage
              id="onboarding.start.message"
              defaultMessage="You can change what you do here at any time."
            />
          </Text>
        </Stack>
      </div>

      <Stack justifyContent="center" alignItems="center" className="w-full">
        <div className="w-2/3" />

        <Stack justifyContent="center" space={2} className="w-2/3">
          <Button block theme="primary" onClick={onNext}>
            <FormattedMessage
              id="onboarding.start.continue"
              defaultMessage="Continue"
            />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StartModal;
