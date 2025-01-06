import { JSX } from "react";
import Markdown from "marked-react";
import { motion } from "framer-motion";

import { CodeBlock } from "@/components/codeblock";

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
      delay: 0.1,
    },
  },
};

export const useMarkdown = () => {
  const renderMarkdown = (message: string, animate: boolean) => {
    return (
      <Markdown
        renderer={{
          text: (children) => (
            <motion.span
              variants={variants}
              animate={"visible"}
              initial={animate ? "hidden" : "visible"}
              className="dark:text-zinc-100 text-zinc-700"
            >
              {children}
            </motion.span>
          ),
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
          list: (children, ordered) => {
            if (ordered) {
              return (
                <motion.ol
                  className="list-decimal ml-8"
                  initial="hidden"
                  animate="visible"
                >
                  {children}
                </motion.ol>
              );
            }
            return (
              <motion.ul
                className="list-disc ml-8"
                initial="hidden"
                animate="visible"
              >
                {children}
              </motion.ul>
            );
          },
          listItem: (children) => (
            <motion.li className="my-4" initial="hidden" animate="visible">
              <p className="text-sm leading-7">{children}</p>
            </motion.li>
          ),
          strong: (children) => (
            <motion.strong
              initial="hidden"
              animate="visible"
              className="font-semibold"
            >
              {children}
            </motion.strong>
          ),
          code: (code, lang) => {
            return (
              <motion.div
                className="my-4 w-full flex-shrink-0"
                initial="hidden"
                animate="visible"
              >
                <CodeBlock lang={lang} code={code?.toString()} />
              </motion.div>
            );
          },
          codespan: (code, lang) => {
            return (
              <motion.span
                initial="hidden"
                animate="visible"
                className="px-1.5 py-0 text-xs rounded-md dark:text-[#41db8f] bg-zinc-200 text-zinc-600 dark:bg-[#41db8f]/20 font-semibold"
              >
                {code}
              </motion.span>
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
