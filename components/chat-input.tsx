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
import { slideUpVariant } from "@/lib/framer-motion";
import { useFilters } from "@/context/filter/context";
import { useChatContext } from "@/context/chat/context";
import { PromptType, RoleType } from "@/hooks/use-chat-session";
import { useRecordVoice } from "@/hooks/use-record-voice";
import { useTextSelection } from "@/hooks/use-text-selection";
import useScrollToBottom from "@/hooks/use-scroll-to-bottom";

import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import Spinner from "./ui/loading-spinner";
import { AudioWaveSpinner } from "./ui/audio-wave";

import { ModelSelect } from "./model-select";
import { ChatExamples } from "./chat-examples";
import { ChatGreeting } from "./chat-greeting";

export const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const { open: openFilters } = useFilters();
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const [contextValue, setContextValue] = useState<string>("");
  const { runModel, currentSession, createSession, streamingMessage } =
    useChatContext();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();

  const isNewSession =
    !currentSession?.messages?.length && !streamingMessage?.loading;

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
          context: contextValue,
        },
        sessionId!.toString()
      );
      setContextValue("");
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

  const renderNewSession = () => {
    if (isNewSession) {
      return (
        <div className="min-w-8 h-8 flex justify-center items-center">
          <StarFour size={24} weight="fill" />
        </div>
      );
    }

    return (
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
    );
  };

  const renderScrollToBottom = () => {
    if (showButton && !showPopup) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button onClick={scrollToBottom} variant={"secondary"} size={"icon"}>
            <ArrowDown size={20} weight={"bold"} />
          </Button>
        </motion.span>
      );
    }
  };

  const renderReplyButton = () => {
    if (showPopup) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={() => {
              setContextValue(selectedText);
              handleClearSelection();
              inputRef?.current?.focus();
            }}
            variant={"secondary"}
            size={"sm"}
          >
            <Quotes size={20} weight={"bold"} /> Reply
          </Button>
        </motion.span>
      );
    }
  };

  const renderRecordingControls = () => {
    if (recording) {
      <div className="bg-black/50 rounded-xl px-2 py-1 h-10 flex flex-row items-center">
        <AudioWaveSpinner />
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => stopRecording()}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          <StopCircle size={20} weight="fill" className="text-red-300" />
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
      </div>;
    }

    if (transcribing) {
      return <Spinner />;
    }

    return (
      <Tooltip content="Record">
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
      </Tooltip>
    );
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-white dark:from-zinc-800 dark:to-transparent from-70% to-white/10 left-0 right-0 gap-2",
        isNewSession && "top-0"
      )}
    >
      {isNewSession && <ChatGreeting />}
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
      </div>

      <div className="flex flex-col gap-1">
        {contextValue && (
          <div className="flex flex-row items-center bg-black/30 text-zinc-300 rounded-xl h-10 w-[700px] justify-start gap-2 pl-3 pr-1">
            <Quotes size={16} weight="fill" />
            <p className="w-full overflow-hidden truncate ml-2 text-sm">
              {contextValue}
            </p>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setContextValue("")}
              className="flex-shrink-0 ml-4"
            >
              <X size={16} weight="bold" />
            </Button>
          </div>
        )}
        <motion.div
          variants={slideUpVariant}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center bg-white/10 w-[700px] rounded-2xl overflow-hidden"
        >
          <div className="flex flex-row items-center px-3 h-14 w-full gap-0">
            {renderNewSession()}
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
            {renderRecordingControls()}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="min-w-8 h-8 ml-1"
            >
              <ArrowUp size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex flex-row items-center w-full justify-start gap-2 px-2 pb-2 pt-1">
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
