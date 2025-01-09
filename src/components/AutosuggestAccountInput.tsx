import { throttle } from "es-toolkit";
import { OrderedSet as ImmutableOrderedSet } from "immutable";
import { useState, useRef, useCallback, useEffect } from "react";

import { accountSearch } from "src/actions/accounts";
import AutosuggestInput, {
  AutoSuggestion,
} from "src/components/AutosuggestInput";
import { useAppDispatch } from "src/hooks/useAppDispatch";

import type { Menu } from "src/components/dropdown-menu";
import type { InputThemes } from "src/components/Input";

const noOp = () => {};

interface IAutosuggestAccountInput {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSelected: (accountId: string) => void;
  autoFocus?: boolean;
  value: string;
  limit?: number;
  className?: string;
  autoSelect?: boolean;
  menu?: Menu;
  onKeyDown?: React.KeyboardEventHandler;
  theme?: InputThemes;
}

const AutosuggestAccountInput: React.FC<IAutosuggestAccountInput> = ({
  onChange,
  onSelected,
  value = "",
  limit = 4,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const [accountIds, setAccountIds] = useState(ImmutableOrderedSet<string>());
  const controller = useRef(new AbortController());

  const refreshCancelToken = () => {
    controller.current.abort();
    controller.current = new AbortController();
  };

  const clearResults = () => {
    setAccountIds(ImmutableOrderedSet());
  };

  const handleAccountSearch = useCallback(
    throttle(
      (q) => {
        const params = { q, limit, resolve: false };

        dispatch(accountSearch(params, controller.current.signal))
          .then((accounts: { id: string }[]) => {
            const accountIds = accounts.map((account) => account.id);
            setAccountIds(ImmutableOrderedSet(accountIds));
          })
          .catch(noOp);
      },
      900,
      { edges: ["leading", "trailing"] }
    ),
    [limit]
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    refreshCancelToken();
    handleAccountSearch(e.target.value);
    onChange(e);
  };

  const handleSelected = (
    _tokenStart: number,
    _lastToken: string | null,
    suggestion: AutoSuggestion
  ) => {
    if (typeof suggestion === "string" && suggestion[0] !== "#") {
      onSelected(suggestion);
    }
  };

  useEffect(() => {
    if (rest.autoFocus) {
      handleAccountSearch("");
    }
  }, []);

  useEffect(() => {
    if (value === "") {
      clearResults();
    }
  }, [value]);

  return (
    <AutosuggestInput
      value={value}
      onChange={handleChange}
      suggestions={accountIds.toList()}
      onSuggestionsFetchRequested={noOp}
      onSuggestionsClearRequested={noOp}
      onSuggestionSelected={handleSelected}
      searchTokens={[]}
      {...rest}
    />
  );
};

export default AutosuggestAccountInput;
