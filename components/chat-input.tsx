"use client";

import { useEffect, useRef, useState } from "react";
import { Command, Plus, Sparkle } from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-white dark:from-zinc-800 dark:to-transparent from-70% to-white/10 left-0 right-0 gap-4",
        isNewSession && "top-0"
      )}
    >
      {isNewSession && (
        <div className="flex flex-col items-center h-[200px] gap-2">
          <div className="text-xl w-16 h-16 border bg-black/10 border-white/10 rounded-full flex items-center justify-center">
            <Sparkle size={24} weight="bold" className="text-green-400" />
          </div>
          <h1 className="text-lg tracking-tight text-zinc-500">
            How can i help you today?
          </h1>
        </div>
      )}
      <div className="flex flex-row items-center px-3 bg-white/10 w-[700px] rounded-2xl">
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
      {isNewSession && (
        <div className="grid grid-cols-2 gap-2 w-[700px]">
          {examples?.map((example, index) => (
            <div
              key={index}
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
              className="flex flex-row items-center text-sm py-3 px-4 bg-black/10 border border-white/5 text-zinc-400 w-full rounded-2xl hover:bg-black/20 hover:scale-[101%] cursor-pointer"
            >
              {example}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
