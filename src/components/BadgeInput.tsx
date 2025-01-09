import React from "react";
import { useIntl, defineMessages } from "react-intl";

import { TagInput } from "src/components";
import { badgeToTag, tagToBadge } from "src/utils/badges";

const messages = defineMessages({
  placeholder: {
    id: "badge_input.placeholder",
    defaultMessage: "Enter a badge…",
  },
});

interface IBadgeInput {
  /** A badge is a tag that begins with `badge:` */
  badges: string[];
  /** Callback when badges change. */
  onChange: (badges: string[]) => void;
}

/** Manages user badges. */
const BadgeInput: React.FC<IBadgeInput> = ({ badges, onChange }) => {
  const intl = useIntl();
  console.log("BadgeInput received badges:", badges);
  const tags = badges.map(badgeToTag);
  console.log("Converted to tags:", tags);

  const handleTagsChange = (tags: string[]) => {
    console.log("TagInput onChange received tags:", tags);
    const badges = tags.map(tagToBadge);
    console.log("Converting back to badges:", badges);
    onChange(badges);
  };

  return (
    <TagInput
      tags={tags}
      onChange={handleTagsChange}
      placeholder={intl.formatMessage(messages.placeholder)}
    />
  );
};

export default BadgeInput;
