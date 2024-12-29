import { JSX } from "react";
import Markdown from "marked-react";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/codeblock";

export const useMarkdown = () => {
  const renderMarkdown = (message: string) => {
    return (
      <Markdown
        renderer={{
          paragraph: (children) => (
            <p className="text-sm leading-7">{children}</p>
          ),
          heading: (children, level) => {
            const Heading = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <Heading className="font-medium text-md">{children}</Heading>
            );
          },
          link: (href, text) => {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {text}
              </a>
            );
          },
          blockquote: (children) => (
            <div>
              <p className="text-sm leading-7">{children}</p>
            </div>
          ),
          list: (children, ordered) =>
            ordered ? <ol>{children}</ol> : <ul>{children}</ul>,
          listItem: (children) => (
            <li>
              <p>{children}</p>
            </li>
          ),
          code: (code, lang) => {
            return (
              <div className="my-4">
                <CodeBlock lang={lang} code={code?.toString()} />
              </div>
            );
          },
          codespan: (code, lang) => {
            return (
              <span className="px-2 py-1 text-xs rounded-md text-purple-300 bg-purple-600/30">
                {code}
              </span>
            );
          },
        }}
      >
        {message}
      </Markdown>
    );
  };

  return { renderMarkdown };
};
