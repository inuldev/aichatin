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
  const {
    getSessions,
    createNewSession,
    getSessionById,
    clearSessions,
    removeSessionById,
    removeMessageById,
  } = useChatSession();
  const { sessionId } = useParams();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [streamingMessage, setStreamingMessage] = useState<TStreamProps>();
  const [error, setError] = useState<string | undefined>();
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();

  const { runModel, stopGeneration } = useLLM({
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

  const removeSession = async (sessionId: string) => {
    const sessions = await removeSessionById(sessionId);
    await fetchSessions();
  };

  const clearChatSessions = async () => {
    clearSessions().then(() => {
      setSessions([]);
    });
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

  const removeMessage = (messageId: string) => {
    if (!currentSession?.id) {
      return;
    }

    removeMessageById(currentSession?.id, messageId).then(async () => {
      fetchSessions();
    });
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        refetchSessions,
        isSessionLoading,
        createSession,
        runModel,
        error,
        currentSession,
        streamingMessage,
        clearChatSessions,
        removeSession,
        stopGeneration,
        removeMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
