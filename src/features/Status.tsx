import { debounce } from "es-toolkit";
import { useCallback, useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Redirect } from "react-router-dom";

import { fetchStatusWithContext, fetchNext } from "src/actions/statuses";
import MissingIndicator from "src/components/MissingIndicator";
import PullToRefresh from "src/components/PullToRefresh";
import { Column } from "src/components/Column";
import Stack from "src/components/Stack";
import PlaceholderStatus from "src/components/PlaceholderStatus";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useLoggedIn } from "src/hooks/useLoggedIn";
import { makeGetStatus } from "src/selectors/index";

import ThreadLoginCta from "src/components/ThreadLoginCta";
import Thread from "src/components/Thread";

const messages = defineMessages({
  title: { id: "status.title", defaultMessage: "Post Details" },
  titleDirect: { id: "status.title_direct", defaultMessage: "Direct message" },
  deleteConfirm: {
    id: "confirmations.delete.confirm",
    defaultMessage: "Delete",
  },
  deleteHeading: {
    id: "confirmations.delete.heading",
    defaultMessage: "Delete post",
  },
  deleteMessage: {
    id: "confirmations.delete.message",
    defaultMessage: "Are you sure you want to delete this post?",
  },
  redraftConfirm: {
    id: "confirmations.redraft.confirm",
    defaultMessage: "Delete & redraft",
  },
  redraftHeading: {
    id: "confirmations.redraft.heading",
    defaultMessage: "Delete & redraft",
  },
  redraftMessage: {
    id: "confirmations.redraft.message",
    defaultMessage:
      "Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.",
  },
  blockConfirm: { id: "confirmations.block.confirm", defaultMessage: "Block" },
  revealAll: {
    id: "status.show_more_all",
    defaultMessage: "Show more for all",
  },
  hideAll: { id: "status.show_less_all", defaultMessage: "Show less for all" },
  detailedStatus: {
    id: "status.detailed_status",
    defaultMessage: "Detailed conversation view",
  },
  replyConfirm: { id: "confirmations.reply.confirm", defaultMessage: "Reply" },
  replyMessage: {
    id: "confirmations.reply.message",
    defaultMessage:
      "Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?",
  },
  blockAndReport: {
    id: "confirmations.block.block_and_report",
    defaultMessage: "Block & Report",
  },
});

type RouteParams = {
  statusId: string;
  groupId?: string;
  groupSlug?: string;
};

interface IStatusDetails {
  params: RouteParams;
}

const StatusDetails: React.FC<IStatusDetails> = (props) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { isLoggedIn } = useLoggedIn();

  const getStatus = useCallback(makeGetStatus(), []);
  const status = useAppSelector((state) =>
    getStatus(state, { id: props.params.statusId })
  );

  const [isLoaded, setIsLoaded] = useState<boolean>(!!status);
  const [next, setNext] = useState<string | null>(null);

  /** Fetch the status (and context) from the API. */
  const fetchData = async () => {
    const { params } = props;
    const { statusId } = params;
    const { next } = await dispatch(fetchStatusWithContext(statusId));
    setNext(next);
  };

  // Load data.
  useEffect(() => {
    fetchData()
      .then(() => {
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, [props.params.statusId]);

  const handleLoadMore = useCallback(
    debounce(
      () => {
        if (next && status) {
          dispatch(fetchNext(status.id, next))
            .then(({ next }) => {
              setNext(next);
            })
            .catch(() => {});
        }
      },
      300,
      { edges: ["leading"] }
    ),
    [next, status]
  );

  const handleRefresh = () => {
    return fetchData();
  };

  if (!status && isLoaded) {
    return <MissingIndicator />;
  } else if (!status) {
    return (
      <Column>
        <PlaceholderStatus />
      </Column>
    );
  }

  if (status.group && typeof status.group === "object") {
    if (status.group.slug && !props.params.groupSlug) {
      return (
        <Redirect
          to={`/group/${status.group.slug}/posts/${props.params.statusId}`}
        />
      );
    }
  }

  const titleMessage = () => {
    if (status.visibility === "direct") return messages.titleDirect;
    return messages.title;
  };

  return (
    <Stack space={4}>
      <Column label={""}>
        <PullToRefresh onRefresh={handleRefresh}>
          <Thread status={status} next={next} handleLoadMore={handleLoadMore} />
        </PullToRefresh>
      </Column>

      {!isLoggedIn && <ThreadLoginCta />}
    </Stack>
  );
};

export default StatusDetails;
