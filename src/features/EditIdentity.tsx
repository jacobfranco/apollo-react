import atIcon from "@tabler/icons/outline/at.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import { patchMe } from "src/actions/me";
import { changeSetting } from "src/actions/settings";
import List, { ListItem } from "src/components/List";
import Button from "src/components/Button";
import { CardHeader, CardTitle } from "src/components/Card";
import { Column } from "src/components/Column";
import Emoji from "src/components/Emoji";
import Form from "src/components/Form";
import HStack from "src/components/HStack";
import Icon from "src/components/Icon";
import Input from "src/components/Input";
import Textarea from "src/components/Textarea";
import Tooltip from "src/components/Tooltip";
import { useApi } from "src/hooks/useApi";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import { useSettings } from "src/hooks/useSettings";
import { queryClient } from "src/queries/client";
import { adminAccountSchema } from "src/schemas/admin-account";
import toast from "src/toast";

interface IEditIdentity {}

const messages = defineMessages({
  title: { id: "settings.edit_identity", defaultMessage: "Identity" },
  username: {
    id: "edit_profile.fields.nip05_label",
    defaultMessage: "Username",
  },
  unverified: {
    id: "edit_profile.fields.nip05_unverified",
    defaultMessage: "Name could not be verified and won't be used.",
  },
  success: {
    id: "edit_profile.success",
    defaultMessage: "Your profile has been successfully saved!",
  },
  error: { id: "edit_profile.error", defaultMessage: "Profile update failed" },
  placeholder: {
    id: "edit_identity.reason_placeholder",
    defaultMessage: "Why do you want to be part of the {siteTitle} community?",
  },
  requested: {
    id: "edit_identity.requested",
    defaultMessage: "Name requested",
  },
});

/** EditIdentity component. */
const EditIdentity: React.FC<IEditIdentity> = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { account } = useOwnAccount();
  const { mutate, isPending } = useRequestName();

  const { data: approvedNames } = useNames();
  const { data: pendingNames } = usePendingNames();
  const { dismissedSettingsNotifications } = useSettings();

  const [username, setUsername] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    const dismissed = new Set(dismissedSettingsNotifications);

    if (!dismissed.has("needsNip05")) {
      dismissed.add("needsNip05");
      dispatch(
        changeSetting(["dismissedSettingsNotifications"], [...dismissed])
      );
    }
  }, []);

  if (!account) return null;

  const updateName = async (name: string): Promise<void> => {
    try {
      await dispatch(patchMe({ nip05: name }));
      toast.success(intl.formatMessage(messages.success));
    } catch (e) {
      toast.error(intl.formatMessage(messages.error));
    }
  };

  const submit = () => {
    const name = `${username}`;

    mutate(
      { name, reason },
      {
        onSuccess() {
          toast.success(intl.formatMessage(messages.requested));
          queryClient.invalidateQueries({
            queryKey: ["names", "pending"],
          });
          setUsername("");
          setReason("");
        },
      }
    );
  };

  return (
    <Column label={intl.formatMessage(messages.title)}>
      <div className="space-y-4">
        <Form>
          <UsernameInput
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
          />
          <Textarea
            name="reason"
            placeholder={intl.formatMessage(messages.placeholder, {
              siteTitle: "Apollo",
            })}
            maxLength={500}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            value={reason}
            autoGrow
            required
          />
          <Button theme="accent" onClick={submit} disabled={isPending}>
            <FormattedMessage
              id="edit_identity.request"
              defaultMessage="Request"
            />
          </Button>
        </Form>
        {(approvedNames?.length ?? 0) > 0 && (
          <>
            <CardHeader>
              <CardTitle
                title={
                  <FormattedMessage
                    id="edit_identity.names_title"
                    defaultMessage="Names"
                  />
                }
              />
            </CardHeader>
            <List>
              {approvedNames?.map(({ username }) => {
                if (!username) return null;
                return (
                  <ListItem
                    key={username}
                    label={
                      <HStack alignItems="center" space={2}>
                        <span>{username}</span>
                      </HStack>
                    }
                    isSelected={account.username === username}
                    onSelect={() => updateName(username)}
                  />
                );
              })}
            </List>
          </>
        )}
        {(pendingNames?.length ?? 0) > 0 && (
          <>
            <CardHeader>
              <CardTitle
                title={
                  <FormattedMessage
                    id="edit_identity.pending_names_title"
                    defaultMessage="Requested Names"
                  />
                }
              />
            </CardHeader>
            <List>
              {pendingNames?.map(({ username }) => {
                if (!username) return null;
                return (
                  <ListItem
                    key={username}
                    label={
                      <HStack alignItems="center" space={2}>
                        <span>{username}</span>
                      </HStack>
                    }
                  />
                );
              })}
            </List>
          </>
        )}
      </div>
    </Column>
  );
};

export const UsernameInput: React.FC<React.ComponentProps<typeof Input>> = (
  props
) => {
  const intl = useIntl();

  return (
    <Input
      placeholder={intl.formatMessage(messages.username)}
      prepend={
        <HStack alignItems="center" className="pl-2">
          <Icon className="size-4" src={atIcon} />
        </HStack>
      }
      {...props}
    />
  );
};

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

function useNames() {
  const api = useApi();

  return useQuery({
    queryKey: ["names", "approved"],
    queryFn: async () => {
      const response = await api.get("/api/v1/ditto/names?approved=true");
      const data = await response.json();
      return adminAccountSchema.array().parse(data);
    },
    placeholderData: [],
  });
}

function usePendingNames() {
  const api = useApi();

  return useQuery({
    queryKey: ["names", "pending"],
    queryFn: async () => {
      const response = await api.get("/api/v1/ditto/names?approved=false");
      const data = await response.json();
      return adminAccountSchema.array().parse(data);
    },
    placeholderData: [],
  });
}

export default EditIdentity;
