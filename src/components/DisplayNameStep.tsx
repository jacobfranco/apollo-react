import xIcon from "@tabler/icons/outline/x.svg";
import { useMemo, useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import { patchMe } from "src/actions/me";
import { HTTPError } from "src/api/HTTPError";
import Button from "src/components/Button";
import FormGroup from "src/components/FormGroup";
import IconButton from "src/components/IconButton";
import Input from "src/components/Input";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import toast from "src/toast";

const closeIcon = xIcon;

const messages = defineMessages({
  usernamePlaceholder: {
    id: "onboarding.display_name.placeholder",
    defaultMessage: "Eg. John Smith",
  },
  error: {
    id: "onboarding.error",
    defaultMessage:
      "An unexpected error occurred. Please try again or skip this step.",
  },
});

interface IDisplayNameStep {
  onClose?(): void;
  onNext: () => void;
}

const DisplayNameStep: React.FC<IDisplayNameStep> = ({ onClose, onNext }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const { account } = useOwnAccount();
  const [value, setValue] = useState<string>(account?.display_name || "");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const trimmedValue = value.trim();
  const isValid = trimmedValue.length > 0;
  const isDisabled = !isValid || value.length > 30;

  const hintText = useMemo(() => {
    const charsLeft = 30 - value.length;
    const suffix =
      charsLeft === 1 ? "character remaining" : "characters remaining";

    return `${charsLeft} ${suffix}`;
  }, [value]);

  const handleSubmit = () => {
    setSubmitting(true);

    const credentials = dispatch(patchMe({ display_name: value }));

    Promise.all([credentials])
      .then(() => {
        setSubmitting(false);
        onNext();
      })
      .catch(async (error) => {
        setSubmitting(false);

        if (error instanceof HTTPError && error.response?.status === 422) {
          const data = await error.response.error();
          if (data) {
            setErrors([data.error]);
          }
        } else {
          toast.error(messages.error);
        }
      });
  };

  return (
    <Stack
      space={2}
      justifyContent="center"
      alignItems="center"
      className="relative w-full rounded-3xl bg-gray-100 px-4 py-8 text-gray-900 shadow-lg black:bg-black dark:bg-secondary-700 dark:text-gray-100 dark:shadow-none sm:p-10"
    >
      <div className="relative w-full">
        <IconButton
          src={closeIcon}
          onClick={onClose}
          className="absolute -right-2 -top-6 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 rtl:rotate-180"
        />
        <Stack
          space={2}
          justifyContent="center"
          alignItems="center"
          className="-mx-4 mb-4 border-b border-solid pb-4 dark:border-gray-800 sm:-mx-10 sm:pb-10"
        >
          <Text size="2xl" align="center" weight="bold">
            <FormattedMessage
              id="onboarding.display_name.title"
              defaultMessage="Choose a display name"
            />
          </Text>
          <Text theme="muted" align="center">
            <FormattedMessage
              id="onboarding.display_name.subtitle"
              defaultMessage="What do you want to be called?"
            />
          </Text>
        </Stack>
      </div>

      <Stack
        space={5}
        justifyContent="center"
        alignItems="center"
        className="w-full"
      >
        <div className="w-full sm:w-2/3">
          <FormGroup
            hintText={hintText}
            labelText={
              <FormattedMessage
                id="onboarding.display_name.label"
                defaultMessage="Display name"
              />
            }
            errors={errors}
          >
            <Input
              className={"bg-transparent dark:bg-transparent"}
              onChange={(event) => setValue(event.target.value)}
              placeholder={intl.formatMessage(messages.usernamePlaceholder)}
              type="text"
              value={value}
              maxLength={30}
            />
          </FormGroup>
        </div>

        <Stack justifyContent="center" space={2} className="w-full sm:w-2/3">
          <Button
            block
            theme="primary"
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled || isSubmitting}
          >
            {isSubmitting ? (
              <FormattedMessage
                id="onboarding.saving"
                defaultMessage="Saving…"
              />
            ) : (
              <FormattedMessage id="onboarding.next" defaultMessage="Next" />
            )}
          </Button>

          <Button block theme="tertiary" type="button" onClick={onNext}>
            <FormattedMessage
              id="onboarding.skip"
              defaultMessage="Skip for now"
            />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DisplayNameStep;
