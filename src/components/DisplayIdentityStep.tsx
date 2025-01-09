import helpSquare from "@tabler/icons/outline/help-square-rounded.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import Button from "src/components/Button";
import FormGroup from "src/components/FormGroup";
import HStack from "src/components/HStack";
import IconButton from "src/components/IconButton";
import Popover from "src/components/Popover";
import Stack from "src/components/Stack";
import SvgIcon from "src/components/SvgIcon";
import Text from "src/components/Text";
import { UsernameInput } from "src/features/EditIdentity";
import { useApi } from "src/hooks/useApi";
import { queryClient } from "src/queries/client";
import toast from "src/toast";

const closeIcon = xIcon;

const messages = defineMessages({
  title: {
    id: "onboarding.display_identity.title",
    defaultMessage: "Choose an Identity",
  },
  subtitle: {
    id: "onboarding.display_identity.subtitle",
    defaultMessage: "You can always edit this later.",
  },
  label: {
    id: "onboarding.display_identity.label",
    defaultMessage: "Identity",
  },
  helpText: {
    id: "onboarding.display_identity.help_text",
    defaultMessage:
      "This identifier is a unique username that represents you on the platform. This username can be used to personalize your experience and facilitate communication within the community.",
  },
  placeholder: {
    id: "onboarding.display_identity.fields.reason_placeholder",
    defaultMessage: "Why do you want to be part of the {siteTitle} community?",
  },
  requested: {
    id: "onboarding.display_identity.request",
    defaultMessage: "Username requested",
  },
  error: {
    id: "onboarding.error",
    defaultMessage:
      "An unexpected error occurred. Please try again or skip this step.",
  },
  saving: { id: "onboarding.saving", defaultMessage: "Saving…" },
  next: { id: "onboarding.next", defaultMessage: "Next" },
  skip: { id: "onboarding.skip", defaultMessage: "Skip for now" },
});

interface IDisplayUserNameStep {
  onClose?(): void;
  onNext: () => void;
}

interface NameRequestData {
  name: string;
  reason?: string;
}

function useRequestName() {
  const api = useApi();

  return useMutation({
    mutationFn: (data: NameRequestData) =>
      api.post("/api/v1/ditto/names", data),
  });
}

const DisplayUserNameStep: React.FC<IDisplayUserNameStep> = ({
  onClose,
  onNext,
}) => {
  const intl = useIntl();
  const { mutate } = useRequestName();
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const trimmedValue = username.trim();
  const isValid = trimmedValue.length > 0;
  const isDisabled = !isValid || username.length > 30;

  const handleSubmit = () => {
    const name = `${username}`;

    setSubmitting(true);

    mutate(
      { name, reason },
      {
        onSuccess() {
          toast.success(intl.formatMessage(messages.requested));
          queryClient.invalidateQueries({
            queryKey: ["names", "pending"],
          });
          setSubmitting(false);
        },
        onError() {
          toast.error(intl.formatMessage(messages.error));
        },
      }
    );
  };

  return (
    <Stack
      space={2}
      justifyContent="center"
      alignItems="center"
      className="relative w-full rounded-3xl bg-white px-4 py-8 text-gray-900 shadow-lg black:bg-black dark:bg-primary-900 dark:text-gray-100 dark:shadow-none sm:p-10"
    >
      {/* <HeaderSteps onClose={onClose} title={intl.formatMessage(messages.title)} subtitle={intl.formatMessage(messages.subtitle)} /> */}
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
              id="onboarding.identity.title"
              defaultMessage="Select your username"
            />
          </Text>
          <Text theme="muted" align="center">
            <FormattedMessage
              id="onboarding.identity.subtitle"
              defaultMessage="This will be your unique identifier on Apollo."
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
        <div className="w-full sm:w-3/4">
          <FormGroup
            labelText={
              <HStack space={2}>
                <div>{intl.formatMessage(messages.label)}</div>
                <Popover
                  interaction="hover"
                  content={
                    <Text className="w-48 text-justify sm:w-72">
                      {intl.formatMessage(messages.helpText)}
                    </Text>
                  }
                >
                  <div>
                    <SvgIcon
                      size={20}
                      src={helpSquare}
                      className="hover:cursor-pointer"
                    />
                  </div>
                </Popover>
              </HStack>
            }
          >
            <Stack space={4}>
              <UsernameInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Stack>
          </FormGroup>
        </div>

        <Stack justifyContent="center" space={2} className="w-full sm:w-3/4">
          <Button
            block
            theme="primary"
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled || isSubmitting}
          >
            {isSubmitting
              ? intl.formatMessage(messages.saving)
              : intl.formatMessage(messages.next)}
          </Button>

          <Button block theme="tertiary" type="button" onClick={onNext}>
            {intl.formatMessage(messages.skip)}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DisplayUserNameStep;
