import checkIcon from "@tabler/icons/outline/check.svg";
import clsx from "clsx";
import { defineMessages, useIntl, FormatDateOptions } from "react-intl";

import Markup from "src/components/Markup";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import { htmlToPlaintext } from "src/utils/html";

import type { Account } from "src/schemas/index";

const getTicker = (value: string): string =>
  (value.match(/\$([a-zA-Z]*)/i) || [])[1];

const messages = defineMessages({
  linkVerifiedOn: {
    id: "account.link_verified_on",
    defaultMessage: "Ownership of this link was checked on {date}",
  },
});

const dateFormatOptions: FormatDateOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "2-digit",
};

interface IProfileField {
  field: Account["fields"][number];
}

/** Renders a single profile field. */
const ProfileField: React.FC<IProfileField> = ({ field }) => {
  const intl = useIntl();
  const valuePlain = htmlToPlaintext(field.value);

  return (
    <HStack className="ring-1 ring-primary-500 rounded-5px ring-opacity-50 px-2">
      <dl>
        <dt className="font-bold text-primary-500" title={field.name}>
          {field.name}
        </dt>

        <dd
          className={clsx({ "text-success-500": field.verified_at })}
          title={valuePlain}
        >
          <HStack space={2} alignItems="center">
            {field.verified_at && (
              <span
                className="flex-none"
                title={intl.formatMessage(messages.linkVerifiedOn, {
                  date: intl.formatDate(field.verified_at, dateFormatOptions),
                })}
              >
                <Icon src={checkIcon} />
              </span>
            )}

            <Markup
              className="overflow-hidden break-words"
              tag="span"
              html={{ __html: field.value }}
            />
          </HStack>
        </dd>
      </dl>
    </HStack>
  );
};

export default ProfileField;
