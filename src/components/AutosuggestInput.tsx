import clsx from "clsx";
import { List as ImmutableList } from "immutable";
import { PureComponent } from "react";

import AutosuggestEmoji from "src/components/AutosuggestEmoji";
import Icon from "src/components/Icon";
import Input from "src/components/Input";
import Portal from "src/components/Portal";
import AutosuggestAccount from "src/features/compose/components/AutosuggestAccount";
import { textAtCursorMatchesToken } from "src/utils/suggestions";

import type { Menu, MenuItem } from "src/components/dropdown-menu/index";
import type { InputThemes } from "src/components/Input";
import type { Emoji } from "src/features/emoji/index";
import AutosuggestSpace from "./AutosuggestSpace";

export type AutoSuggestion = string | Emoji;

export interface IAutosuggestInput
  extends Pick<
    React.HTMLAttributes<HTMLInputElement>,
    "onChange" | "onKeyUp" | "onKeyDown"
  > {
  value: string;
  suggestions: ImmutableList<any>;
  disabled?: boolean;
  placeholder?: string;
  onSuggestionSelected: (
    tokenStart: number,
    lastToken: string | null,
    suggestion: AutoSuggestion
  ) => void;
  onSuggestionsClearRequested: () => void;
  onSuggestionsFetchRequested: (token: string) => void;
  autoFocus: boolean;
  autoSelect: boolean;
  className?: string;
  id?: string;
  searchTokens: string[];
  maxLength?: number;
  menu?: Menu;
  renderSuggestion?: React.FC<{ id: string }>;
  hidePortal?: boolean;
  theme?: InputThemes;
}

export default class AutosuggestInput extends PureComponent<IAutosuggestInput> {
  static defaultProps = {
    autoFocus: false,
    autoSelect: true,
    searchTokens: ImmutableList(["@", ":", "#", "s/"]),
  };

  getFirstIndex = () => {
    return this.props.autoSelect ? 0 : -1;
  };

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: this.getFirstIndex(),
    lastToken: null,
    tokenStart: 0,
  };

  input: HTMLInputElement | null = null;

  onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const [tokenStart, token] = textAtCursorMatchesToken(
      e.target.value,
      e.target.selectionStart || 0,
      this.props.searchTokens
    );

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const { suggestions, menu, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;
    const firstIndex = this.getFirstIndex();
    const lastIndex = suggestions.size + (menu || []).length - 1;

    if (disabled) {
      e.preventDefault();
      return;
    }

    if (e.which === 229) {
      // Ignore key events during text composition
      // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
      return;
    }

    switch (e.key) {
      case "Escape":
        if (suggestions.size === 0 || suggestionsHidden) {
          document.querySelector(".ui")?.parentElement?.focus();
        } else {
          e.preventDefault();
          this.setState({ suggestionsHidden: true });
        }

        break;
      case "ArrowDown":
        if (!suggestionsHidden && (suggestions.size > 0 || menu)) {
          e.preventDefault();
          this.setState({
            selectedSuggestion: Math.min(selectedSuggestion + 1, lastIndex),
          });
        }

        break;
      case "ArrowUp":
        if (!suggestionsHidden && (suggestions.size > 0 || menu)) {
          e.preventDefault();
          this.setState({
            selectedSuggestion: Math.max(selectedSuggestion - 1, firstIndex),
          });
        }

        break;
      case "Enter":
      case "Tab":
        // Select suggestion
        if (
          !suggestionsHidden &&
          selectedSuggestion > -1 &&
          (suggestions.size > 0 || menu)
        ) {
          e.preventDefault();
          e.stopPropagation();
          this.setState({ selectedSuggestion: firstIndex });

          if (selectedSuggestion < suggestions.size) {
            this.props.onSuggestionSelected(
              this.state.tokenStart,
              this.state.lastToken,
              suggestions.get(selectedSuggestion)
            );
          } else if (menu) {
            const item = menu[selectedSuggestion - suggestions.size];
            this.handleMenuItemAction(item, e);
          }
        }

        break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) {
      return;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  onBlur = () => {
    this.setState({ suggestionsHidden: true, focused: false });
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onSuggestionClick: React.EventHandler<React.MouseEvent | React.TouchEvent> = (
    e
  ) => {
    const index = Number(e.currentTarget?.getAttribute("data-index"));
    const suggestion = this.props.suggestions.get(index);
    this.props.onSuggestionSelected(
      this.state.tokenStart,
      this.state.lastToken,
      suggestion
    );
    this.input?.focus();
    e.preventDefault();
  };

  componentDidUpdate(prevProps: IAutosuggestInput, prevState: any) {
    const { suggestions } = this.props;
    if (
      suggestions !== prevProps.suggestions &&
      suggestions.size > 0 &&
      prevState.suggestionsHidden &&
      prevState.focused
    ) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setInput = (c: HTMLInputElement) => {
    this.input = c;
  };

  renderSuggestion = (suggestion: AutoSuggestion, i: number) => {
    const { selectedSuggestion } = this.state;
    let inner: JSX.Element | string;
    let key: React.Key;

    if (typeof suggestion === "object") {
      // Handle emoji suggestions (these are objects with id and native properties)
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key = suggestion.id;
    } else {
      // Handle all string-based suggestions (mentions, hashtags, spaces)
      if (suggestion.startsWith("s/")) {
        const spaceId = suggestion.slice(2);
        inner = <AutosuggestSpace id={spaceId} />;
      } else if (suggestion.startsWith("#")) {
        inner = suggestion;
      } else {
        inner = <AutosuggestAccount id={suggestion} />;
      }
      key = suggestion;
    }

    return (
      <div
        role="button"
        tabIndex={0}
        key={key}
        data-index={i}
        className={clsx({
          "flex px-4 py-2.5 text-sm text-gray-700 dark:text-gray-500 hover:bg-primary-200 dark:hover:bg-secondary-800 cursor-pointer":
            true,
          "bg-primary-200 dark:bg-secondary-800": i === selectedSuggestion,
        })}
        onMouseDown={this.onSuggestionClick}
        onTouchEnd={this.onSuggestionClick}
      >
        {inner}
      </div>
    );
  };

  handleMenuItemAction = (
    item: MenuItem | null,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    this.onBlur();
    if (item?.action) {
      item.action(e);
    }
  };

  handleMenuItemClick = (item: MenuItem | null): React.MouseEventHandler => {
    return (e) => {
      e.preventDefault();
      this.handleMenuItemAction(item, e);
    };
  };

  renderMenu = () => {
    const { menu, suggestions } = this.props;
    const { selectedSuggestion } = this.state;

    if (!menu) return null;

    return menu.map((item, i) => (
      <a
        className={clsx(
          "flex cursor-pointer items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-500 hover:bg-primary-200 dark:hover:bg-secondary-800",
          {
            "bg-primary-200 dark:bg-secondary-800":
              suggestions.size - selectedSuggestion === i,
          }
        )}
        href="/"
        role="button"
        tabIndex={0}
        onMouseDown={this.handleMenuItemClick(item)}
        key={i}
      >
        {item?.icon && (
          <Icon
            src={item.icon}
            className="mr-3 h-5 w-5 flex-none rtl:ml-3 rtl:mr-0"
          />
        )}
        <span className="truncate font-medium">{item?.text}</span>
      </a>
    ));
  };

  setPortalPosition() {
    if (!this.input) {
      return {};
    }

    const { top, height, left, width } = this.input.getBoundingClientRect();

    return { left, width, top: top + height };
  }

  render() {
    const {
      value,
      suggestions,
      disabled,
      placeholder,
      onKeyUp,
      autoFocus,
      className,
      id,
      maxLength,
      menu,
      theme,
    } = this.props;
    const { suggestionsHidden } = this.state;
    console.log("Render state:", {
      suggestions: suggestions.toJS(),
      suggestionsHidden,
      visible:
        !suggestionsHidden && (!suggestions.isEmpty() || (menu && value)),
    });
    const visible =
      !suggestionsHidden && (!suggestions.isEmpty() || (menu && value));

    return [
      <div key="input" className="relative w-full">
        <label className="sr-only">{placeholder}</label>
        <Input
          type="text"
          className={className}
          outerClassName="mt-0"
          ref={this.setInput}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          aria-autocomplete="list"
          id={id}
          maxLength={maxLength}
          data-testid="autosuggest-input"
          theme={theme}
        />
      </div>,
      <Portal key="portal">
        <div
          style={this.setPortalPosition()}
          className={clsx({
            "fixed z-[1001] w-68 rounded-md bg-primary-100 py-1 shadow-lg transition-opacity duration-100 focus:outline-none black:bg-black dark:bg-secondary-900 dark:ring-2 dark:ring-primary-700":
              true,
            "opacity-0 pointer-events-none": !visible,
            "opacity-100": visible,
          })}
        >
          {/* Add debug output */}
          <div style={{ display: "none" }}>
            {JSON.stringify({
              visible,
              suggestionsEmpty: suggestions.isEmpty(),
              menuValue: menu && value,
            })}
          </div>
          <div className="space-y-0.5">
            {suggestions.map((suggestion, i) => {
              console.log("Rendering suggestion:", suggestion);
              return this.renderSuggestion(suggestion, i);
            })}
          </div>
          {this.renderMenu()}
        </div>
      </Portal>,
    ];
  }
}
