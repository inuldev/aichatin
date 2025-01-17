"use client";

import { useState } from "react";
import { ChatCentered, GearSix, UserCircle } from "@phosphor-icons/react";

import { SettingsContext } from "./contex";
import { ModelIcon } from "@/components/icons/model-icon";
import { CommonSettings } from "@/components/settings/common";
import { OpenAISettings } from "@/components/settings/openai";
import { GeminiSettings } from "@/components/settings/gemini";
import { AnthropicSettings } from "@/components/settings/anthropic";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type TSettingsProvider = {
  children: React.ReactNode;
};

export type TSettingMenuItem = {
  name: string;
  key: string;
  icon: () => React.ReactNode;
  component: React.ReactNode;
};

export const SettingsProvider = ({ children }: TSettingsProvider) => {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("common");

  const open = (key?: string) => {
    setIsSettingOpen(true);
    setSelectedMenu(key || "common");
  };

  const dismiss = () => setIsSettingOpen(false);

  const settingMenu: TSettingMenuItem[] = [
    {
      name: "Common",
      key: "common",
      icon: () => <GearSix size={16} weight="bold" />,
      component: <CommonSettings />,
    },
  ];

  const modelsMenu: TSettingMenuItem[] = [
    {
      name: "OpenAI",
      key: "openai",
      icon: () => <ModelIcon type="openai" size="md" />,
      component: <OpenAISettings />,
    },
    {
      name: "Anthropic",
      key: "anthropic",
      icon: () => <ModelIcon type="anthropic" size="md" />,
      component: <AnthropicSettings />,
    },
    {
      name: "Gemini",
      key: "gemini",
      icon: () => <ModelIcon type="gemini" size="md" />,
      component: <GeminiSettings />,
    },
  ];

  const allMenu = [...settingMenu, ...modelsMenu];

  const selectedMenuItem = allMenu.find((menu) => menu.key === selectedMenu);

  return (
    <SettingsContext.Provider value={{ open, dismiss }}>
      {children}

      <Dialog open={isSettingOpen} onOpenChange={setIsSettingOpen}>
        <DialogContent className="min-w-[800px] h-[600px] flex flex-row overflow-hidden border border-white/5 p-0">
          <DialogTitle className="sr-only">Settings</DialogTitle>
          <DialogDescription className="sr-only">Settings</DialogDescription>
          <div className="w-[250px] dark:bg-black/10 bg-black/5 p-2 left-0 top-0 bottom-0 flex flex-col">
            <p className="px-2 py-2 text-xs font-semibold text-zinc-500">
              GENERAL
            </p>
            {settingMenu.map((menu) => (
              <Button
                key={menu.key}
                variant={selectedMenu === menu.key ? "secondary" : "ghost"}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start gap-2 px-2"
                size={"default"}
              >
                {menu.icon()}
                {menu.name}
              </Button>
            ))}
            <p className="px-2 py-2 text-xs font-semibold text-zinc-500">
              MODELS
            </p>
            {modelsMenu.map((menu) => (
              <Button
                key={menu.key}
                variant={selectedMenu === menu.key ? "secondary" : "ghost"}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start gap-2 px-2"
                size={"default"}
              >
                {menu.icon()}
                {menu.name}
              </Button>
            ))}
          </div>
          <div className="ml-[250px] w-full h-full overflow-y-auto no-scrollbar">
            {selectedMenuItem?.component}
          </div>
        </DialogContent>
      </Dialog>
    </SettingsContext.Provider>
  );
};
