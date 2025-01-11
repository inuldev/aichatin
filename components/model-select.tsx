import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { defaultPreferences, usePreferences } from "@/hooks/use-preferences";
import { TModelKey, useModelList } from "@/hooks/use-model-list";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { formatNumber } from "@/lib/helper";
import { GearSix } from "@phosphor-icons/react";
import { ModelInfo } from "./model-info";

export const ModelSelect = () => {
  const [selectedModel, setSelectedModel] = useState<TModelKey>("gpt-4-turbo");
  const [isOpen, setIsOpen] = useState(false);
  const { getModelByKey, models } = useModelList();
  const activeModel = getModelByKey(selectedModel);
  const { getPreferences, setPreferences } = usePreferences();

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedModel(preferences.defaultModel);
    });
  }, []);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pl-1 pr-3 gap-2 text-xs" size="sm">
            {activeModel?.icon()}
            {activeModel?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[250px] text-sm max-h-[260px] overflow-y-auto no-scrollbar">
          {models.map((model) => (
            <DropdownMenuSub key={model.key}>
              <DropdownMenuSubTrigger>
                <DropdownMenuItem
                  className={cn(
                    activeModel?.key === model.key &&
                      "dark:bg-zinc-800 bg-zinc-200"
                  )}
                  key={model.key}
                  onClick={() => {
                    setPreferences({
                      defaultModel: model.key,
                      maxTokens: defaultPreferences.maxTokens,
                    }).then(() => {
                      setSelectedModel(model.key);
                      setIsOpen(false);
                    });
                  }}
                >
                  {model.icon()} {model.name}{" "}
                  {model.isNew && <Badge>New</Badge>}
                </DropdownMenuItem>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="dark bg-zinc-900 p-4 flex flex-col gap-3 tracking-[0.1px] text-sm rounded-xl min-w-[200px]">
                  <ModelInfo model={model} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem key={"manage"} onClick={() => {}}>
            <div>
              <GearSix size={16} weight="bold" />
            </div>
            Manage Models
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
