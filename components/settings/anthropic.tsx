import { useEffect, useState } from "react";

import { usePreferences } from "@/hooks/use-preferences";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Info } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const AnthropicSettings = () => {
  const [key, setKey] = useState<string>("");
  const { getApiKey, setApiKey } = usePreferences();

  useEffect(() => {
    getApiKey("anthropic").then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);

  return (
    <div className="px-6 flex flex-col items-start gap-2">
      <p className="text-md font-medium dark:text-white text-zinc-600 py-4">
        ANTHROPIC Settings
      </p>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Anthropic API Key</p>
      </div>
      <Input
        value={key}
        name="anthropic-key"
        autoComplete="off"
        type="password"
        placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
        onChange={(e) => {
          setKey(e.target.value);
          setApiKey("anthropic", e.target.value);
        }}
      />
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={() => {
          window.open("https://console.anthropic.com/settings/keys", "_blank");
        }}
      >
        Get your API key here <ArrowRight size={16} weight="bold" />
      </Button>
      <Alert variant={"success"}>
        <Info className="h-4 w-4" />
        <AlertTitle>Attention!</AlertTitle>
        <AlertDescription>
          Your API key is stored in your browser's local storage and never sent
          anywhere.
        </AlertDescription>
      </Alert>
    </div>
  );
};
