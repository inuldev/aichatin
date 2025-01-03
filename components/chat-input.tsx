"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Plus,
  Quotes,
  StarFour,
  StopCircle,
  X,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useFilters } from "@/context/filter/context";
import { useChatContext } from "@/context/chat/context";
import { PromptType, RoleType } from "@/hooks/use-chat-session";
import { useRecordVoice } from "@/hooks/use-record-voice";
import { useTextSelection } from "@/hooks/use-text-selection";
import useScrollToBottom from "@/hooks/use-scroll-to-bottom";

import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Spinner from "./ui/loading-spinner";
import { AudioWaveSpinner } from "./ui/audio-wave";

import { ModelSelect } from "./model-select";
import { ChatExamples } from "./chat-examples";
import moment from "moment";

const slideUpVariant = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export const zoomVariant = {
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
  const { open: openFilters } = useFilters();
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const [contexValue, setContexValue] = useState<string>("");
  const { runModel, currentSession, createSession, streamingMessage } =
    useChatContext();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();

  const isNewSession =
    !currentSession?.messages?.length && !streamingMessage?.loading;

  const examples = [
    {
      title: "What is the capital of Indonesia?",
      prompt: "What is the capital of Indonesia?",
    },
    {
      title: "What is quantum computing?",
      prompt: "What is quantum computing?",
    },
    { title: "What are qubits?", prompt: "What are qubits?" },
    {
      title: "What is multi planetary ideology?",
      prompt: "What is multi planetary ideology?",
    },
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
          context: contexValue,
        },
        sessionId!.toString()
      );
      setContexValue("");
      setInputValue("");
    }
  };

  useEffect(() => {
    if (text) {
      setInputValue(text);
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: text,
        },
        sessionId!.toString()
      );
      setInputValue("");
    }
  }, [text]);

  const renderGreeting = (name: string) => {
    const date = moment();
    const hours = date.get("hour");
    if (hours >= 0 && hours < 12) {
      return `Selamat pagi, ${name}!`;
    } else if (hours >= 12 && hours < 18) {
      return `Selamat siang, ${name}!`;
    } else {
      return `Selamat malam, ${name}!`;
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
        <div className="flex flex-row items-center w-[680px] justify-start gap-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            className="text-2xl font-semibold tracking-tight text-zinc-100"
          >
            <span className="text-zinc-500">{renderGreeting("Guest")} 👋</span>
            <br />
            How can I help you with? ✨
          </motion.h1>
        </div>
      )}
      <div className="flex flex-row items-center gap-2">
        {showButton && !showPopup && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={scrollToBottom}
              variant={"secondary"}
              size={"icon"}
            >
              <ArrowDown size={20} weight={"bold"} />
            </Button>
          </motion.span>
        )}
        {showPopup && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button onClick={() => {}} variant={"secondary"} size={"sm"}>
              <Quotes size={20} weight={"bold"} /> Reply
            </Button>
          </motion.span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <motion.div
          variants={slideUpVariant}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center bg-white/10 w-[700px] rounded-[1.25rem]"
        >
          <div className="flex flex-row items-center px-3 h-14 w-full gap-0">
            {isNewSession ? (
              <div className="min-w-8 h-8 flex justify-center items-center">
                <StarFour size={24} weight="fill" />
              </div>
            ) : (
              <Button
                size={"icon"}
                variant={"ghost"}
                className="min-w-8 h-8"
                onClick={() => {
                  createSession().then((session) => {
                    router.push(`/chat/${session.id}`);
                  });
                }}
              >
                <Plus size={20} weight="bold" />
              </Button>
            )}
            <Input
              value={inputValue}
              ref={inputRef}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              variant={"ghost"}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="px-2"
              autoComplete="off"
              autoCapitalize="off"
            />
            {recording ? (
              <div className="bg-black/50 rounded-xl px-2 py-1 h-10 flex flex-row items-center">
                <AudioWaveSpinner />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => stopRecording()}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <StopCircle
                    size={20}
                    weight="fill"
                    className="text-red-300"
                  />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => stopRecording()}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <X size={20} weight="bold" />
                </Button>
              </div>
            ) : transcribing ? (
              <Spinner />
            ) : (
              <Button
                size={"icon"}
                variant={"ghost"}
                className="min-w-8 h-8"
                onClick={() => {
                  startRecording();
                  setTimeout(() => {
                    stopRecording();
                  }, 20000);
                }}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
              >
                <Microphone size={20} weight="bold" />
              </Button>
            )}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="min-w-8 h-8 ml-1"
            >
              <ArrowUp size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex flex-row items-center w-full justify-start gap-2 p-2">
            <ModelSelect />
            <div className="flex-1"></div>
            <Button
              variant={"secondary"}
              size={"sm"}
              onClick={openFilters}
              className="px-1.5"
            >
              <ClockClockwise size={16} weight="bold" />
              History
              <Badge>
                <Command size={12} weight="bold" /> K
              </Badge>
            </Button>
          </div>
        </motion.div>
      </div>

      {isNewSession && (
        <ChatExamples
          examples={examples}
          onExampleClick={(prompt) => {
            setInputValue(prompt);
            runModel(
              {
                role: RoleType.assistant,
                type: PromptType.ask,
                query: prompt,
              },
              sessionId!.toString()
            );
          }}
        />
      )}
    </div>
  );
};
