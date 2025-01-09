import quoteIcon from "@tabler/icons/outline/quote.svg";
import { useCallback } from "react";

import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Text from "src/components/Text";
import { useAppSelector } from "src/hooks/useAppSelector";
import { makeGetStatus } from "src/selectors";

interface IQuotedStatusIndicator {
  /** The quoted status id. */
  statusId: string;
}

const QuotedStatusIndicator: React.FC<IQuotedStatusIndicator> = ({
  statusId,
}) => {
  const getStatus = useCallback(makeGetStatus(), []);

  const status = useAppSelector((state) => getStatus(state, { id: statusId }));

  if (!status) return null;

  return (
    <HStack alignItems="center" space={1}>
      <Icon className="size-5" src={quoteIcon} aria-hidden />
      <Text truncate>{status.url}</Text>
    </HStack>
  );
};

export default QuotedStatusIndicator;
