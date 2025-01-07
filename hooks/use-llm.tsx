import { v4 } from "uuid";
import moment from "moment";
import "moment/locale/id";
import {
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { LLMResult } from "@langchain/core/outputs";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { Serialized } from "@langchain/core/load/serializable";

import { PromptProps, TChatMessage, useChatSession } from "./use-chat-session";
import { defaultPreferences, usePreferences } from "./use-preferences";
import { TModelKey, useModelList } from "./use-model-list";

export type TUseLLM = {
  onInit: (props: TChatMessage) => Promise<void>;
  onStreamStart: (props: TChatMessage) => Promise<void>;
  onStream: (props: TChatMessage) => Promise<void>;
  onStreamEnd: (props: TChatMessage) => Promise<void>;
  onError: (props: TChatMessage) => Promise<void>;
};

export type TRunModel = {
  props: PromptProps;
  sessionId: string;
  messageId?: string;
  model?: TModelKey;
};

export const useLLM = ({
  onInit,
  onStream,
  onStreamStart,
  onStreamEnd,
  onError,
}: TUseLLM) => {
  const { getSessionById, addMessageToSession, sortMessages } =
    useChatSession();
  const { getApiKey, getPreferences } = usePreferences();
  const { createInstance, getModelByKey } = useModelList();
  const abortController = new AbortController();

  const stopGeneration = () => {
    abortController.abort();
  };

  const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
    const preferences = await getPreferences();
    const messageLimit =
      preferences.messageLimit || defaultPreferences.messageLimit;
    const hasPreviousMessages = history?.length > 0;
    const systemPrompt =
      preferences.systemPrompt || defaultPreferences.systemPrompt;

    const system: BaseMessagePromptTemplateLike = ["system", `${systemPrompt}`];

    const messageHolders = new MessagesPlaceholder("chat_history");

    const userContext = `{input} ${
      props?.context
        ? `Answer user's question based on the following context: """{context}"""`
        : ""
    } ${
      hasPreviousMessages
        ? `You can also refer these previous conversations if needed: `
        : ""
    }`;

    const user: BaseMessagePromptTemplateLike = [
      "user",
      props?.image
        ? [
            {
              type: "text",
              content: userContext,
            },
            {
              type: "image_url",
              image_url: props.image,
            },
          ]
        : userContext,
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      system,
      messageHolders,
      user,
    ]);

    const previousMessageHistory = sortMessages(history, "createdAt")
      .slice(0, messageLimit === "all" ? history.length : messageLimit)
      .reduce(
        (acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman, image }) => {
          if (rawAI && rawHuman) {
            return [...acc, new HumanMessage(rawHuman), new AIMessage(rawAI)];
          } else {
            return [...acc];
          }
        },
        []
      );

    prompt.format({
      chat_history: previousMessageHistory || [],
      context: props.context,
      input: props.query,
    });

    const formattedChatPrompt = await prompt.formatMessages({
      chat_history: previousMessageHistory || [],
      context: props.context,
      input: props.query,
    });

    return formattedChatPrompt;
  };

  const runModel = async ({
    sessionId,
    messageId,
    props,
    model,
  }: TRunModel) => {
    const currentSession = await getSessionById(sessionId);

    if (!props?.query) {
      return;
    }

    moment.locale("id");

    const newMessageId = messageId || v4();
    const preferences = await getPreferences();
    const modelKey = model || preferences.defaultModel;
    onInit({
      id: newMessageId,
      props,
      model: modelKey,
      sessionId,
      rawHuman: props.query,
      createdAt: moment().toISOString(),
      hasError: false,
      isLoading: true,
    });

    const selectedModelKey = getModelByKey(modelKey);
    if (!selectedModelKey) {
      throw new Error("Model not found");
    }

    const apiKey = await getApiKey(selectedModelKey?.baseModel);

    if (!apiKey) {
      onError({
        id: newMessageId,
        props,
        model: modelKey,
        sessionId,
        rawHuman: props.query,
        createdAt: moment().toISOString(),
        hasError: true,
        isLoading: false,
      });
      return;
    }

    const formattedChatPrompt = await preparePrompt(
      props,
      currentSession?.messages || []
    );

    const selectedModel = await createInstance(selectedModelKey, apiKey);
    selectedModel.bind({ signal: abortController.signal });

    const stream = await selectedModel.stream(formattedChatPrompt, {
      options: {
        stream: true,
        signal: abortController.signal,
      },
      callbacks: [
        {
          handleLLMStart: async (llm: Serialized, prompts: string[]) => {
            console.log(JSON.stringify(llm, null, 2));
            console.log(JSON.stringify(prompts, null, 2));
          },
          handleLLMEnd: async (output: LLMResult) => {
            console.log(JSON.stringify(output, null, 2));
          },
          handleLLMError: async (err: Error) => {
            console.log(err);
          },
        },
      ],
    });

    if (!stream) {
      return;
    }

    let streamedMessage = "";
    onStreamStart({
      id: newMessageId,
      props,
      sessionId,
      rawHuman: props.query,
      rawAI: streamedMessage,
      model: modelKey,
      isLoading: true,
      hasError: false,
      createdAt: moment().toISOString(),
    });

    for await (const chunk of stream) {
      streamedMessage += chunk.content;
      onStream({
        id: newMessageId,
        props,
        sessionId,
        rawHuman: props.query,
        rawAI: streamedMessage,
        model: modelKey,
        isLoading: true,
        hasError: false,
        errorMessage: undefined,
        createdAt: moment().toISOString(),
      });
    }

    const chatMessage: TChatMessage = {
      id: newMessageId,
      sessionId,
      rawHuman: props.query,
      rawAI: streamedMessage,
      props,
      model: modelKey,
      isLoading: false,
      hasError: false,
      createdAt: moment().toISOString(),
    };

    addMessageToSession(sessionId, chatMessage).then(() => {
      onStreamEnd(chatMessage);
    });
  };

  return {
    runModel,
    stopGeneration,
  };
};
