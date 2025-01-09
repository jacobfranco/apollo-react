import { enableMapSet } from "immer";
import { createRoot } from "react-dom/client";

import * as BuildConfig from "src/build-config.ts";
import Apollo from "src/init/Apollo";
import { printConsoleWarning } from "src/utils/console.ts";

import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import "@fontsource/vazirmatn/arabic.css";
import "@fontsource/noto-sans-javanese/javanese.css";
import "@fontsource/roboto-mono/400.css";
import "line-awesome/dist/font-awesome-line-awesome/css/all.css";

import "./iframe.ts";
import "./styles/tailwind.css";

import ready from "./ready.ts";
import { registerSW, lockSW } from "./utils/sw.ts";

enableMapSet();

if (BuildConfig.NODE_ENV === "production") {
  printConsoleWarning();
  registerSW("/sw.js");
  lockSW();
}

ready(() => {
  const container = document.getElementById("apollo") as HTMLElement;
  const root = createRoot(container);

  root.render(<Apollo />);
});
