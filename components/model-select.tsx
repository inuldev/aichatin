import { useEffect, useState } from "react";

import { usePreferences } from "@/hooks/use-preferences";
import { TModelKey, useModelList } from "@/hooks/use-model-list";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="pl-2 pr-4">
          {activeModel?.icon()}
          {activeModel?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2 mt-2">
        <DropdownMenuLabel className="sr-only">Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models.map((model) => (
          <DropdownMenuItem
            key={model.key}
            onClick={() => {
              setPreferences({ defaultModel: model.key }).then(() => {
                setSelectedModel(model.key);
              });
            }}
          >
            {model.icon()}
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
