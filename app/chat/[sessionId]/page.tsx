"use client";

import { useParams } from "next/navigation";
import { DotsThree } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

import { ChatInput } from "@/components/chat-input";
import { useSettings } from "@/context/settings/contex";
import { ModelIcon } from "@/components/icons/model-icon";
import { ChatMessages } from "@/components/chat-messages";

const ChatSessionPage = () => {
  const { sessionId } = useParams();
  if (!sessionId) {
    return null;
  }

  const { open } = useSettings();

  return (
    <div className="w-full h-screen flex flex-row relative overflow-hidden">
      <div className="absolute flex justify-between items-center flex-row top-0 left-2 right-6 bg-gradient-to-b dark:from-zinc-800 dark:to-transparent from-70% to-white/10 z-10">
        <div className="flex flex-row gap-0 items-center">
          <ModelIcon type="aichatin" size="md" />
          <p className="p-2 text-sm text-zinc-500">AIchatIn</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Avatar name="Chat" size={"sm"} />
          <Button variant={"secondary"} size={"icon"} onClick={open}>
            <DotsThree size={20} weight="bold" />
          </Button>
        </div>
      </div>
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;
