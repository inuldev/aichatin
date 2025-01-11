import { useState } from "react";

import { useModelSettings } from "@/hooks/use-model-settings";
import { defaultPreferences, TPreferences } from "@/hooks/use-preferences";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip } from "./ui/tooltip";
import { Info, SlidersHorizontal } from "@phosphor-icons/react";
import { ModelInfo } from "./model-info";
import { Slider } from "./ui/slider";

export const QuickSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { formik, selectedModel, setPreferences } = useModelSettings({
    refresh: isOpen,
  });

  const renderResetToDefault = (key: keyof TPreferences) => {
    return (
      <Button
        variant={"link"}
        size={"sm"}
        onClick={() => {
          setPreferences({ [key]: defaultPreferences[key] });
          formik.setFieldValue(key, defaultPreferences[key]);
        }}
      >
        Reset
      </Button>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content="Configure Model">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"iconSm"}>
            <SlidersHorizontal size={20} weight="bold" />
          </Button>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent className="p-1 dark:bg-zinc-700 mr-8 rounded-2xl">
        <div className="grid grid-cols-1 gap-1 p-3">
          {selectedModel && <ModelInfo model={selectedModel} />}
          <div className="flex flex-col w-full mt-4 border-t dark:border-white/10 border-black/10">
            <div className="flex flex-row items-center justify-between w-full">
              <Tooltip content="Max Tokens">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-row items-center gap-1">
                  MaxTokens <Info size={14} weight="regular" />{" "}
                  {formik.values.maxTokens}
                </p>
              </Tooltip>
              {renderResetToDefault("maxTokens")}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.maxTokens)]}
              name="maxTokens"
              step={1}
              min={0}
              max={selectedModel?.maxOutputTokens}
              onValueChange={(value: number[]) => {
                setPreferences({ maxTokens: value?.[0] });
                formik.setFieldValue("maxTokens", value?.[0]);
              }}
            />
          </div>

          <div className="flex flex-col w-full mt-4 border-t dark:border-white/10 border-black/10">
            <div className="flex flex-row items-center justify-between w-full">
              <Tooltip content="Temperature">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-row items-center gap-1">
                  Temperature <Info size={14} weight="regular" />{" "}
                  {formik.values.temperature}
                </p>
              </Tooltip>
              {renderResetToDefault("temperature")}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.temperature)]}
              name="temperature"
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ temperature: value?.[0] });
                formik.setFieldValue("temperature", value?.[0]);
              }}
            />
            <div className="flex flex-row justify-between w-full">
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Precise
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Neutral
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full mt-4 border-t dark:border-white/10 border-black/10">
            <div className="flex flex-row items-center justify-between w-full">
              <Tooltip content="TopP">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-row items-center gap-1">
                  TopP <Info size={14} weight="regular" /> {formik.values.topP}
                </p>
              </Tooltip>
              {renderResetToDefault("topP")}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.topP)]}
              name="topP"
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ topP: value?.[0] });
                formik.setFieldValue("topP", value?.[0]);
              }}
            />
            <div className="flex flex-row justify-between w-full">
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Precise
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full mt-4 border-t dark:border-white/10 border-black/10">
            <div className="flex flex-row items-center justify-between w-full">
              <Tooltip content="TopK">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 flex flex-row items-center gap-1">
                  TopK <Info size={14} weight="regular" /> {formik.values.topK}
                </p>
              </Tooltip>
              {renderResetToDefault("topK")}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.topK)]}
              name="topK"
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ topK: value?.[0] });
                formik.setFieldValue("topK", value?.[0]);
              }}
            />
            <div className="flex flex-row justify-between w-full">
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Precise
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
