import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowElbowDownRight, Quotes, Warning } from "@phosphor-icons/react";

import { TModelKey } from "@/hooks/use-model-list";
import { useChatContext } from "@/context/chat/context";
import { PromptProps, TChatMessage } from "@/hooks/use-chat-session";

import { Avatar } from "./ui/avatar";
import { AIMessageBubble } from "./ai-bubble";
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
  const { currentSession } = useChatContext();
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  // useEffect(() => {
  //   if (streamingMessage) {
  //     scrollToBottom();
  //   }
  // }, [streamingMessage]);

  // const isLastStreamBelongsToCurrentSession =
  //   streamingMessage?.sessionId === currentSession?.id;

  const renderMessage = (message: TChatMessage, isLast: boolean) => {
    return (
      <div className="flex flex-col gap-1 items-end w-full" key={message.id}>
        {message.props?.context && (
          <div className="bg-black/10 text-zinc-600 dark:text-zinc-100 dark:bg-black/30 rounded-2xl p-2 pl-3 text-sm flex flex-row gap-2 pr-4 border hover:border-white/5 border-transparent">
            <ArrowElbowDownRight
              size={20}
              weight="fill"
              className="flex-shrink-0"
            />
            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {message.props?.context}
            </span>
          </div>
        )}
        {message?.props?.image && (
          <Image
            src={message?.props?.image}
            alt="uploaded image"
            width={0}
            height={0}
            sizes="50vw"
            className="rounded-2xl min-w-[120px] h-[120px] border border-white/5 rotate-6 shadow-md object-cover"
          />
        )}
        <div className="bg-black/10 text-zinc-600 dark:bg-black/30 rounded-2xl p-2 text-sm flex flex-row gap-2 pr-4">
          <span className="pt-[0.20em] pb-[0.15em] leading-6">
            {message.rawHuman}
          </span>
        </div>

        <AIMessageBubble chatMessage={message} isLast={isLast} />
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

  console.log(messagesByDate);

  return (
    <div
      className="flex flex-col w-full items-center h-screen overflow-y-auto pt-[60px] pb-[200px] no-scrollbar"
      ref={chatContainer}
      id="chat-container"
    >
      <div className="w-[700px] flex flex-col gap-24">
        {/* {messagesByDate &&
          Object.keys(messagesByDate).map((date) => {
            return (
              <div className="flex flex-col" key={date}>
                <LabelDivider label={getRelativeDate(date)} />
                <div className="flex flex-col gap-8 w-full items-start">
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
          })} */}

        <div className="flex flex-col gap-8 w-full items-start">
          {currentSession?.messages?.map((message, index) =>
            renderMessage(
              message,
              currentSession?.messages.length - 1 === index
            )
          )}
        </div>

        {/* {isLastStreamBelongsToCurrentSession &&
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
        )} */}
      </div>
    </div>
  );
};
