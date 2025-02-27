import { defineMessages, type IntlShape } from "react-intl";

import toast from "src/toast";
import { isLoggedIn } from "src/utils/auth";
import { formatBytes, getVideoDuration } from "src/utils/media";
import resizeImage from "src/utils/resize-image";

import api from "../api/index";

import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

const messages = defineMessages({
  exceededImageSizeLimit: {
    id: "upload_error.image_size_limit",
    defaultMessage: "Image exceeds the current file size limit ({limit})",
  },
  exceededVideoSizeLimit: {
    id: "upload_error.video_size_limit",
    defaultMessage: "Video exceeds the current file size limit ({limit})",
  },
  exceededVideoDurationLimit: {
    id: "upload_error.video_duration_limit",
    defaultMessage:
      "Video exceeds the current duration limit ({limit, plural, one {# second} other {# seconds}})",
  },
});

const noOp = (e: any) => {};

const fetchMedia =
  (mediaId: string) => (dispatch: any, getState: () => RootState) => {
    return api(getState).get(`/api/media/${mediaId}`);
  };

const updateMedia =
  (mediaId: string, params: Record<string, any>) =>
  (dispatch: any, getState: () => RootState) => {
    return api(getState).put(`/api/media/${mediaId}`, params);
  };

const uploadMedia =
  (data: FormData, onUploadProgress = noOp) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState).post("/api/media", data, { onUploadProgress });

const uploadFile =
  (
    file: File,
    intl: IntlShape,
    onSuccess: (data: APIEntity) => void = () => {},
    onFail: (error: unknown) => void = () => {},
    onUploadProgress: (e: ProgressEvent) => void = () => {}
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;
    // TODO: Change these to be more specific
    const maxImageSize = 30 * 1024 * 1024; // 30 MB in bytes
    const maxVideoSize = 2 * 1024 * 1024 * 1024; // 2 GB in bytes
    const maxVideoDuration = 3600; // 1 hour in seconds (may adjust this as needed)

    const isImage = file.type.match(/image.*/);
    const isVideo = file.type.match(/video.*/);
    const videoDurationInSeconds =
      isVideo && maxVideoDuration ? await getVideoDuration(file) : 0;

    if (isImage && maxImageSize && file.size > maxImageSize) {
      const limit = formatBytes(maxImageSize);
      const message = intl.formatMessage(messages.exceededImageSizeLimit, {
        limit,
      });
      toast.error(message);
      onFail(true);
      return;
    } else if (isVideo && maxVideoSize && file.size > maxVideoSize) {
      const limit = formatBytes(maxVideoSize);
      const message = intl.formatMessage(messages.exceededVideoSizeLimit, {
        limit,
      });
      toast.error(message);
      onFail(true);
      return;
    } else if (
      isVideo &&
      maxVideoDuration &&
      videoDurationInSeconds > maxVideoDuration
    ) {
      const message = intl.formatMessage(messages.exceededVideoDurationLimit, {
        limit: maxVideoDuration,
      });
      toast.error(message);
      onFail(true);
      return;
    }

    // FIXME: Don't define const in loop
    resizeImage(file)
      .then((resized) => {
        const data = new FormData();
        data.append("file", resized);

        return dispatch(uploadMedia(data, onUploadProgress)).then(
          async (response) => {
            const { status } = response;
            const data = await response.json();
            // If server-side processing of the media attachment has not completed yet,
            // poll the server until it is, before showing the media attachment as uploaded
            if (status === 200) {
              onSuccess(data);
            } else if (status === 202) {
              const poll = () => {
                dispatch(fetchMedia(data.id))
                  .then(async (response) => {
                    const { status } = response;
                    const data = await response.json();
                    if (status === 200) {
                      onSuccess(data);
                    } else if (status === 206) {
                      setTimeout(() => poll(), 1000);
                    }
                  })
                  .catch((error) => onFail(error));
              };

              poll();
            }
          }
        );
      })
      .catch((error) => onFail(error));
  };

export { fetchMedia, updateMedia, uploadMedia, uploadFile };
