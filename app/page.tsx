"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Spinner from "@/components/ui/loading-spinner";
import { useChatContext } from "@/context/chat/context";
import { ModelIcon } from "@/components/icons/model-icon";

export default function Home() {
  const router = useRouter();
  const { createSession } = useChatContext();

  useEffect(() => {
    createSession().then((session) => {
      router.push(`/chat/${session.id}`);
    });
  }, []);

  return (
    <main className="flex flex-col gap-2 h-screen w-screen items-center justify-center">
      <ModelIcon type="aichatin" size="lg" />
      <Spinner />
    </main>
  );
}
