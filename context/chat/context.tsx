"use client";

import { createContext, useContext } from "react";

import { PromptProps, TChatSession } from "@/hooks/use-chat-session";
import { TStreamProps } from "@/hooks/use-llm";

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isSessionLoading: boolean;
  createSession: () => Promise<TChatSession>;
  clearChatSessions: () => Promise<void>;
  currentSession: TChatSession | undefined;
  removeSession: (sessionId: string) => Promise<void>;
  stopGeneration: () => void;
  streamingMessage?: TStreamProps;
  error?: string;
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
