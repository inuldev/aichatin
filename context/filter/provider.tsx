"use client";

import { useEffect, useState } from "react";
import { Chat, Plus } from "@phosphor-icons/react";

import { FiltersContext } from "./context";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useChatContext } from "../chat/context";
import { useRouter } from "next/navigation";

export type TFiltersProvider = {
  children: React.ReactNode;
};

export const FiltersProvider = ({ children }: TFiltersProvider) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const open = () => setIsFilterOpen(true);
  const dismiss = () => setIsFilterOpen(false);

  const { sessions, createSession } = useChatContext();
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
              <Plus size={14} weight="bold" />
              New session
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sessions">
            {sessions?.map((session) => (
              <CommandItem
                key={session.id}
                value={`${session.id}/${session.title}`}
                className="gap-3 w-full"
                onSelect={(value) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                }}
              >
                <Chat
                  size={14}
                  weight="fill"
                  className="text-zinc-500 flex-shrink-0"
                />
                <span>{session.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FiltersContext.Provider>
  );
};
