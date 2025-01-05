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
  const [isAllSessionLoading, setAllSessionLoading] = useState<boolean>(true);
  const [isCurrentSessionLoading, setCurrentSessionLoading] =
    useState<boolean>(false);
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
      fetchAllSessions().then(() => {
        setStreamingMessage(undefined);
      });
    },
    onError: async (error) => {
      setStreamingMessage(error);
    },
  });

  const fetchAllSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setAllSessionLoading(false);
  };

  const removeSession = async (sessionId: string) => {
    await removeSessionById(sessionId);
    await fetchAllSessions();
  };

  const clearChatSessions = async () => {
    clearSessions().then(() => {
      setSessions([]);
    });
  };

  const createSession = async () => {
    const newSession = await createNewSession();
    fetchAllSessions();
    return newSession;
  };

  const fetchCurrentSession = async () => {
    if (!sessionId) {
      return;
    }
    getSessionById(sessionId!.toString())
      .then((session) => {
        setCurrentSession(session);
        setCurrentSessionLoading(false);
      })
      .catch(() => {
        setCurrentSessionLoading(false);
      });
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    setCurrentSessionLoading(true);
    fetchCurrentSession();
  }, [sessionId]);

  useEffect(() => {
    setAllSessionLoading(true);
    fetchAllSessions();
  }, []);

  useEffect(() => {
    if (!streamingMessage) {
      fetchAllSessions();
    }
  }, [streamingMessage]);

  const removeMessage = (messageId: string) => {
    if (!currentSession?.id) {
      return;
    }

    removeMessageById(currentSession?.id, messageId).then(async () => {
      fetchAllSessions();
    });
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        refetchSessions: fetchAllSessions,
        isAllSessionLoading,
        isCurrentSessionLoading,
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
