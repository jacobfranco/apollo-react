import clsx from "clsx";
import { useIntl, defineMessages } from "react-intl";

import verifiedIcon from "@tabler/icons/filled/rosette-discount-check.svg";

import SvgIcon from "./SvgIcon";

const messages = defineMessages({
  verified: { id: "account.verified", defaultMessage: "Verified Account" },
});

interface IVerificationBadge {
  className?: string;
}

const VerificationBadge: React.FC<IVerificationBadge> = ({ className }) => {
  const intl = useIntl();

  const icon = verifiedIcon;

  return (
    <span data-testid="verified-badge">
      <SvgIcon
        className={clsx("w-5 text-primary-500", className)}
        src={icon}
        alt={intl.formatMessage(messages.verified)}
      />
    </span>
  );
};

export default VerificationBadge;
