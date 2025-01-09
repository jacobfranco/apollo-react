import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { spring } from "react-motion";

import HStack from "src/components/HStack";
import SvgIcon from "src/components/SvgIcon";
import ReplyIndicator from "src/features/compose/components/ReplyIndicator";
import { Status as StatusEntity } from "src/schemas/index";

import Motion from "src/utils/optional-motion";

import type { Menu, MenuItem } from "src/components/dropdown-menu/index";

interface IActionsModal {
  status: StatusEntity;
  actions: Menu;
  onClick: () => void;
  onClose: () => void;
}

const ActionsModal: React.FC<IActionsModal> = ({
  status,
  actions,
  onClick,
  onClose,
}) => {
  const renderAction = (action: MenuItem | null, i: number) => {
    if (action === null) {
      return (
        <li
          key={`sep-${i}`}
          className="m-2 block h-px bg-gray-200 black:bg-gray-800 dark:bg-gray-600"
        />
      );
    }

    const {
      icon = null,
      text,
      meta = null,
      active = false,
      href = "#",
      destructive,
    } = action;

    const Comp = href === "#" ? "button" : "a";
    const compProps =
      href === "#" ? { onClick: onClick } : { href: href, rel: "noopener" };

    return (
      <li key={`${text}-${i}`}>
        <HStack
          {...compProps}
          space={2.5}
          data-index={i}
          className={clsx(
            "flex w-full items-center px-4 py-3 text-left text-gray-700 no-underline hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800 dark:focus:bg-primary-800",
            { active, "text-danger-600 dark:text-danger-400": destructive }
          )}
          element={Comp}
        >
          {icon && (
            <SvgIcon
              title={text}
              className="size-6 min-w-5 stroke-[1.5]"
              src={icon}
              role="presentation"
              tabIndex={-1}
            />
          )}
          <div>
            <div className={clsx({ "font-medium": !!meta })}>{text}</div>
            <div>{meta}</div>
          </div>
        </HStack>
      </li>
    );
  };

  return (
    <Motion defaultStyle={{ top: 100 }} style={{ top: spring(0) }}>
      {({ top }) => (
        <div
          className="pointer-events-auto relative z-[9999] m-auto  flex max-h-[calc(100vh-3rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-gray-400 shadow-xl black:bg-black dark:bg-gray-900"
          style={{ top: `${top}%` }}
        >
          {status && (
            <ReplyIndicator
              className="max-h-[300px] overflow-y-auto rounded-b-none"
              status={status}
              hideActions
            />
          )}

          <ul
            className={clsx(
              { " max-h-[calc(80vh-75px)]": !!status },
              "my-2 max-h-[calc(100vh-147px)] shrink-0 overflow-y-auto"
            )}
          >
            {actions && actions.map(renderAction)}

            <li className="m-2 block h-px bg-gray-200 black:bg-gray-800 dark:bg-gray-600" />

            <li>
              <button
                type="button"
                className="flex w-full items-center justify-center px-4 py-3 text-left text-gray-700 no-underline hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800 dark:focus:bg-primary-800"
                onClick={onClose}
              >
                <FormattedMessage id="lightbox.close" defaultMessage="Close" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </Motion>
  );
};

export default ActionsModal;
