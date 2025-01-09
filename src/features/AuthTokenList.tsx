import alertTriangleIcon from "@tabler/icons/outline/alert-triangle.svg";
import { useEffect } from "react";
import { defineMessages, FormattedDate, useIntl } from "react-intl";

import { openModal } from "src/actions/modals";
import { fetchOAuthTokens, revokeOAuthTokenById } from "src/actions/security";
import Button from "src/components/Button";
import { Card, CardBody, CardHeader, CardTitle } from "src/components/Card";
import { Column } from "src/components/Column";
import HStack from "src/components/HStack";
import Spinner from "src/components/Spinner";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Token } from "src/reducers/security";

const messages = defineMessages({
  header: { id: "security.headers.tokens", defaultMessage: "Sessions" },
  revoke: { id: "security.tokens.revoke", defaultMessage: "Revoke" },
  revokeSessionHeading: {
    id: "confirmations.revoke_session.heading",
    defaultMessage: "Revoke current session",
  },
  revokeSessionMessage: {
    id: "confirmations.revoke_session.message",
    defaultMessage:
      "You are about to revoke your current session. You will be signed out.",
  },
  revokeSessionConfirm: {
    id: "confirmations.revoke_session.confirm",
    defaultMessage: "Revoke",
  },
});

interface IAuthToken {
  token: Token;
  isCurrent: boolean;
}

const AuthToken: React.FC<IAuthToken> = ({ token, isCurrent }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const handleRevoke = () => {
    if (isCurrent)
      dispatch(
        openModal("CONFIRM", {
          icon: alertTriangleIcon,
          heading: intl.formatMessage(messages.revokeSessionHeading),
          message: intl.formatMessage(messages.revokeSessionMessage),
          confirm: intl.formatMessage(messages.revokeSessionConfirm),
          onConfirm: () => {
            dispatch(revokeOAuthTokenById(token.id));
          },
        })
      );
    else {
      dispatch(revokeOAuthTokenById(token.id));
    }
  };

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-primary-800">
      <Stack space={2}>
        <Stack>
          <Text size="md" weight="medium">
            {token.app_name}
          </Text>
          {token.valid_until && (
            <Text size="sm" theme="muted">
              <FormattedDate
                value={token.valid_until}
                hour12
                year="numeric"
                month="short"
                day="2-digit"
                hour="numeric"
                minute="2-digit"
              />
            </Text>
          )}
        </Stack>
        <HStack justifyContent="end">
          <Button
            theme={isCurrent ? "danger" : "primary"}
            onClick={handleRevoke}
          >
            {intl.formatMessage(messages.revoke)}
          </Button>
        </HStack>
      </Stack>
    </div>
  );
};

const AuthTokenList: React.FC = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const tokens = useAppSelector((state) =>
    state.security.get("tokens").reverse()
  );

  const currentTokenId = useAppSelector((state) => {
    const currentToken = Object.values(state.auth.tokens).find(
      (token) => token.me === state.auth.me
    );
    return currentToken?.id;
  });

  useEffect(() => {
    dispatch(fetchOAuthTokens());
  }, []);

  const body = tokens ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {tokens.map((token) => (
        <AuthToken
          key={token.id}
          token={token}
          isCurrent={token.id.toString() === currentTokenId}
        />
      ))}
    </div>
  ) : (
    <Spinner />
  );

  return (
    <Column
      label={intl.formatMessage(messages.header)}
      transparent
      withHeader={false}
    >
      <Card variant="rounded">
        <CardHeader backHref="/settings">
          <CardTitle title={intl.formatMessage(messages.header)} />
        </CardHeader>

        <CardBody>{body}</CardBody>
      </Card>
    </Column>
  );
};

export default AuthTokenList;
