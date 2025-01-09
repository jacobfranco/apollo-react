import { Picker as EmojiPicker } from "emoji-mart";
import { useRef, useEffect } from "react";

import data from "../data.ts";

const Picker: React.FC<any> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const input = { ...props, data, ref: containerRef };
      new EmojiPicker(input);
    }
  }, [props]);

  return <div className="flex justify-center" ref={containerRef} />;
};

export default Picker;
