import { useRef } from "react";
import { motion } from "framer-motion";
import { encodingForModel } from "js-tiktoken";
import {
  ArrowClockwise,
  BookmarkSimple,
  Check,
  Copy,
  Info,
  TrashSimple,
} from "@phosphor-icons/react";

import { useMarkdown } from "@/hooks/use-mdx";
import { useClipboard } from "@/hooks/use-clipboard";
import { useModelList } from "@/hooks/use-model-list";
import { useChatContext } from "@/context/chat/context";
import { TChatMessage } from "@/hooks/use-chat-session";

import { Button } from "./ui/button";
import Spinner from "./ui/loading-spinner";
import { TRenderMessageProps } from "./chat-messages";
import { Tooltip } from "./ui/tooltip";

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { id, humanMessage, aiMessage, loading, model } = props;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();
  const { removeMessage } = useChatContext();

  const modelForMessage = getModelByKey(model);

  const handleCopyContent = () => {
    messageRef?.current && aiMessage && copy(aiMessage);
  };

  const getTokenCount = (
    message: Partial<Pick<TChatMessage, "model" | "rawAI">>
  ) => {
    const enc = encodingForModel("gpt-3.5-turbo");

    if (message.rawAI) {
      return enc.encode(message.rawAI).length;
    }

    return undefined;
  };

  const tokenCount = getTokenCount({ model, rawAI: aiMessage });

  return (
    <motion.div
      ref={messageRef}
      className="dark:bg-white/5 bg-black/5 hover:bg-zinc-100 rounded-2xl px-4 w-full flex flex-col items-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: "easeInOut" },
      }}
    >
      {aiMessage && (
        <div className="pt-4 pb-2 w-full">
          {renderMarkdown(aiMessage, id === "streaming")}
        </div>
      )}
      <div className="flex flex-row items-center justify-between w-full py-1 opacity-50 hover:opacity-100 transition-opacity">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          className="text-zinc-500 text-xs py-1/2 gap-4 flex flex-row items-center"
        >
          <span className="flex flex-row gap-2 items-center">
            {" "}
            {modelForMessage?.icon()}
            {loading ? <Spinner /> : modelForMessage?.name}{" "}
          </span>
          {tokenCount && (
            <Tooltip content="Estimated output tokens">
              <span className="flex flex-row gap-1 p-2 items-center cursor-pointer">
                {`${getTokenCount({ model, rawAI: aiMessage })} tokens`}
                <Info size={14} weight="bold" />
              </span>
            </Tooltip>
          )}
        </motion.p>
        {!loading && (
          <div className="flex flex-row gap-1">
            <Tooltip content="Copy">
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handleCopyContent}
              >
                {showCopied ? (
                  <Check size={16} weight="regular" />
                ) : (
                  <Copy size={16} weight="regular" />
                )}
              </Button>
            </Tooltip>
            <Tooltip content="Regenerate">
              <Button variant={"ghost"} size={"icon"}>
                <ArrowClockwise size={16} weight="regular" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete">
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  removeMessage(id);
                }}
              >
                <TrashSimple size={16} weight="regular" />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    </motion.div>
  );
};
