import { useEffect, useState } from "react";

import { usePreferences } from "@/hooks/use-preferences";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Info } from "@phosphor-icons/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>("");
  const { getApiKey, setApiKey } = usePreferences();

  useEffect(() => {
    getApiKey("gemini").then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);

  return (
    <div className="px-4 flex flex-col items-start gap-2">
      <p className="text-md font-medium text-white py-4">GEMINI Settings</p>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Gemini API Key</p>
      </div>
      <Input
        value={key}
        name="gemini-key"
        autoComplete="off"
        type="password"
        placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
        onChange={(e) => {
          setKey(e.target.value);
          setApiKey("gemini", e.target.value);
        }}
      />
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={() => {
          window.open("https://aistudio.google.com/app/apikey", "_blank");
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
