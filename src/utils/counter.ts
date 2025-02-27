import { urlRegex } from "./url-regex";

const urlPlaceholder = "xxxxxxxxxxxxxxxxxxxxxxx";

export function countableText(inputText: string) {
  return inputText
    .replace(urlRegex, urlPlaceholder)
    .replace(/(^|[^/\w])@(([a-z0-9_]+)@[a-z0-9.-]+[a-z0-9]+)/gi, "$1@$3");
}
