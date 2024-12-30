"use client";

import { useEffect, useRef, useState } from "react";
import { Command, Plus } from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";

import { useChatContext } from "@/context/chat/context";
import { PromptType, RoleType } from "@/hooks/use-chat-session";

import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const { runModel, currentSession, createSession } = useChatContext();
  const router = useRouter();
  const isNewSession = !currentSession?.messages?.length;

  const examples = [
    "What is quantum computing?",
    "What are qubits?",
    "What is GDP of Wakanda?",
    "What is multi planetary launch system?",
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionId) {
      inputRef?.current?.focus();
    }
  }, [sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: inputValue,
        },
        sessionId!.toString()
      );
      setInputValue("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-white dark:from-zinc-800 dark:to-transparent from-70% to-white/10 left-0 right-0">
      {isNewSession && (
        <div className="grid grid-cols-2 gap-2 mb-4 w-[700px]">
          {examples?.map((example, index) => (
            <div
              key={index}
              className="flex flex-row items-center text-sm py-3 px-4 bg-black/10 border border-white/5 text-zinc-400 w-full rounded-2xl hover:bg-black/20 hover:scale-[101%] cursor-pointer"
              onClick={() => {
                runModel(
                  {
                    role: RoleType.assistant,
                    type: PromptType.ask,
                    query: example,
                  },
                  sessionId!.toString()
                );
              }}
            >
              {example}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-row items-center gap-3 bg-white/10 w-[700px] rounded-2xl">
        <Button
          size={"icon"}
          className="min-w-8 h-8"
          onClick={() => {
            createSession().then((session) => {
              router.push(`/chat/${session.id}`);
            });
          }}
        >
          <Plus size={16} weight="bold" />
        </Button>
        <Input
          value={inputValue}
          ref={inputRef}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          variant={"ghost"}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
        />
        <Badge>
          <Command size={14} weight="bold" />K
        </Badge>
      </div>
    </div>
  );
};
