"use client";

import { useParams } from "next/navigation";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";

const ChatSessionPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="w-full h-screen flex flex-row">
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;
