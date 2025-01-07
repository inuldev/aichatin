import moment from "moment";
import "moment/locale/id";
import { v4 } from "uuid";
import { get, set } from "idb-keyval";

import { TModelKey } from "./use-model-list";

export enum PromptType {
  ask = "ask",
  answer = "answer",
  explain = "explain",
  summarize = "summarize",
  improve = "improve",
  fix_grammar = "fix_grammar",
  reply = "reply",
  short_reply = "short_reply",
}

export enum RoleType {
  assistant = "assistant",
  writing_expert = "writing_expert",
  social_media_expert = "social_media_expert",
}

export type PromptProps = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  image?: string;
};

export type TChatMessage = {
  id: string;
  model: TModelKey;
  rawHuman?: string;
  rawAI?: string;
  sessionId: string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  image?: string;
  props?: PromptProps;
  createdAt: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export const useChatSession = () => {
  const getSessions = async (): Promise<TChatSession[]> => {
    return (await get("chat-sessions")) || [];
  };

  const setSession = async (chatSession: TChatSession) => {
    const sessions = await getSessions();
    const newSessions = [...sessions, chatSession];
    await set("chat-sessions", newSessions);
  };

  const getSessionById = async (id: string) => {
    const sessions = await getSessions();
    return sessions.find((session: TChatSession) => session.id === id);
  };

  const removeSessionById = async (id: string) => {
    const sessions = await getSessions();
    const newSessions = sessions.filter(
      (session: TChatSession) => session.id !== id
    );
    await set("chat-sessions", newSessions);
    return newSessions;
  };

  const removeMessageById = async (sessionId: string, messageId: string) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const newMessages = session.messages.filter(
          (message) => message.id !== messageId
        );

        return { ...session, messages: newMessages };
      }
      return session;
    });
    await set("chat-sessions", newSessions);
    return newSessions;
  };

  moment.locale("id");

  const addMessageToSession = async (
    sessionId: string,
    chatMessage: TChatMessage
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session: TChatSession) => {
      if (session.id === sessionId) {
        if (!session?.messages?.length) {
          const isExistingMessage = session.messages.find(
            (m) => m.id === chatMessage.id
          );
          return {
            ...session,
            messages: isExistingMessage
              ? session.messages.map((m) => {
                  if (m.id === chatMessage.id) {
                    return chatMessage;
                  }
                  return m;
                })
              : [...session.messages, chatMessage],
            title: chatMessage.rawHuman,
            updatedAt: moment().toISOString(),
          };
        }
        return {
          ...session,
          messages: [chatMessage],
          title: chatMessage.rawHuman,
          updatedAt: moment().toISOString(),
        };
      }
      return session;
    });

    await set("chat-sessions", newSessions);
  };

  const createNewSession = async () => {
    const sessions = (await getSessions()) || [];

    const latestSession = sortSessions(sessions, "createdAt")?.[0];
    if (latestSession && latestSession?.messages?.length) {
      return latestSession;
    }

    const newSession: TChatSession = {
      id: v4(),
      messages: [],
      title: "Untitled",
      createdAt: moment().toISOString(),
    };

    const newSessions = [...sessions, newSession];
    await set("chat-sessions", newSessions);
    return newSession;
  };

  const updateSession = async (
    sessionId: string,
    newSession: Omit<TChatSession, "id">
  ) => {
    const sessions = await getSessions();
    const newSessions = sessions.map((session: TChatSession) => {
      if (session.id === sessionId) {
        return {
          ...session,
          ...newSession,
        };
      }
      return session;
    });

    await set("chat-sessions", newSessions);
  };

  const clearSessions = async () => {
    await set("chat-sessions", []);
  };

  const sortSessions = (
    sessions: TChatSession[],
    sortBy: "createdAt" | "updatedAt"
  ) => {
    return sessions.sort((a, b) => moment(b[sortBy]).diff(moment(a[sortBy])));
  };

  const sortMessages = (messages: TChatMessage[], sortBy: "createdAt") => {
    return messages.sort((a, b) => moment(b[sortBy]).diff(moment(a[sortBy])));
  };

  return {
    getSessions,
    setSession,
    getSessionById,
    removeSessionById,
    addMessageToSession,
    updateSession,
    createNewSession,
    clearSessions,
    sortSessions,
    sortMessages,
    removeMessageById,
  };
};
