import { JSX } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { defaultPreferences, usePreferences } from "./use-preferences";
import { ModelIcon } from "@/components/icons/model-icon";

export type TBaseModel = "openai" | "anthropic" | "gemini";

export type TModelKey =
  | "gpt-4o"
  | "gpt-4-turbo"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0125"
  | "claude-3-opus-20240229"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307"
  | "gemini-1.5-pro-latest"
  | "gemini-pro"
  | "gemini-1.5-flash-latest";

export type TModel = {
  name: string;
  key: TModelKey;
  isNew?: boolean;
  icon: () => JSX.Element;
  tokens: number;
  baseModel: TBaseModel;
};

export const useModelList = () => {
  const { getPreferences } = usePreferences();
  const createInstance = async (model: TModel, apiKey: string) => {
    const preferences = await getPreferences();
    const temperature =
      preferences.temperature || defaultPreferences.temperature;
    const topP = preferences.topP || defaultPreferences.topP;
    const topK = preferences.topK || defaultPreferences.topK;
    const maxTokens = preferences.maxTokens || model.tokens;

    switch (model.baseModel) {
      case "openai":
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey,
          temperature,
          maxTokens,
          topP,
        });
      case "anthropic":
        return new ChatAnthropic({
          model: model.key,
          streaming: true,
          anthropicApiUrl: `${window.location.origin}/api/anthropic`,
          apiKey,
          temperature,
          maxTokens,
          topP,
          topK,
        });
      case "gemini":
        return new ChatGoogleGenerativeAI({
          model: model.key,
          streaming: true,
          apiKey,
          temperature,
          maxOutputTokens: maxTokens,
          topP,
          topK,
        });
      default:
        throw new Error("Invalid base model");
    }
  };

  const models: TModel[] = [
    {
      name: "GPT 4o",
      key: "gpt-4o",
      tokens: 128000,
      icon: () => <ModelIcon type="gpt4" size="md" />,
      baseModel: "openai",
      isNew: true,
    },
    {
      name: "GPT4 Turbo",
      key: "gpt-4-turbo",
      tokens: 128000,
      isNew: false,
      icon: () => <ModelIcon type="gpt4" size="md" />,
      baseModel: "openai",
    },
    {
      name: "GPT3.5 Turbo",
      key: "gpt-3.5-turbo",
      tokens: 16385,
      isNew: false,
      icon: () => <ModelIcon type="gpt3" size="md" />,
      baseModel: "openai",
    },
    {
      name: "GPT3.5 Turbo 0125",
      key: "gpt-3.5-turbo-0125",
      tokens: 16385,
      isNew: false,
      icon: () => <ModelIcon type="gpt3" size="md" />,
      baseModel: "openai",
    },
    {
      name: "Claude 3 Opus",
      key: "claude-3-opus-20240229",
      tokens: 10000,
      isNew: false,
      icon: () => <ModelIcon type="anthropic" size="md" />,
      baseModel: "anthropic",
    },
    {
      name: "Claude 3 Sonnet",
      key: "claude-3-sonnet-20240229",
      tokens: 20000,
      isNew: false,
      icon: () => <ModelIcon type="anthropic" size="md" />,
      baseModel: "anthropic",
    },
    {
      name: "Claude 3 Haiku",
      key: "claude-3-haiku-20240307",
      tokens: 20000,
      isNew: false,
      icon: () => <ModelIcon type="anthropic" size="md" />,
      baseModel: "anthropic",
    },

    {
      name: "Gemini Pro 1.5",
      key: "gemini-1.5-pro-latest",
      tokens: 200000,
      isNew: true,
      icon: () => <ModelIcon type="gemini" size="md" />,
      baseModel: "gemini",
    },
    {
      name: "Gemini Pro",
      key: "gemini-pro",
      tokens: 200000,
      isNew: false,
      icon: () => <ModelIcon type="gemini" size="md" />,
      baseModel: "gemini",
    },
    {
      name: "Gemini Flash 1.5",
      key: "gemini-1.5-flash-latest",
      tokens: 200000,
      isNew: false,
      icon: () => <ModelIcon type="gemini" size="md" />,
      baseModel: "gemini",
    },
  ];

  const getModelByKey = (key: TModelKey) => {
    return models.find((model) => model.key === key);
  };

  return {
    models,
    createInstance,
    getModelByKey,
  };
};
