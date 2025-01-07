import { useRef } from "react";
import { encodingForModel } from "js-tiktoken";
import { Check, Copy, Info, TrashSimple } from "@phosphor-icons/react";

import { useMarkdown } from "@/hooks/use-mdx";
import { useClipboard } from "@/hooks/use-clipboard";
import { TModelKey, useModelList } from "@/hooks/use-model-list";
import { useChatContext } from "@/context/chat/context";
import { TChatMessage } from "@/hooks/use-chat-session";

import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import Spinner from "./ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

import { RegenerateWithModelSelect } from "./regenerate-model-select";

export type TAIMessageBubble = {
  chatMessage: TChatMessage;
  isLast: boolean;
};

export const AIMessageBubble = ({ chatMessage, isLast }: TAIMessageBubble) => {
  const { id, rawAI, isLoading, model, errorMessage } = chatMessage;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();
  const { removeMessage, runModel } = useChatContext();

  const modelForMessage = getModelByKey(model);

  const handleCopyContent = () => {
    messageRef?.current && rawAI && copy(rawAI);
  };

  const getTokenCount = (
    message: Partial<Pick<TChatMessage, "model" | "rawAI">>
  ) => {
    const enc = encodingForModel("gpt-3.5-turbo");

    if (message.rawAI) {
      return enc.encode(message.rawAI).length;
    }

    return undefined;
  };

  const tokenCount = getTokenCount({ model, rawAI });

  return (
    <div className="flex flex-row gap-2 mt-6 w-full">
      <div className="p-3">{modelForMessage?.icon()}</div>
      <div
        ref={messageRef}
        className="rounded-2xl px-4 w-full flex flex-col items-start"
      >
        {rawAI && (
          <div className="pb-2 w-full">
            {renderMarkdown(rawAI, id === "streaming")}
          </div>
        )}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-row w-full justify-between items-center py-3 opacity-50 hover:opacity-100 transition-opacity">
          {isLoading && <Spinner />}
          {!isLoading && (
            <div className="flex flex-row gap-1">
              <Tooltip content="Copy">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={handleCopyContent}
                >
                  {showCopied ? (
                    <Check size={16} weight="regular" />
                  ) : (
                    <Copy size={16} weight="regular" />
                  )}
                </Button>
              </Tooltip>
              {chatMessage && isLast && (
                <RegenerateWithModelSelect
                  onRegenerate={(model: TModelKey) => {
                    runModel({
                      messageId: chatMessage.id,
                      model: model,
                      props: chatMessage.props!,
                      sessionId: chatMessage.sessionId,
                    });
                  }}
                />
              )}
              <Tooltip content="Delete">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    removeMessage(id);
                  }}
                >
                  <TrashSimple size={16} weight="regular" />
                </Button>
              </Tooltip>
            </div>
          )}
          {tokenCount && !isLoading && (
            <div className="flex flex-row gap-2 items-center text-xs text-zinc-500">
              {modelForMessage?.name}
              <Tooltip content="Estimated output tokens">
                <span className="flex flex-row gap-1 p-2 items-center cursor-pointer">
                  {`${tokenCount} tokens`}
                  <Info size={14} weight="bold" />
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
