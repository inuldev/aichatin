import { useEffect, useState } from "react";

import { usePreferences } from "@/hooks/use-preferences";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Info } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const OpenAISettings = () => {
  const [key, setKey] = useState<string>("");
  const { getApiKey, setApiKey } = usePreferences();

  useEffect(() => {
    getApiKey("openai").then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);

  return (
    <div className="px-6 flex flex-col items-start gap-2">
      <p className="text-md font-medium text-white py-4">OPENAI Settings</p>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Open AI API Key</p>
      </div>
      <Input
        value={key}
        name="openai-key"
        autoComplete="off"
        type="password"
        placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
        onChange={(e) => {
          setKey(e.target.value);
          setApiKey("openai", e.target.value);
        }}
      />
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={() => {
          window.open("https://platform.openai.com/account/api-keys", "_blank");
        }}
      >
        Get your API key here <ArrowRight size={16} weight="bold" />
      </Button>
      <Alert variant={"success"}>
        <Info size={16} weight="bold" />
        <AlertTitle>Attention!</AlertTitle>
        <AlertDescription>
          Your API key is stored in your browser's local storage and never sent
          anywhere.
        </AlertDescription>
      </Alert>
    </div>
  );
};
