import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowElbowDownRight, Quotes, Warning } from "@phosphor-icons/react";

import { getRelativeDate } from "@/lib/date";
import { useMarkdown } from "@/hooks/use-mdx";
import { TModelKey } from "@/hooks/use-model-list";
import { useChatContext } from "@/context/chat/context";
import { PromptProps, TChatMessage } from "@/hooks/use-chat-session";

import { Avatar } from "./ui/avatar";
import { AIMessageBubble } from "./ai-bubble";
import { LabelDivider } from "./ui/label-divider";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export type TRenderMessageProps = {
  id: string;
  humanMessage: string;
  props?: PromptProps;
  image?: string;
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
    const { id, humanMessage, aiMessage, loading, model } = props;

    return (
      <div className="flex flex-col gap-1 items-start w-full" key={id}>
        {props.props?.context && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 1, ease: "easeInOut" },
            }}
            className="bg-zinc-800 text-zinc-200 dark:bg-black/30 bg-transparent rounded-2xl p-2 pl-3 text-sm flex flex-row gap-2 pr-4 border hover:border-white/5 border-transparent"
          >
            <ArrowElbowDownRight
              size={20}
              weight="fill"
              className="flex-shrink-0"
            />
            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {props.props?.context}
            </span>
          </motion.div>
        )}
        {props?.props?.image && (
          <Image
            src={props?.props?.image}
            alt="uploaded image"
            width={0}
            height={0}
            className="rounded-2xl min-w-[120px] h-[120px] border border-white/5 rotate-6 shadow-md object-cover"
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          className="bg-zinc-800 text-zinc-200 dark:bg-black/30 bg-transparent rounded-2xl p-2 text-sm flex flex-row gap-2 pr-4"
        >
          <Avatar name="Chat" size="sm" />
          <span className="pt-[0.20em] pb-[0.15em] leading-6">
            {humanMessage}
          </span>
        </motion.div>
        <AIMessageBubble {...props} />
      </div>
    );
  };

  const messagesByDate = currentSession?.messages.reduce(
    (acc: TMessageListByDate, message) => {
      moment.locale("id");
      const date = moment(message.createdAt).format("DD MMMM YYYY");
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
      id="chat-container"
      className="flex flex-col no-scrollbar w-full items-center h-screen overflow-y-auto pt-[60px] pb-[200px]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut" },
        }}
        className="w-[620px] flex flex-col gap-8"
      >
        {messagesByDate &&
          Object.keys(messagesByDate).map((date) => {
            return (
              <div className="flex flex-col" key={date}>
                <LabelDivider label={getRelativeDate(date)} />
                <div className="flex flex-col gap-4 w-full items-start">
                  {messagesByDate[date].map((message) =>
                    renderMessage({
                      id: message.id,
                      humanMessage: message.rawHuman,
                      model: message.model,
                      image: message.image,
                      props: message.props,
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
            id: "streaming",
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            image: streamingMessage.props?.image,
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
