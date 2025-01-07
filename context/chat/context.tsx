"use client";

import { createContext, useContext } from "react";

import { TRunModel } from "@/hooks/use-llm";
import { TChatSession } from "@/hooks/use-chat-session";

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  streaming: boolean;
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  currentSession: TChatSession | undefined;
  createSession: () => Promise<TChatSession>;
  removeSession: (sessionId: string) => Promise<void>;
  clearChatSessions: () => Promise<void>;
  stopGeneration: () => void;
  runModel: (props: TRunModel) => Promise<void>;
  removeMessage: (messageId: string) => void;
};

export const ChatContext = createContext<TChatContext | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};
