import paperclipIcon from "@tabler/icons/outline/paperclip.svg";
import photoIcon from "@tabler/icons/outline/photo.svg";
import { useRef } from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";

import IconButton from "src/components/IconButton";

const messages = defineMessages({
  upload: { id: "upload_button.label", defaultMessage: "Add media attachment" },
});

export const onlyImages = (types: string[] | undefined): boolean => {
  return types?.every((type) => type.startsWith("image/")) ?? false;
};

export interface IUploadButton {
  disabled?: boolean;
  unavailable?: boolean;
  onSelectFile: (files: FileList, intl: IntlShape) => void;
  style?: React.CSSProperties;
  resetFileKey: number | null;
  className?: string;
  iconClassName?: string;
  icon?: string;
}

const UploadButton: React.FC<IUploadButton> = ({
  disabled = false,
  unavailable = false,
  onSelectFile,
  resetFileKey,
  className = "text-gray-600 hover:text-gray-700 dark:hover:text-gray-500",
  iconClassName,
  icon,
}) => {
  const intl = useIntl();

  const fileElement = useRef<HTMLInputElement>(null);
  const attachmentTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "audio/mpeg",
    "audio/ogg",
    "audio/mp4",
    "text/plain",
  ]; // TODO: Implement correct attachment types

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files?.length) {
      onSelectFile(e.target.files, intl);
    }
  };

  const handleClick = () => {
    fileElement.current?.click();
  };

  if (unavailable) {
    return null;
  }

  const src = icon || (onlyImages(attachmentTypes) ? photoIcon : paperclipIcon);

  return (
    <div>
      <IconButton
        src={src}
        className={className}
        iconClassName={iconClassName}
        title={intl.formatMessage(messages.upload)}
        disabled={disabled}
        onClick={handleClick}
      />

      <label>
        <span className="sr-only">{intl.formatMessage(messages.upload)}</span>
        <input
          key={resetFileKey}
          ref={fileElement}
          type="file"
          multiple
          accept={attachmentTypes?.join(",")}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default UploadButton;
