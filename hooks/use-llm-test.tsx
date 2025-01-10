import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useToast } from "./use-toast";
import { usePreferences } from "./use-preferences";
import { TBaseModel, useModelList } from "./use-model-list";

export const useLLMTest = () => {
  const { getModelByKey, createInstance, getTestModelKey } = useModelList();

  const [isTestRunning, setIsTestRunning] = useState(false);

  const { toast } = useToast();
  const { getApiKey } = usePreferences();

  const testLLM = async (model: TBaseModel) => {
    try {
      const modelKey = getTestModelKey(model);
      const apiKey = await getApiKey(model);

      if (!apiKey) {
        return false;
      }

      const selectedModelKey = getModelByKey(modelKey);

      if (!selectedModelKey) {
        return false;
      }

      const selectedModel = await createInstance(selectedModelKey, apiKey);

      const data = await selectedModel.invoke("This is a test message");

      if (data.content) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const renderTestButton = (model: TBaseModel) => {
    return (
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={async () => {
          setIsTestRunning(true);
          const succeed = await testLLM(model);
          if (succeed) {
            toast({
              title: "Test Success",
              description: "Model is working as expected",
              variant: "default",
            });
          } else {
            toast({
              title: "Test Failed",
              description: "Please check your API key and try again.",
              variant: "destructive",
            });
          }
          setIsTestRunning(false);
        }}
      >
        {isTestRunning ? "Running..." : "Run Test"}
      </Button>
    );
  };

  return {
    renderTestButton,
  };
};
