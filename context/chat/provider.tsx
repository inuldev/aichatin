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
  const [lastStream, setLastStream] = useState<TStreamProps>();
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();

  const { runModel } = useLLM({
    onStreamStart: () => {
      setLastStream(undefined);
      refetchSessions();
    },
    onStream: async (props) => {
      setLastStream(props);
    },
    onStreamEnd: () => {
      fetchSessions().then(() => {
        setLastStream(undefined);
      });
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
        lastStream,
        runModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
