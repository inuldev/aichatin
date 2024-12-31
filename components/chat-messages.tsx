import moment from "moment";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Warning } from "@phosphor-icons/react";

import { getRelativeDate } from "@/lib/date";
import { useMarkdown } from "@/hooks/use-mdx";
import { TModelKey } from "@/hooks/use-model-list";
import { useChatContext } from "@/context/chat/context";
import { TChatMessage } from "@/hooks/use-chat-session";

import { Avatar } from "./ui/avatar";
import { AIMessageBubble } from "./ai-bubble";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export type TRenderMessageProps = {
  key: string;
  humanMessage: string;
  model: TModelKey;
  aiMessage?: string;
  loading?: boolean;
};

export type TMessageListByDate = Record<string, TChatMessage[]>;

export const ChatMessages = () => {
  const { streamingMessage, currentSession } = useChatContext();
  const { renderMarkdown } = useMarkdown();

  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (streamingMessage) {
      scrollToBottom();
    }
  }, [streamingMessage]);

  const isLastStreamBelongsToCurrentSession =
    streamingMessage?.sessionId === currentSession?.id;

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
          <Avatar name="Chat" size="sm" />
          <span className="pt-1 leading-5">{humanMessage}</span>
        </motion.div>
        <AIMessageBubble {...props} />
      </div>
    );
  };

  const messagesByDate = currentSession?.messages.reduce(
    (acc: TMessageListByDate, message) => {
      const date = moment(message.createdAt).format("DD/MM/YYYY");
      if (!acc?.[date]) {
        acc[date] = [message];
      } else {
        acc[date] = [...acc[date], message];
      }
      return acc;
    },
    {}
  );

  return (
    <div
      ref={chatContainer}
      className="flex flex-col w-full items-center h-screen overflow-y-auto pt-[60px] pb-[200px]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut" },
        }}
        className="w-[600px] flex flex-col gap-8"
      >
        {messagesByDate &&
          Object.keys(messagesByDate).map((date) => {
            return (
              <div className="flex flex-col" key={date}>
                <div className="flex flex-row items-center w-full pb-4 pt-8">
                  <div className="w-full h-[1px] bg-white/5"></div>
                  <p className="px-2 text-zinc-500 text-xs flex-shrink-0">
                    {getRelativeDate(date)}
                  </p>
                  <div className="w-full h-[1px] bg-white/5"></div>
                </div>
                <div className="flex flex-col gap-4 w-full items-start">
                  {messagesByDate[date].map((message) =>
                    renderMessage({
                      key: message.id,
                      humanMessage: message.rawHuman,
                      model: message.model,
                      aiMessage: message.rawAI,
                    })
                  )}
                </div>
              </div>
            );
          })}

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
