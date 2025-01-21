import React, { useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { changeSetting } from "src/actions/settings";
import { updateNotificationSettings } from "src/actions/accounts";
import { patchMe } from "src/actions/me";
import List, { ListItem } from "src/components/List";
import { Form, SettingToggle } from "src/components";
import { SelectDropdown } from "src/features/Forms";
import { useAppDispatch } from "src/hooks";
import { useSettings } from "src/hooks/useSettings";
import { useOwnAccount } from "src/hooks/useOwnAccount";
import ThemeToggle from "src/features/ThemeToggle";
import Toggle from "src/components/Toggle";

const languages = {
  en: "English",
  ar: "العربية",
  ast: "Asturianu",
  bg: "Български",
  bn: "বাংলা",
  ca: "Català",
  co: "Corsu",
  cs: "Čeština",
  cy: "Cymraeg",
  da: "Dansk",
  de: "Deutsch",
  el: "Ελληνικά",
  "en-Shaw": "𐑖𐑱𐑝𐑾𐑯",
  eo: "Esperanto",
  es: "Español",
  eu: "Euskara",
  fa: "فارسی",
  fi: "Suomi",
  fr: "Français",
  ga: "Gaeilge",
  gl: "Galego",
  he: "עברית",
  hi: "हिन्दी",
  hr: "Hrvatski",
  hu: "Magyar",
  hy: "Հայերեն",
  id: "Bahasa Indonesia",
  io: "Ido",
  is: "íslenska",
  it: "Italiano",
  ja: "日本語",
  jv: "ꦧꦱꦗꦮ",
  ka: "ქართული",
  kk: "Қазақша",
  ko: "한국어",
  lt: "Lietuvių",
  lv: "Latviešu",
  ml: "മലയാളം",
  ms: "Bahasa Melayu",
  nl: "Nederlands",
  no: "Norsk",
  oc: "Occitan",
  pl: "Polski",
  pt: "Português",
  "pt-BR": "Português do Brasil",
  ro: "Română",
  ru: "Русский",
  sk: "Slovenčina",
  sl: "Slovenščina",
  sq: "Shqip",
  sr: "Српски",
  "sr-Latn": "Srpski (latinica)",
  sv: "Svenska",
  ta: "தமிழ்",
  te: "తెలుగు",
  th: "ไทย",
  tr: "Türkçe",
  uk: "Українська",
  zh: "中文",
  "zh-CN": "简体中文",
  "zh-HK": "繁體中文（香港）",
  "zh-TW": "繁體中文（臺灣）",
};

const messages = defineMessages({
  heading: { id: "column.preferences", defaultMessage: "Preferences" },
  displayPostsHideAll: {
    id: "preferences.fields.display_media.hide_all",
    defaultMessage: "Hide",
  },
  displayPostsShowAll: {
    id: "preferences.fields.display_media.show_all",
    defaultMessage: "Show",
  },
  privacy_public: {
    id: "preferences.options.privacy_public",
    defaultMessage: "Public",
  },
  privacy_unlisted: {
    id: "preferences.options.privacy_unlisted",
    defaultMessage: "Unlisted",
  },
  privacy_followers_only: {
    id: "preferences.options.privacy_followers_only",
    defaultMessage: "Private",
  },
  content_type_plaintext: {
    id: "preferences.options.content_type_plaintext",
    defaultMessage: "Plain text",
  },
  content_type_markdown: {
    id: "preferences.options.content_type_markdown",
    defaultMessage: "Markdown",
  },
});

const Preferences = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const { account } = useOwnAccount();
  const [muteStrangers, setMuteStrangers] = useState(false);

  const handleAccountSettingChange = async (key: string, value: boolean) => {
    const formdata = new FormData();
    formdata.set(key, String(value));
    try {
      await dispatch(patchMe(formdata));
    } catch (error) {
      console.error("Failed to update account setting:", error);
    }
  };

  const onSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    path: string[]
  ) => {
    dispatch(changeSetting(path, event.target.value, { showAlert: true }));
  };

  const onToggleChange = (key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked, { showAlert: true }));
  };

  const handleStrangerNotificationsChange = async (checked: boolean) => {
    setMuteStrangers(checked);
    try {
      await dispatch(
        updateNotificationSettings({
          block_from_strangers: checked,
        })
      );
    } catch (error) {
      console.error("Failed to update notification settings:", error);
    }
  };

  const displayMediaOptions = React.useMemo(
    () => ({
      hide_all: intl.formatMessage(messages.displayPostsHideAll),
      show_all: intl.formatMessage(messages.displayPostsShowAll),
    }),
    [intl]
  );

  const defaultPrivacyOptions = React.useMemo(
    () => ({
      public: intl.formatMessage(messages.privacy_public),
      private: intl.formatMessage(messages.privacy_followers_only),
    }),
    [intl]
  );

  const defaultContentTypeOptions = React.useMemo(
    () => ({
      "text/plain": intl.formatMessage(messages.content_type_plaintext),
      "text/markdown": intl.formatMessage(messages.content_type_markdown),
    }),
    [intl]
  );

  return (
    <Form>
      {/* Display Settings Group */}
      <List>
        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.theme"
              defaultMessage="Theme"
            />
          }
        >
          <ThemeToggle />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.language_label"
              defaultMessage="Display Language"
            />
          }
        >
          <SelectDropdown
            className="max-w-[200px]"
            items={languages}
            defaultValue={settings.locale}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              onSelectChange(event, ["locale"])
            }
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.media_display_label"
              defaultMessage="Sensitive content"
            />
          }
        >
          <SelectDropdown
            className="max-w-[200px]"
            items={displayMediaOptions}
            defaultValue={settings.displayMedia}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              onSelectChange(event, ["displayMedia"])
            }
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.privacy_label"
              defaultMessage="Default post privacy"
            />
          }
        >
          <SelectDropdown
            className="max-w-[200px]"
            items={defaultPrivacyOptions}
            defaultValue={settings.defaultPrivacy}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              onSelectChange(event, ["defaultPrivacy"])
            }
          />
        </ListItem>
      </List>

      {/* Account Settings Group */}
      <List>
        <ListItem
          label={
            <FormattedMessage
              id="edit_profile.fields.locked_label"
              defaultMessage="Private account"
            />
          }
        >
          <Toggle
            checked={account?.locked || false}
            onChange={(e) =>
              handleAccountSettingChange("locked", e.target.checked)
            }
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="edit_profile.fields.bot_label"
              defaultMessage="Bot account"
            />
          }
        >
          <Toggle
            checked={account?.bot || false}
            onChange={(e) =>
              handleAccountSettingChange("bot", e.target.checked)
            }
          />
        </ListItem>
      </List>

      {/* Status Settings Group */}
      <List>
        <ListItem
          label={
            <FormattedMessage
              id="home.column_settings.show_reposts"
              defaultMessage="Show reposts"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["home", "shows", "repost"]}
            onChange={onToggleChange}
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="home.column_settings.show_replies"
              defaultMessage="Show replies"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["home", "shows", "reply"]}
            onChange={onToggleChange}
          />
        </ListItem>
      </List>

      {/* General Settings Group */}
      <List>
        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.delete_modal_label"
              defaultMessage="Show confirmation dialog before deleting a post"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["deleteModal"]}
            onChange={onToggleChange}
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="edit_profile.fields.stranger_notifications_label"
              defaultMessage="Block notifications from strangers"
            />
          }
        >
          <Toggle
            checked={muteStrangers}
            onChange={(e) =>
              handleStrangerNotificationsChange(e.target.checked)
            }
          />
        </ListItem>
        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.auto_play_gif_label"
              defaultMessage="Auto-play animated GIFs"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["autoPlayGif"]}
            onChange={onToggleChange}
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.expand_spoilers_label"
              defaultMessage="Always expand posts marked with content warnings"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["expandSpoilers"]}
            onChange={onToggleChange}
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.autoload_timelines_label"
              defaultMessage="Automatically load new posts when scrolled to the top of the page"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["autoloadTimelines"]}
            onChange={onToggleChange}
          />
        </ListItem>

        <ListItem
          label={
            <FormattedMessage
              id="preferences.fields.autoload_more_label"
              defaultMessage="Automatically load more items when scrolled to the bottom of the page"
            />
          }
        >
          <SettingToggle
            settings={settings}
            settingPath={["autoloadMore"]}
            onChange={onToggleChange}
          />
        </ListItem>
      </List>
    </Form>
  );
};

export { Preferences as default, languages };
