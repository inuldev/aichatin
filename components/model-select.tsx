import { useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { usePreferences } from "@/hooks/use-preferences";
import { TModelKey, useModelList } from "@/hooks/use-model-list";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const ModelSelect = () => {
  const [selectedModel, setSelectedModel] = useState<TModelKey>("gpt-4-turbo");

  const { getModelByKey, models } = useModelList();
  const activeModel = getModelByKey(selectedModel);
  const { getPreferences, setPreferences } = usePreferences();

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedModel(preferences.defaultModel);
    });
  }, []);

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="secondary"
          className="pl-1 pr-3 gap-1 text-xs"
          size="sm"
        >
          {activeModel?.icon()}
          {activeModel?.name}
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0 overflow-hidden">
        {models.map((model) => (
          <div className="p-2 max-h-[380px] overflow-y-auto">
            <div
              className={cn(
                "flex flex-row items-center gap-2 px-2 justify-between text-sm hover:bg-white/5 cursor-pointer rounded-2xl"
              )}
              key={model.key}
              onClick={() => {
                setPreferences({ defaultModel: model.key }).then(() => {
                  setSelectedModel(model.key);
                });
              }}
            >
              <div className="flex flex-row items-center gap-3">
                {model.icon()} {model.name} {model.isNew && <Badge>New</Badge>}
              </div>
              <div className="flex flex-row items-center gap-3">
                {activeModel?.key === model.key && (
                  <CheckCircle size={24} weight="fill" />
                )}
              </div>
            </div>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
};
