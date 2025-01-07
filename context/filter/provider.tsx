"use client";

import moment from "moment";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Eraser,
  Moon,
  Plus,
  StarFour,
  Sun,
  TrashSimple,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useModelList } from "@/hooks/use-model-list";
import { useChatSession } from "@/hooks/use-chat-session";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { FiltersContext } from "./context";
import { useChatContext } from "../chat/context";

export type TFiltersProvider = {
  children: React.ReactNode;
};

export const FiltersProvider = ({ children }: TFiltersProvider) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { getModelByKey } = useModelList();
  const open = () => setIsFilterOpen(true);
  const dismiss = () => setIsFilterOpen(false);

  const {
    sessions,
    createSession,
    clearChatSessions,
    removeSession,
    currentSession,
  } = useChatContext();
  const { sortSessions } = useChatSession();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsFilterOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <FiltersContext.Provider value={{ open, dismiss }}>
      {children}

      <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              className="gap-3"
              value="new"
              onSelect={(value) => {
                createSession().then((session) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                });
              }}
            >
              <Plus
                size={14}
                weight="bold"
                className="text-zinc-500 flex-shrink-0"
              />
              New session
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="theme"
              onSelect={(value) => {
                setTheme(theme === "light" ? "dark" : "light");
                dismiss();
              }}
            >
              {theme === "light" ? (
                <Moon
                  size={14}
                  weight="bold"
                  className="text-zinc-500 flex-shrink-0"
                />
              ) : (
                <Sun
                  size={14}
                  weight="bold"
                  className="text-zinc-500 flex-shrink-0"
                />
              )}
              Switch to {theme === "light" ? "dark" : "light"} mode
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="delete"
              onSelect={(value) => {
                currentSession?.id &&
                  removeSession(currentSession?.id).then(() => {
                    createSession().then((session) => {
                      router.push(`/chat/${session.id}`);
                      dismiss();
                    });
                  });
              }}
            >
              <TrashSimple
                size={14}
                weight="bold"
                className="text-zinc-500 flex-shrink-0"
              />
              Delete current session
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="clear history"
              onSelect={(value) => {
                clearChatSessions().then(() => {
                  createSession().then((session) => {
                    router.push(`/chat/${session.id}`);
                    dismiss();
                  });
                });
              }}
            >
              <Eraser
                size={14}
                weight="bold"
                className="text-zinc-500 flex-shrink-0"
              />
              Clear history
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sessions">
            {sortSessions(sessions, "updatedAt")?.map((session) => (
              <CommandItem
                key={session.id}
                value={`${session.id}/${session.title}`}
                className={
                  (cn("gap-3 w-full"),
                  currentSession?.id === session.id
                    ? "bg-black/10 dark:bg-black/10"
                    : "")
                }
                onSelect={(value) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                }}
              >
                {getModelByKey(session.messages?.[0]?.model)?.icon()}
                <span className="w-full truncate">{session.title}</span>
                <span className="pl-4 text-xs text-zinc-400 dark:text-zinc-700 flex-shrink-0">
                  {moment(session.createdAt).fromNow(true)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FiltersContext.Provider>
  );
};
