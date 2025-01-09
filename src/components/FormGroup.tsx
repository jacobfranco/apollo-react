import { Children, cloneElement, isValidElement, useMemo } from "react";

import Checkbox from "./Checkbox";
import HStack from "./HStack";
import Stack from "./Stack";

interface IFormGroup {
  /** Input label message. */
  labelText?: React.ReactNode;
  /** Input label tooltip message. */
  labelTitle?: string;
  /** Input hint message. */
  hintText?: React.ReactNode;
  /** Input errors. */
  errors?: string[];
  /** Elements to display within the FormGroup. */
  children: React.ReactNode;
}

/** Input container with label. Renders the child. */
const FormGroup: React.FC<IFormGroup> = (props) => {
  const { children, errors = [], labelText, labelTitle, hintText } = props;
  const formFieldId: string = useMemo(() => `field-${crypto.randomUUID()}`, []);
  const inputChildren = Children.toArray(children);
  const hasError = errors?.length > 0;

  let firstChild;
  if (isValidElement(inputChildren[0])) {
    firstChild = cloneElement(
      inputChildren[0],
      // @ts-ignore
      { id: formFieldId }
    );
  }

  // @ts-ignore
  const isCheckboxFormGroup = firstChild?.type === Checkbox;

  if (isCheckboxFormGroup) {
    return (
      <HStack alignItems="start" space={2}>
        {firstChild}

        <Stack>
          {labelText && (
            <label
              htmlFor={formFieldId}
              data-testid="form-group-label"
              className="-mt-0.5 block text-sm font-medium text-gray-900 dark:text-gray-100"
              title={labelTitle}
            >
              {labelText}
            </label>
          )}

          {hasError && (
            <div className="relative">
              <div
                className="pointer-events-none absolute bottom-full left-2.5 -ml-px size-0 border-[6px] border-solid border-transparent"
                style={
                  {
                    borderBottomColor: "rgb(252, 231, 243)",
                    "--tw-bg-opacity": "1",
                  } as React.CSSProperties
                }
              />

              <p
                data-testid="form-group-error"
                className="relative mt-0.5 inline-block rounded-md bg-primary-300 px-2 py-1 text-xs text-primary-900"
              >
                {errors.join(", ")}
              </p>

              <div className="pointer-events-none absolute bottom-full left-2.5 size-0 border-[6px] border-transparent" />
            </div>
          )}

          {hintText && (
            <p
              data-testid="form-group-hint"
              className="mt-0.5 text-xs text-gray-700 dark:text-gray-600"
            >
              {hintText}
            </p>
          )}
        </Stack>
      </HStack>
    );
  }

  return (
    <div>
      {labelText && (
        <label
          htmlFor={formFieldId}
          data-testid="form-group-label"
          className="block text-sm font-medium text-gray-900 dark:text-gray-100"
          title={labelTitle}
        >
          {labelText}
        </label>
      )}

      <div className="mt-1 dark:text-white">
        {hintText && (
          <p
            data-testid="form-group-hint"
            className="mb-0.5 text-xs text-gray-700 dark:text-gray-600"
          >
            {hintText}
          </p>
        )}

        {firstChild}
        {inputChildren.filter((_, i) => i !== 0)}

        {hasError && (
          <div className="relative">
            <div
              className="pointer-events-none absolute bottom-full left-2.5 -ml-px size-0 border-[6px] border-solid border-transparent"
              style={
                {
                  borderBottomColor: "rgb(252, 231, 243)",
                  "--tw-bg-opacity": "1",
                } as React.CSSProperties
              }
            />

            <p
              data-testid="form-group-error"
              className="relative mt-0.5 inline-block rounded-md bg-primary-300 px-2 py-1 text-xs text-primary-900"
            >
              {errors.join(", ")}
            </p>

            <div className="pointer-events-none absolute bottom-full left-2.5 size-0 border-[6px] border-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormGroup;
