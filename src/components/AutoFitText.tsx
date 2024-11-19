// src/components/AutoFitText.tsx

import React, { useRef, useEffect, useState } from "react";

interface AutoFitTextProps {
  text: string;
  maxFontSize: number;
  minFontSize: number;
  maxLines: number;
  style?: React.CSSProperties;
  className?: string;
  textAlign?: "left" | "center" | "right"; // New prop for text alignment
}

const AutoFitText: React.FC<AutoFitTextProps> = ({
  text,
  maxFontSize,
  minFontSize,
  maxLines,
  style = {},
  className = "",
  textAlign = "center", // Default alignment
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (container && textEl) {
      let currentFontSize = maxFontSize;
      textEl.style.fontSize = `${currentFontSize}px`;

      while (
        (textEl.scrollHeight > container.offsetHeight ||
          textEl.scrollWidth > container.offsetWidth) &&
        currentFontSize > minFontSize
      ) {
        currentFontSize -= 0.5; // Decrease font size incrementally
        textEl.style.fontSize = `${currentFontSize}px`;
      }

      setFontSize(currentFontSize);
    }
  }, [text, maxFontSize, minFontSize, maxLines]);

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        overflow: "hidden",
        display: "block",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={className}
    >
      <div
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          textAlign: textAlign, // Apply text alignment based on prop
          maxHeight: `${fontSize * maxLines}px`,
          lineHeight: `${fontSize}px`,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          wordWrap: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default AutoFitText;
