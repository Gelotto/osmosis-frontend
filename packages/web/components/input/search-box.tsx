import { cva, VariantProps } from "class-variance-authority";
import classNames from "classnames";
import { debounce } from "debounce";
import {
  type ChangeEvent,
  type DOMAttributes,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";

import { Icon } from "~/components/assets";
import { CustomClasses, Disableable, InputProps } from "~/components/types";

const searchBoxClasses = cva(
  "flex flex-nowrap items-center justify-between gap-2 rounded-xl border border-osmoverse-500 relative transition-colors [&_input]:placeholder:text-osmoverse-500 [&_input]:placeholder:font-medium",
  {
    variants: {
      /**
       * Sizes modify the following properties:
       * - height
       * - width
       * - padding
       * - font size
       * - font weight
       * - line height
       * - letter spacing
       */
      size: {
        small: "h-10 pl-5 pr-1 w-max [&_input]:text-body2 [&_input]:font-body2",
        medium:
          "h-12 pl-5 pr-2 w-max [&_input]:text-body2 [&_input]:font-body2",
        large: "h-14 pl-5 pr-3 w-max [&_input]:text-body1 [&_input]:font-body2",
        long: "h-14 pl-5 pr-3 w-80 [&_input]:text-body1 [&_input]:font-body2",
        full: "h-14 pl-5 pr-3 w-full [&_input]:text-body1 [&_input]:font-body2",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

type SearchBoxProps = Omit<InputProps<string>, "currentValue"> &
  Disableable &
  CustomClasses &
  VariantProps<typeof searchBoxClasses> & {
    type?: string;
    currentValue?: string;
    /**
     * adds the ability to output the searchbox event using a debounce effect,
     * which is useful to avoid making too many requests.
     */
    debounce?: number;
    onKeyDown?: DOMAttributes<HTMLInputElement>["onKeyDown"];
    onFocusChange?: (isFocused: boolean) => void;
    rightIcon?: () => React.ReactNode;
  };

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  function SearchBox(
    {
      currentValue,
      onInput,
      onFocus,
      placeholder,
      type,
      disabled = false,
      autoFocus,
      className,
      onKeyDown,
      onFocusChange,
      size,
      rightIcon,
      debounce: _debounce,
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const _onInput = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        onInput(e.target.value);
      },
      [onInput]
    );

    const _debouncedOnInput = useMemo(
      () => (!_debounce ? _onInput : debounce(_onInput, _debounce)),
      [_debounce, _onInput]
    );

    return (
      <div
        className={classNames(
          searchBoxClasses({ size }),
          {
            "opacity-50": disabled,
            "border border-osmoverse-200": isFocused,
          },
          className
        )}
      >
        <div className="h-4 w-4 shrink-0 text-osmoverse-300">
          <Icon id="search" height={16} width={16} />
        </div>
        <label className="shrink grow">
          <input
            ref={ref}
            className="h-full w-full appearance-none bg-transparent tracking-wider transition-colors"
            defaultValue={_debounce ? currentValue : undefined}
            value={_debounce ? undefined : currentValue}
            type={type}
            autoFocus={autoFocus}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={(e: any) => {
              setIsFocused(true);
              onFocusChange?.(true);
              onFocus?.(e);
            }}
            onBlur={() => {
              setIsFocused(false);
              onFocusChange?.(false);
            }}
            onInput={_debouncedOnInput}
            disabled={disabled}
            onKeyDown={onKeyDown}
          />
        </label>
        {rightIcon && rightIcon()}
      </div>
    );
  }
);
