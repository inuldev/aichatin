import Avatar from "boring-avatars";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Warning } from "@phosphor-icons/react";

import { useMarkdown } from "@/hooks/use-mdx";
import { TModelKey } from "@/hooks/use-model-list";
import { useChatContext } from "@/context/chat/context";

import Spinner from "./ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export type TRenderMessageProps = {
  key: string;
  humanMessage: string;
  model: TModelKey;
  aiMessage?: string;
  loading?: boolean;
};

export const ChatMessages = () => {
  const { streamingMessage, currentSession } = useChatContext();
  const { renderMarkdown } = useMarkdown();

  useEffect(() => {
    if (streamingMessage) {
      scrollToBottom();
    }
  }, [streamingMessage]);

  const isLastStreamBelongsToCurrentSession =
    streamingMessage?.sessionId === currentSession?.id;

  const chatContainer = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const renderMessage = (props: TRenderMessageProps) => {
    const { key, humanMessage, aiMessage, loading, model } = props;

    return (
      <div className="flex flex-col gap-1 items-start w-full" key={key}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          className="bg-black/30 rounded-2xl p-2 text-sm flex flex-row gap-2 pr-4 border border-white/5"
        >
          <Avatar name="Chat" />
          <span className="pt-1 leading-5">{humanMessage}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          className="bg-white/5 rounded-2xl p-4 w-full border border-white/5"
        >
          {aiMessage && renderMarkdown(aiMessage, key === "streaming")}
          {loading && <Spinner />}
        </motion.div>
        <motion.p
          className="text-zinc-500 text-xs py-1/2 px-2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
          }}
        >
          {model}
        </motion.p>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col w-full items-center h-screen overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut" },
        }}
        className="w-[600px] flex flex-col gap-8"
      >
        {currentSession?.messages.map((message) =>
          renderMessage({
            key: message.id,
            humanMessage: message.rawHuman,
            model: message.model,
            aiMessage: message.rawAI,
          })
        )}

        {isLastStreamBelongsToCurrentSession &&
          streamingMessage?.props?.query &&
          !streamingMessage?.error &&
          renderMessage({
            key: "streaming",
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            model: streamingMessage?.model,
            loading: streamingMessage?.loading,
          })}
        {streamingMessage?.error && (
          <Alert variant="destructive">
            <Warning size={20} weight="bold" />
            <AlertTitle>Ahh! something went wrong</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
};
