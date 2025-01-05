"use client";

import { Navbar } from "@/components/navbar";
import { ChatInput } from "@/components/chat-input";
import { useChatContext } from "@/context/chat/context";
import { ChatMessages } from "@/components/chat-messages";

import Spinner from "@/components/ui/loading-spinner";

const ChatSessionPage = () => {
  const { isCurrentSessionLoading, isAllSessionLoading } = useChatContext();

  const renderLoader = () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  };

  const isLoading = isCurrentSessionLoading || isAllSessionLoading;

  return (
    <div className="w-full h-screen flex flex-row relative overflow-hidden">
      <Navbar />
      {isLoading && renderLoader()}
      {!isLoading && (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatSessionPage;
