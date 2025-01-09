import { JSX } from "react";
import Markdown from "marked-react";
import { motion } from "framer-motion";

import { CodeBlock } from "@/components/codeblock";
import { LinkBlock } from "@/components/ui/link-block";

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 3,
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
              className="dark:text-zinc-100 text-zinc-700 tracking-[0.01em]"
              animate={"visible"}
              initial={animate ? "hidden" : "visible"}
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
              <Heading key={level} className="font-medium text-md">
                {children}
              </Heading>
            );
          },
          link: (href, text) => {
            return <LinkBlock url={href} />;
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
