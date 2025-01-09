import React from "react";
import toast from "react-hot-toast";
import { defineMessages, MessageDescriptor } from "react-intl";

import { HTTPError } from "src/api/HTTPError";
import Toast from "src/components/Toast";
import { httpErrorMessages } from "src/utils/errors";

export type ToastText = string | MessageDescriptor;
export type ToastType = "success" | "error" | "info";

interface IToastOptions {
  action?(): void;
  actionLink?: string; // not used in this file...
  actionLabel?: ToastText;
  duration?: number;
  summary?: string;
}

const DEFAULT_DURATION = 4000;

const createToast = (
  type: ToastType,
  message: ToastText,
  opts?: IToastOptions
) => {
  const duration = opts?.duration || DEFAULT_DURATION;

  toast.custom((t) => <Toast t={t} message={message} type={type} {...opts} />, {
    duration,
  });
};

function info(message: ToastText, opts?: IToastOptions) {
  createToast("info", message, opts);
}

function success(message: ToastText, opts?: IToastOptions) {
  createToast("success", message, opts);
}

function error(message: ToastText, opts?: IToastOptions) {
  createToast("error", message, opts);
}

const messages = defineMessages({
  unexpectedMessage: {
    id: "alert.unexpected.message",
    defaultMessage: "Something went wrong.",
  },
});

async function showAlertForError(networkError: HTTPError): Promise<void> {
  const { response } = networkError;

  if (response) {
    const { status, statusText } = response;

    if (status === 502) {
      return error("The server is down");
    }

    if (status === 404 || status === 410) {
      // Skip these errors as they are reflected in the UI
      return;
    }

    const data = await response.error();
    if (data) {
      return error(data.error);
    }

    const message = httpErrorMessages.find(
      (httpError) => httpError.code === status
    )?.description;

    return error(message ?? statusText);
  } else {
    console.error(networkError);
    return error(messages.unexpectedMessage);
  }
}

export default {
  info,
  success,
  error,
  showAlertForError,
};
