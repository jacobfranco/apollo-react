import plusIcon from "@tabler/icons/outline/plus.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import clsx from "clsx";
import { useRef, useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import { patchMe } from "src/actions/me";
import { HTTPError } from "src/api/HTTPError";
import StillImage from "src/components/StillImage";
import Avatar from "src/components/Avatar";
import Button from "src/components/Button";
import IconButton from "src/components/IconButton";
import Icon from "src/components/Icon";
import Spinner from "src/components/Spinner";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import toast from "src/toast";
import { isDefaultHeader } from "src/utils/accounts";
import resizeImage from "src/utils/resize-image";

const closeIcon = xIcon;

const messages = defineMessages({
  header: { id: "account.header.alt", defaultMessage: "Profile header" },
  error: {
    id: "onboarding.error",
    defaultMessage:
      "An unexpected error occurred. Please try again or skip this step.",
  },
});

interface ICoverPhotoSelectionModal {
  onClose?(): void;
  onNext: () => void;
}

const CoverPhotoSelectionModal: React.FC<ICoverPhotoSelectionModal> = ({
  onClose,
  onNext,
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { account } = useOwnAccount();

  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const isDefault = account ? isDefaultHeader(account.avatar) : false;

  const openFilePicker = () => {
    fileInput.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxPixels = 1920 * 1080;
    const rawFile = event.target.files?.item(0);

    if (!rawFile) return;

    resizeImage(rawFile, maxPixels)
      .then((file) => {
        const url = file
          ? URL.createObjectURL(file)
          : (account?.header as string);

        setSelectedFile(url);
        setSubmitting(true);

        const formData = new FormData();
        formData.append("header", file);
        const credentials = dispatch(patchMe(formData));

        Promise.all([credentials])
          .then(() => {
            setDisabled(false);
            setSubmitting(false);
            onNext();
          })
          .catch(async (error) => {
            setSubmitting(false);
            setDisabled(false);
            setSelectedFile(null);

            if (error instanceof HTTPError && error.response?.status === 422) {
              const data = await error.response.error();
              if (data) {
                toast.error(data.error);
              } else {
                toast.error(messages.error);
              }
            } else {
              toast.error(messages.error);
            }
          });
      })
      .catch(console.error);
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
              id="onboarding.header.title"
              defaultMessage="Pick a cover image"
            />
          </Text>
          <Text theme="muted" align="center">
            <FormattedMessage
              id="onboarding.header.subtitle"
              defaultMessage="This will be shown at the top of your profile."
            />
          </Text>
        </Stack>
      </div>

      <Stack
        space={2}
        justifyContent="center"
        alignItems="center"
        className="w-full"
      >
        <div className="w-full rounded-lg border border-solid border-gray-200 dark:border-gray-800 sm:w-2/3">
          <div
            role="button"
            className="relative flex h-24 w-full items-center justify-center rounded-t-md bg-gray-200 dark:bg-gray-800"
          >
            <div className="flex h-24 w-full overflow-hidden rounded-t-md">
              {selectedFile ||
                (account?.header && (
                  <StillImage
                    src={selectedFile || account.header}
                    alt={intl.formatMessage(messages.header)}
                    className="absolute inset-0 w-full rounded-t-md object-cover"
                  />
                ))}
            </div>

            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center rounded-t-md bg-white/80 dark:bg-secondary-700/80">
                <Spinner />
              </div>
            )}

            <button
              onClick={openFilePicker}
              type="button"
              className={clsx({
                "absolute -top-3 -right-3 p-1 bg-primary-600 rounded-5px ring-2 ring-white dark:ring-primary-900 hover:bg-primary-700":
                  true,
                "opacity-50 pointer-events-none": isSubmitting,
              })}
              disabled={isSubmitting}
            >
              <Icon src={plusIcon} className="size-5 text-white" />
            </button>

            <input
              type="file"
              className="hidden"
              ref={fileInput}
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col px-4 pb-4">
            {account && (
              <Avatar
                src={account.avatar}
                size={64}
                className="-mt-8 mb-2 ring-2 ring-white dark:ring-primary-800"
              />
            )}

            <Text weight="bold" size="sm">
              {account?.display_name}
            </Text>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            <Text theme="muted" size="sm">
              @{account?.username}
            </Text>
          </div>
        </div>

        <Stack justifyContent="center" space={2} className="w-full sm:w-2/3">
          <Button
            block
            theme="primary"
            type="button"
            onClick={onNext}
            disabled={(isDefault && isDisabled) || isSubmitting}
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

export default CoverPhotoSelectionModal;
