import { Entities } from "src/entity-store/entities";
import { useEntities } from "src/entity-store/hooks/index";
import { useApi } from "src/hooks/useApi";
import { Status as StatusEntity, statusSchema } from "src/schemas/index";

/**
 * Get all the statuses the user has bookmarked.
 * https://docs.joinmastodon.org/methods/bookmarks/#get
 * GET /api/bookmarks
 * TODO: add 'limit'
 */
function useBookmarks() {
  const api = useApi();

  const { entities, ...result } = useEntities<StatusEntity>(
    [Entities.STATUSES, "bookmarks"],
    () => api.get("/api/bookmarks"),
    { enabled: true, schema: statusSchema }
  );

  const bookmarks = entities;

  return {
    ...result,
    bookmarks,
  };
}

export { useBookmarks };
