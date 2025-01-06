import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { usePreferences } from "@/hooks/use-preferences";
import { TModelKey, useModelList } from "@/hooks/use-model-list";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
        <DropdownMenuContent className="min-w-[250px] text-sm">
          {models.map((model) => (
            <DropdownMenuItem
              className={cn(
                activeModel?.key === model.key && "dark:bg-zinc-800 bg-zinc-200"
              )}
              key={model.key}
              onClick={() => {
                setPreferences({ defaultModel: model.key }).then(() => {
                  setSelectedModel(model.key);
                  setIsOpen(false);
                });
              }}
            >
              {model.icon()} {model.name} {model.isNew && <Badge>New</Badge>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
