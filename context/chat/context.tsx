"use client";

import { createContext, useContext } from "react";

import { TStreamProps } from "@/hooks/use-llm";
import { PromptProps, TChatSession } from "@/hooks/use-chat-session";

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  createSession: () => Promise<TChatSession>;
  clearChatSessions: () => Promise<void>;
  currentSession: TChatSession | undefined;
  removeSession: (sessionId: string) => Promise<void>;
  stopGeneration: () => void;
  streamingMessage?: TStreamProps;
  error?: string;
  removeMessage: (messageId: string) => void;
  runModel: (props: PromptProps, sessionId: string) => Promise<void>;
};

export const ChatContext = createContext<TChatContext | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};
