"use client";

import { useParams } from "next/navigation";

import { ChatInput } from "@/components/chat-input";

const ChatSessionPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="w-full h-screen flex flex-row">
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;
