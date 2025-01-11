import { useState } from "react";
import { useTheme } from "next-themes";
import { DotsThree, GearSix, Moon, Sun } from "@phosphor-icons/react";

import { useSettings } from "@/context/settings/contex";

import { ModelIcon } from "./icons/model-icon";
import { QuickSettings } from "./quick-settings";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { open: openSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute flex justify-between items-center flex-row top-0 left-4 right-4 bg-gradient-to-b from-white dark:from-zinc-800 to-transparent from-70% z-50">
      <div className="flex flex-row gap-2 items-center">
        <ModelIcon type="aichatin" size="md" />
        <p className="text-sm text-zinc-500">AIchatIn</p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <QuickSettings />
        <DropdownMenu
          open={isOpen}
          onOpenChange={(open) => {
            document.body.style.pointerEvents = "auto";
            setIsOpen(open);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} size={"iconSm"}>
              <DotsThree size={24} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[250px] text-sm mr-2">
            <DropdownMenuItem
              onClick={() => {
                openSettings();
              }}
            >
              <GearSix size={14} weight="bold" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
            >
              {theme === "light" ? (
                <Moon size={14} weight="bold" />
              ) : (
                <Sun size={14} weight="bold" />
              )}
              Switch to {theme === "light" ? "dark" : "light"} mode
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DropdownMenuContent className="min-w-[250px] text-sm mr-2">
            <DropdownMenuItem
              onClick={() => {
                openSettings();
              }}
            >
              <GearSix size={14} weight="bold" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>About</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Feedback</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Support</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
