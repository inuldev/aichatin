"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { TStreamProps, useLLM } from "@/hooks/use-llm";
import { TChatSession, useChatSession } from "@/hooks/use-chat-session";

import { ChatContext } from "./context";

export type TChatProvider = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: TChatProvider) => {
  const { getSessions, createNewSession, getSessionById } = useChatSession();
  const { sessionId } = useParams();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [streamingMessage, setStreamingMessage] = useState<TStreamProps>();
  const [error, setError] = useState<string | undefined>();
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();

  const { runModel } = useLLM({
    onInit: async (props) => {
      setStreamingMessage(props);
    },
    onStreamStart: async (props) => {
      setStreamingMessage(props);
    },
    onStream: async (props) => {
      setStreamingMessage(props);
    },
    onStreamEnd: async () => {
      fetchSessions().then(() => {
        setStreamingMessage(undefined);
      });
    },
    onError: async (error) => {
      setStreamingMessage(error);
    },
  });

  const fetchSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setIsSessionLoading(false);
  };

  const createSession = async () => {
    const newSession = await createNewSession();
    fetchSessions();
    return newSession;
  };

  const fetchSession = async () => {
    if (!sessionId) {
      return;
    }
    getSessionById(sessionId!.toString()).then((session) => {
      setCurrentSession(session);
    });
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    setIsSessionLoading(true);
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!streamingMessage) {
      fetchSession();
    }
  }, [streamingMessage]);

  const refetchSessions = () => {
    fetchSessions();
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        refetchSessions,
        isSessionLoading,
        createSession,
        currentSession,
        streamingMessage,
        runModel,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
