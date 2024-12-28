import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import { Button } from "./ui/button";

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(language, code).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <div className="hljs-wrapper">
      <div className="">
        <p>{language}</p>
        <Button size={"icon"} onClick={() => code}>
          Copy
        </Button>
      </div>
      <pre>
        <code className={`hljs language-${language}`} ref={ref} />
      </pre>
    </div>
  );
};
