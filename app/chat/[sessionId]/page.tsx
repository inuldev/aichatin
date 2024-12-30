"use client";

import Avatar from "boring-avatars";
import { useParams } from "next/navigation";
import { DotsThree } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat-input";
import { useSettings } from "@/context/settings/contex";
import { ModelSelect } from "@/components/model-select";
import { ChatMessages } from "@/components/chat-messages";

const ChatSessionPage = () => {
  const { sessionId } = useParams();
  if (!sessionId) {
    return null;
  }

  const { open } = useSettings();

  return (
    <div className="w-full h-screen flex flex-row relative overflow-hidden">
      <div className="absolute flex justify-between items-center flex-row top-0 left-0 bg-gradient-to-b dark:from-zinc-800 dark:to-transparent from-70% to-white/10 z-10">
        <p className="p-2 text-sm text-zinc-500">AIchatIn</p>
        <div className="flex flex-row gap-2 items-center">
          <ModelSelect />
          <Avatar name="Chat" />
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
