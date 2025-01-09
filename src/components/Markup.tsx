import parse, {
  HTMLReactParserOptions,
  Text as DOMText,
  DOMNode,
  Element,
  domToReact,
} from "html-react-parser";
import { forwardRef } from "react";

import HashtagLink from "src/components/HashtagLink";
import Mention from "src/components/Mention";
import { Mention as MentionEntity } from "src/schemas/mention";

import Text, { IText } from "./Text";
import "./Markup.css";

interface IMarkup extends Omit<IText, "children" | "dangerouslySetInnerHTML"> {
  html: { __html: string };
  mentions?: MentionEntity[];
}

/** Styles HTML markup returned by the API, such as in account bios and statuses. */
const Markup = forwardRef<any, IMarkup>(({ html, mentions, ...props }, ref) => {
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (
        domNode instanceof Element &&
        ["script", "iframe"].includes(domNode.name)
      ) {
        return null;
      }

      if (domNode instanceof Element && domNode.name === "a") {
        const classes = domNode.attribs.class?.split(" ");

        if (classes?.includes("hashtag")) {
          const child = domToReact(domNode.children as DOMNode[]);

          const hashtag: string | undefined = (() => {
            // Mastodon wraps the hashtag in a span, with a sibling text node containing the hashtag.
            if (Array.isArray(child) && child.length) {
              if (
                child[0]?.props?.children === "#" &&
                typeof child[1] === "string"
              ) {
                return child[1];
              }
            }
            // Pleroma renders a string directly inside the hashtag link.
            if (typeof child === "string") {
              return child.replace(/^#/, "");
            }
          })();

          if (hashtag) {
            return <HashtagLink hashtag={hashtag} />;
          }
        }

        if (classes?.includes("mention")) {
          const mention = mentions?.find(
            ({ url }) => domNode.attribs.href === url
          );
          if (mention) {
            return <Mention mention={mention} />;
          }
        }

        return (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <a
            {...domNode.attribs}
            onClick={(e) => e.stopPropagation()}
            rel="nofollow noopener"
            target="_blank"
            title={domNode.attribs.href}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </a>
        );
      }
    },
  };

  const content = parse(html.__html, options);

  return (
    <Text ref={ref} {...props} data-markup>
      {content}
    </Text>
  );
});

export default Markup;
