import hljs from "highlight.js";
import { useEffect, useRef } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

import { Button } from "./ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { Tooltip } from "./ui/tooltip";

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const { copiedText, copy, showCopied } = useClipboard();
  const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(code, { language }).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <div className="bg-black/20 rounded-2xl p-4 w-full flex-shrink-0">
      <div className="pl-4 pr-2 py-2 w-full flex justify-between items-center">
        <p>{language}</p>
        <Tooltip content={showCopied ? "Copied" : "Copy"}>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => code && copy(code)}
          >
            {showCopied ? <CheckIcon /> : <CopyIcon />}
            {showCopied ? "Copied" : "Copy"}
          </Button>
        </Tooltip>
      </div>
      <pre className="w-full">
        <code
          className={`hljs language-${language} whitespace-pre-wrap break-words overflow-x-auto w-full inline-block pr-[100%] text-sm`}
          ref={ref}
        />
      </pre>
    </div>
  );
};
