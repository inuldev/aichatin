import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useMarkdown } from "@/hooks/use-mdx";
import { useChatContext } from "@/context/chat/context";
import { TChatSession, useChatSession } from "@/hooks/use-chat-session";

export const ChatMessages = () => {
  const { sessionId } = useParams();
  const { lastStream } = useChatContext();
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const { getSessionById } = useChatSession();
  const { renderMarkdown } = useMarkdown();

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
    if (!lastStream) {
      fetchSession();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === sessionId;

  return (
    <div>
      {currentSession?.messages.map((message) => (
        <div key={message.id} className="p-2">
          {message.rawHuman}
          {renderMarkdown(message.rawAI)}
        </div>
      ))}
      {isLastStreamBelongsToCurrentSession && (
        <div className="p-2">
          {lastStream?.props?.query}
          {renderMarkdown(lastStream!.message)}
        </div>
      )}
    </div>
  );
};
