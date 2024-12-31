"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowElbowDownLeft, Plus, Sparkle } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useChatContext } from "@/context/chat/context";
import { PromptType, RoleType } from "@/hooks/use-chat-session";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

const slideUpVariant = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const zoomVariant = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut", delay: 1 },
  },
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const { runModel, currentSession, createSession, streamingMessage } =
    useChatContext();
  const router = useRouter();

  const isNewSession =
    !currentSession?.messages?.length && !streamingMessage?.loading;

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
        "w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-white dark:from-zinc-800 dark:to-transparent from-70% to-white/10 left-0 right-0 gap-6",
        isNewSession && "top-0"
      )}
    >
      {isNewSession && (
        <div className="flex flex-row items-center w-[680px] justify-start gap-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            className="text-2xl font-semibold tracking-tight text-zinc-100"
          >
            <span className="text-zinc-400">Hello!👋</span>
            <br />
            What can I help you with?🤖
          </motion.h1>
        </div>
      )}
      <motion.div
        variants={slideUpVariant}
        initial="initial"
        animate="animate"
        className="flex flex-row items-center px-3 bg-white/10 w-[700px] rounded-2xl"
      >
        {isNewSession ? (
          <div className="min-w-8 h-8 flex justify-center items-center">
            <Sparkle size={24} weight="fill" />
          </div>
        ) : (
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
        )}
        <Input
          value={inputValue}
          ref={inputRef}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          variant={"ghost"}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
        />
        <div className="min-w-8 h-8 flex justify-center items-center">
          <ArrowElbowDownLeft size={16} weight="bold" />K
        </div>
      </motion.div>

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
