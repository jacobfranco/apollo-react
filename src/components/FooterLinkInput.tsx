import React from "react";
import { useIntl, defineMessages } from "react-intl";

import HStack from "src/components/HStack";
import Input from "src/components/Input";

import type { StreamfieldComponent } from "src/components/Streamfield";
import type { FooterItem } from "src/types/apollo";

const messages = defineMessages({
  label: {
    id: "apollo_config.home_footer.meta_fields.label_placeholder",
    defaultMessage: "Label",
  },
  url: {
    id: "apollo_config.home_footer.meta_fields.url_placeholder",
    defaultMessage: "URL",
  },
});

const PromoPanelInput: StreamfieldComponent<FooterItem> = ({
  value,
  onChange,
}) => {
  const intl = useIntl();

  const handleChange = (
    key: "title" | "url"
  ): React.ChangeEventHandler<HTMLInputElement> => {
    return (e) => {
      onChange(value.set(key, e.currentTarget.value));
    };
  };

  return (
    <HStack space={2} grow>
      <Input
        type="text"
        outerClassName="w-full grow"
        placeholder={intl.formatMessage(messages.label)}
        value={value.title}
        onChange={handleChange("title")}
      />
      <Input
        type="text"
        outerClassName="w-full grow"
        placeholder={intl.formatMessage(messages.url)}
        value={value.url}
        onChange={handleChange("url")}
      />
    </HStack>
  );
};

export default PromoPanelInput;
