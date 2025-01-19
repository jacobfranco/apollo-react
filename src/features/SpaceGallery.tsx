import { List as ImmutableList } from "immutable";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { openModal } from "src/actions/modals";
import { expandSpaceMediaTimeline } from "src/actions/timelines";
import { MediaItem, MissingIndicator, Spinner } from "src/components";
import ScrollableList from "src/components/ScrollableList";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { getSpaceMediaGallery } from "src/selectors";
import type { Attachment, Status } from "src/types/entities";

const SpaceGallery: React.FC<{ spacePath: string }> = ({ spacePath }) => {
  const dispatch = useAppDispatch();
  const space = useAppSelector((state) => state.spaces.get(spacePath));

  const attachments: ImmutableList<Attachment> = useAppSelector((state) =>
    getSpaceMediaGallery(state, spacePath)
  );

  const isLoading = useAppSelector(
    (state) => state.timelines.get(`space:${spacePath}:media`)?.isLoading
  );

  const hasMore = useAppSelector(
    (state) => state.timelines.get(`space:${spacePath}:media`)?.hasMore
  );

  const next = useAppSelector(
    (state) => state.timelines.get(`space:${spacePath}:media`)?.next
  );

  const handleLoadMore = () => {
    if (space && hasMore && !isLoading) {
      const maxId =
        attachments.size > 0 ? attachments.last()!.status.id : undefined;
      dispatch(expandSpaceMediaTimeline(spacePath, { url: next, maxId }));
    }
  };

  const handleOpenMedia = (attachment: Attachment) => {
    if (attachment.type === "video") {
      dispatch(
        openModal("VIDEO", {
          media: attachment,
          status: attachment.status,
          account: attachment.account,
        })
      );
    } else {
      const media = (attachment.status as Status).media_attachments;
      const index = media.findIndex((x) => x.id === attachment.id);
      dispatch(openModal("MEDIA", { media, index, status: attachment.status }));
    }
  };

  useEffect(() => {
    if (space) {
      dispatch(expandSpaceMediaTimeline(spacePath));
    }
  }, [spacePath, space, dispatch]);

  if (!space) {
    return <MissingIndicator />;
  }

  // Create a grid container for each row of media items
  const GridRow: React.FC<{ items: Attachment[] }> = ({ items }) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 pb-2">
      {items.map((attachment) => (
        <MediaItem
          key={`${attachment.status.id}+${attachment.id}`}
          attachment={attachment}
          onOpenMedia={handleOpenMedia}
        />
      ))}
    </div>
  );

  // Group attachments into rows (3 items per row)
  const rows = attachments.reduce((acc: Attachment[][], attachment, i) => {
    const rowIndex = Math.floor(i / 3);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(attachment);
    return acc;
  }, []);

  return (
    <ScrollableList
      scrollKey={`space_gallery:${spacePath}`}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      placeholderComponent={Spinner}
      emptyMessage={
        <FormattedMessage
          id="space_gallery.none"
          defaultMessage="No media to show."
        />
      }
    >
      {rows.map((rowItems, index) => (
        <GridRow key={index} items={rowItems} />
      ))}
    </ScrollableList>
  );
};

export default SpaceGallery;
