import Avatar from "boring-avatars";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { useMarkdown } from "@/hooks/use-mdx";
import { useChatContext } from "@/context/chat/context";

export const ChatMessages = () => {
  const { sessionId } = useParams();

  const { lastStream, currentSession, error } = useChatContext();
  const { renderMarkdown } = useMarkdown();

  useEffect(() => {
    if (!lastStream) {
      scrollToBottom();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === currentSession?.id;

  const chatContainer = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const renderMessage = (
    key: string,
    humanMessage: string,
    aiMessage: string
  ) => {
    return (
      <div className="flex flex-col gap-1 items-start w-full" key={key}>
        <div className="bg-black/30 rounded-2xl p-2 text-sm flex flex-row gap-2 pr-4 border border-white/5">
          <Avatar name="Chat" />
          <span className="pt-1 leading-5">{humanMessage}</span>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 w-full border border-white/5">
          {renderMarkdown(aiMessage)}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col w-full items-center h-screen overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
    >
      <div className="w-[600px] flex flex-col gap-8">
        {currentSession?.messages.map((message) =>
          renderMessage(message.id, message.rawHuman, message.rawAI)
        )}
        {isLastStreamBelongsToCurrentSession &&
          lastStream?.props?.query &&
          renderMessage("last", lastStream?.props?.query, lastStream?.message)}
        {error && (
          <div className="text-red-500">
            {renderMessage("error", "Ahh!", error)}
          </div>
        )}
      </div>
    </div>
  );
};
