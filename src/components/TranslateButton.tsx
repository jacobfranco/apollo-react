import languageIcon from "@tabler/icons/outline/language.svg";
import { FormattedMessage, useIntl } from "react-intl";

import { translateStatus, undoStatusTranslation } from "src/actions/statuses";
import Button from "src/components/Button";
import Stack from "src/components/Stack";
import Text from "src/components/Text";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";

import type { Status } from "src/types/entities";

interface ITranslateButton {
  status: Status;
}

const TranslateButton: React.FC<ITranslateButton> = ({ status }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const me = useAppSelector((state) => state.me);

  const renderTranslate =
    me &&
    ["public", "unlisted"].includes(status.visibility) &&
    status.content.length > 0 &&
    status.language !== null &&
    intl.locale !== status.language;

  const handleTranslate: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (status.translation) {
      dispatch(undoStatusTranslation(status.id));
    } else {
      dispatch(translateStatus(status.id, intl.locale));
    }
  };

  if (!renderTranslate) return null;

  if (status.translation) {
    const languageNames = new Intl.DisplayNames([intl.locale], {
      type: "language",
    });
    const languageName = languageNames.of(status.language!);
    const provider = status.translation.get("provider");

    return (
      <Stack space={3} alignItems="start">
        <Button
          theme="muted"
          text={
            <FormattedMessage
              id="status.show_original"
              defaultMessage="Show original"
            />
          }
          icon={languageIcon}
          onClick={handleTranslate}
        />
        <Text theme="muted">
          <FormattedMessage
            id="status.translated_from_with"
            defaultMessage="Translated from {lang} using {provider}"
            values={{ lang: languageName, provider }}
          />
        </Text>
      </Stack>
    );
  }

  return (
    <div>
      <Button
        theme="muted"
        text={
          <FormattedMessage id="status.translate" defaultMessage="Translate" />
        }
        icon={languageIcon}
        onClick={handleTranslate}
      />
    </div>
  );
};

export default TranslateButton;
