import Modal from "src/components/Modal";
import EmojiPickerDropdown from "src/features/emoji/components/EmojiPickerDropdown";
import { Emoji } from "src/features/emoji/index";

interface IEmojiPickerModal {
  onPickEmoji?: (emoji: Emoji) => void;
}

export const EmojiPickerModal: React.FC<IEmojiPickerModal> = (props) => {
  return (
    <Modal className="flex" theme="transparent">
      <EmojiPickerDropdown {...props} />
    </Modal>
  );
};

export default EmojiPickerModal;
