import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowClockwise,
  BookmarkSimple,
  Check,
  Copy,
  TrashSimple,
} from "@phosphor-icons/react";

import { useMarkdown } from "@/hooks/use-mdx";
import { useClipboard } from "@/hooks/use-clipboard";
import { useModelList } from "@/hooks/use-model-list";

import { Button } from "./ui/button";
import Spinner from "./ui/loading-spinner";
import { TRenderMessageProps } from "./chat-messages";

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { key, humanMessage, aiMessage, loading, model } = props;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();

  const modelForMessage = getModelByKey(model);

  const handleCopyContent = () => {
    messageRef?.current && aiMessage && copy(aiMessage);
  };

  return (
    <motion.div
      ref={messageRef}
      className="bg-white/5 rounded-2xl p-4 pt-4 pb-2 w-full border border-white/5 flex flex-col items-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: "easeInOut" },
      }}
    >
      {aiMessage && renderMarkdown(aiMessage, key === "streaming")}
      {loading && <Spinner />}
      <div className="flex flex-row items-center justify-between w-full py-1 opacity-50 hover:opacity-100 transition-opacity">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          className="text-zinc-500 text-xs py-1/2 gap-2 flex flex-row items-center"
        >
          {modelForMessage?.icon()}
          {modelForMessage?.name}
        </motion.p>
        {!loading && (
          <div className="flex flex-row gap-1">
            <Button variant={"ghost"} size={"icon"} onClick={handleCopyContent}>
              {showCopied ? (
                <Check size={16} weight="regular" />
              ) : (
                <Copy size={16} weight="regular" />
              )}
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <ArrowClockwise size={16} weight="regular" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
