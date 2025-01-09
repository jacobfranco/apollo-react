import { Map as ImmutableMap } from "immutable";
import { useState, useEffect } from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";

import { fetchCaptcha } from "src/actions/auth";
import Input from "src/components/Input";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";

const noOp = () => {};

const messages = defineMessages({
  captcha: { id: "registration.captcha", defaultMessage: "Captcha" },
  placeholder: {
    id: "registration.captcha.placeholder",
    defaultMessage: "Enter the pictured text",
  },
});

interface ICaptchaField {
  name?: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFetch?: (captcha: ImmutableMap<string, any>) => void;
  onFetchFail?: (error: Error) => void;
  onClick?: React.MouseEventHandler;
  refreshInterval?: number;
  idempotencyKey: string;
}

const CaptchaField: React.FC<ICaptchaField> = ({
  name,
  value,
  onChange = noOp,
  onFetch = noOp,
  onFetchFail = noOp,
  onClick = noOp,
  refreshInterval = 5 * 60 * 1000, // 5 minutes, Pleroma default
  idempotencyKey,
}) => {
  const dispatch = useAppDispatch();

  const [captcha, setCaptcha] = useState(ImmutableMap<string, any>());
  const [refresh, setRefresh] = useState<NodeJS.Timeout | undefined>(undefined);

  const getCaptcha = () => {
    dispatch(fetchCaptcha())
      .then((response) => response.json())
      .then((data) => {
        const captcha = ImmutableMap<string, any>(data);
        setCaptcha(captcha);
        onFetch(captcha);
      })
      .catch((error: Error) => {
        onFetchFail(error);
      });
  };

  const startRefresh = () => {
    if (refreshInterval) {
      const newRefresh = setInterval(getCaptcha, refreshInterval);
      setRefresh(newRefresh);
    }
  };

  const endRefresh = () => {
    if (refresh) {
      clearInterval(refresh);
    }
  };

  useEffect(() => {
    getCaptcha();
    endRefresh();
    startRefresh(); // Refresh periodically

    return () => {
      endRefresh();
    };
  }, [idempotencyKey]);

  switch (captcha.get("type")) {
    case "native":
      return (
        <div>
          <Text>
            <FormattedMessage
              id="registration.captcha.hint"
              defaultMessage="Click the image to get a new captcha"
            />
          </Text>

          <NativeCaptchaField
            captcha={captcha}
            onChange={onChange}
            onClick={onClick}
            name={name}
            value={value}
          />
        </div>
      );
    case "none":
    default:
      return null;
  }
};

interface INativeCaptchaField {
  captcha: ImmutableMap<string, any>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onClick: React.MouseEventHandler;
  name?: string;
  value: string;
}

const NativeCaptchaField: React.FC<INativeCaptchaField> = ({
  captcha,
  onChange,
  onClick,
  name,
  value,
}) => {
  const intl = useIntl();

  return (
    <Stack space={2}>
      <div className="flex w-full items-center justify-center rounded-md border border-solid border-gray-300 bg-white dark:border-gray-600">
        <button
          className="!block space-x-2 !border-none !p-0 !py-2 !text-primary-600 hover:!underline  focus:!ring-transparent focus:!ring-offset-0 dark:!text-accent-blue rtl:space-x-reverse"
          onClick={onClick}
        >
          <img
            alt={intl.formatMessage(messages.captcha)}
            src={captcha.get("url")}
          />
        </button>
      </div>

      <Input
        type="text"
        placeholder={intl.formatMessage(messages.placeholder)}
        name={name}
        value={value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onChange={onChange}
        required
      />
    </Stack>
  );
};

export { CaptchaField as default, NativeCaptchaField };
