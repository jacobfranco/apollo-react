import React from "react";
import { FormattedMessage } from "react-intl";

import { Stack, Text } from "src/components";

interface ISpinner {
  /** Width and height of the spinner in pixels. */
  size?: number;
}

/** Spinning loading placeholder. */
const Spinner = ({ size = 30 }: ISpinner) => {
  return (
    <Stack space={2} justifyContent="center" alignItems="center">
      <div className="relative" style={{ width: size, height: size }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 animate-spin dark:opacity-80 opacity-60"
            style={{
              border: "2px solid transparent",
              borderTopColor: "#A981FC",
              borderRadius: "50%",
              animationDuration: `${1 + i * 0.5}s`,
              transform: `rotate(${-69 * i}deg) scale(${1 - i * 0.15})`,
            }}
          />
        ))}
        <div
          className="absolute inset-1/3 rounded-full animate-ping"
          style={{
            backgroundColor: "#A981FC",
            animationDuration: "2s",
          }}
        />
      </div>
    </Stack>
  );
};

export default Spinner;
