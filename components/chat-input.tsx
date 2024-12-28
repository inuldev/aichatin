"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useChatContext } from "@/context/chat/context";
import { Input } from "./ui/input";
import { PromptType, RoleType } from "@/hooks/use-chat-session";

export const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const { runModel } = useChatContext();

  return (
    <div className="w-full h-8 flex flex-row bg-gray-100">
      <Input
        placeholder="Ask me anything..."
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            runModel(
              {
                role: RoleType.assistant,
                type: PromptType.ask,
                query: inputValue,
              },
              sessionId!.toString()
            );
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};