"use client";

import { useParams } from "next/navigation";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";

const ChatSessionPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="w-full h-screen flex flex-row relative overflow-hidden">
      <div className="absolute top-0 left-0 h-16 bg-gradient-to-b dark:from-zinc-800 dark:to-transparent from-70% to-white/10 z-10"></div>
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;
