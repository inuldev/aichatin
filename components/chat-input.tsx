"use client";

import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import Resizer from "react-image-file-resizer";
import { useParams, useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowElbowDownRight,
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Paperclip,
  Plus,
  Quotes,
  StarFour,
  Stop,
  StopCircle,
  X,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { examplePrompts } from "@/lib/prompts";
import { slideUpVariant } from "@/lib/framer-motion";
import { useFilters } from "@/context/filter/context";
import { useModelList } from "@/hooks/use-model-list";
import { useSettings } from "@/context/settings/contex";
import { useChatContext } from "@/context/chat/context";
import { usePreferences } from "@/hooks/use-preferences";
import { PromptType, RoleType } from "@/hooks/use-chat-session";
import { useRecordVoice } from "@/hooks/use-record-voice";
import { useTextSelection } from "@/hooks/use-text-selection";
import useScrollToBottom from "@/hooks/use-scroll-to-bottom";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import { AudioWaveSpinner } from "./ui/audio-wave";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import {
  Command as CMDKCommand,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

import { ModelSelect } from "./model-select";
import { ChatExamples } from "./chat-examples";
import { ChatGreeting } from "./chat-greeting";

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
  const { runModel, currentSession, createSession, streaming, stopGeneration } =
    useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [contextValue, setContextValue] = useState<string>("");
  const { getPreferences, getApiKey } = usePreferences();
  const { getModelByKey } = useModelList();
  const { open: openSettings } = useSettings();
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [commandInput, setCommandInput] = useState("");
  const [open, setOpen] = useState(false);
  const [attachment, setAttachment] = useState<TAttachment>();

  const focusToInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  };

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    const fileTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (file && !fileTypes.includes(file?.type)) {
      toast.error("Please select a valid image (PNG, JPEG, GIF, or WebP).");
      return;
    }

    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const base64String = reader?.result?.split(",")[1];
      setAttachment((prev) => ({
        ...prev,
        base64: `data:${file?.type};base64,${base64String}`,
      }));
    };

    if (file) {
      setAttachment((prev) => ({
        ...prev,
        file,
      }));
      const resizedFile = await resizeFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleRunModel = (query?: string) => {
    if (!query && !inputValue) {
      return;
    }
    getPreferences().then(async (preferences) => {
      const selectedModel = getModelByKey(preferences.defaultModel);

      if (
        selectedModel?.key &&
        !["gpt-4-turbo", "gpt-4o"].includes(selectedModel?.key) &&
        attachment?.base64
      ) {
        toast.error("This model does not support image input.");
        return;
      }

      if (!selectedModel?.baseModel) {
        throw new Error("Model not found");
      }

      const apiKey = await getApiKey(selectedModel?.baseModel);

      if (!apiKey) {
        toast.error("API key is missing. Please check your settings.");
        openSettings(selectedModel?.baseModel);
        return;
      }
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          image: attachment?.base64,
          query: query || inputValue,
          context: contextValue,
        },
        sessionId!.toString()
      );
      setAttachment(undefined);
      setContextValue("");
      setInputValue("");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const keyCode = e?.which || e?.keyCode;

    if (keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleRunModel();
    }
  };

  useEffect(() => {
    if (sessionId) {
      inputRef?.current?.focus();
    }
  }, [sessionId]);

  const isNewSession = !currentSession?.messages?.length;

  useEffect(() => {
    if (text) {
      setInputValue(text);
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: text,
        },
        sessionId!.toString()
      );
      setInputValue("");
    }
  }, [text]);

  const renderRecordingControls = () => {
    if (recording) {
      return (
        <>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              stopRecording();
            }}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
          >
            <StopCircle size={20} weight="fill" className="text-red-300" />
          </Button>
        </>
      );
    }

    return (
      <Tooltip content="Record">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="min-w-8 h-8"
          onClick={() => {
            startRecording();
            setTimeout(() => {
              stopRecording();
            }, 20000);
          }}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          <Microphone size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  const renderNewSession = () => {
    if (isNewSession) {
      return (
        <div className="min-w-8 h-8 flex justify-center items-center dark:text-white text-zinc-500">
          <StarFour size={20} weight="fill" />
        </div>
      );
    }

    return (
      <Tooltip content="New Session">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="min-w-8 h-8"
          onClick={() => {
            createSession().then((session) => {
              router.push(`/chat/${session.id}`);
            });
          }}
        >
          <Plus size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  const renderScrollToBottom = () => {
    if (showButton && !showPopup && !recording && !transcribing) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button onClick={scrollToBottom} variant={"secondary"} size={"icon"}>
            <ArrowDown size={20} weight={"bold"} />
          </Button>
        </motion.span>
      );
    }
  };

  const renderReplyButton = () => {
    if (showPopup && !recording && !transcribing) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={() => {
              setContextValue(selectedText);
              handleClearSelection();
              inputRef?.current?.focus();
            }}
            variant={"secondary"}
            size={"sm"}
          >
            <Quotes size={20} weight={"bold"} /> Reply
          </Button>
        </motion.span>
      );
    }
  };

  const renderStopButton = () => {
    return (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <Button
          onClick={() => stopGeneration()}
          variant={"secondary"}
          size={"sm"}
        >
          <Stop size={20} weight={"bold"} />
        </Button>
      </motion.span>
    );
  };

  const renderAttachedImage = () => {
    if (attachment?.base64 && attachment?.file) {
      return (
        <div className="flex flex-row items-center bg-black/30 text-zinc-300 rounded-xl h-10 w-[700px] justify-start gap-2 pl-3 pr-1">
          <ArrowElbowDownRight size={20} weight="bold" />
          <p className="w-full relative ml-2 text-xs flex flex-row gap-2 items-center">
            <Image
              src={attachment.base64}
              width={0}
              height={0}
              alt="uploaded image"
              className="rounded-xl translate-y[50%] min-w-[60px] h-[60px] border border-white/5 absolute rotate-6 shadow-md object-cover"
            />
            <span className="ml-[70px]">{attachment?.file?.name}</span>
          </p>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => setContextValue("")}
            className="flex-shrink-0 ml-4"
          >
            <X size={16} weight="bold" />
          </Button>
        </div>
      );
    }
  };

  const renderSelectedContext = () => {
    if (contextValue) {
      return (
        <div className="flex flex-row items-center bg-black/30 text-zinc-300 rounded-xl h-10 w-[700px] justify-start gap-2 pl-3 pr-1">
          <ArrowElbowDownRight size={16} weight="fill" />
          <p className="w-full overflow-hidden truncate ml-2 text-sm">
            {contextValue}
          </p>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => setContextValue("")}
            className="flex-shrink-0 ml-4"
          >
            <X size={16} weight="bold" />
          </Button>
        </div>
      );
    }
  };

  const renderFileUpload = () => {
    return (
      <>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={handleFileSelect}
          className="px-1.5"
        >
          <Paperclip size={16} weight="bold" />
          Attach
        </Button>
      </>
    );
  };

  const renderListeningIndicator = () => {
    if (transcribing) {
      return (
        <div className="bg-zinc-800 dark:bg-zinc-900 text-white rounded-full gap-2 px-4 py-1 h-10 flex flex-row items-center text-sm">
          <AudioWaveSpinner /> <p>Transcribing...</p>
        </div>
      );
    }
    if (recording) {
      return (
        <div className="bg-zinc-800 dark:bg-zinc-900 text-white rounded-full gap-2 px-4 py-1 h-10 flex flex-row items-center text-sm">
          <AudioWaveSpinner /> <p>Listening...</p>
        </div>
      );
    }
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-zinc-50 dark:from-zinc-800 to-transparent from-70% left-0 right-0 gap-2",
        isNewSession && "top-0"
      )}
    >
      {isNewSession && <ChatGreeting />}
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
        {renderListeningIndicator()}
      </div>

      <div className="flex flex-col gap-1">
        {renderSelectedContext()}
        {renderAttachedImage()}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor>
            <motion.div
              variants={slideUpVariant}
              initial={"initial"}
              animate={"animate"}
              className="flex flex-col gap-0 bg-white shadow-sm border-black/10 dark:bg-white/5 border dark:border-white/5 w-[700px] rounded-[1.25em] overflow-hidden"
            >
              <div className="flex flex-row items-center px-3 h-14 pt-3 w-full gap-0">
                {renderNewSession()}
                <TextareaAutosize
                  minRows={1}
                  maxRows={6}
                  ref={inputRef}
                  placeholder="Ask me anything..."
                  value={inputValue}
                  autoComplete="off"
                  autoCapitalize="off"
                  onChange={(e) => {
                    if (e.target.value === "/") {
                      setOpen(true);
                    }
                    setInputValue(e.currentTarget.value);
                    focusToInput();
                  }}
                  onKeyDown={handleKeyDown}
                  className="px-2 py-1.5 w-full text-sm leading-5 tracking-[0.01em] border-none resize-none bg-transparent outline-none no-scrollbar"
                />
                {renderRecordingControls()}
                <Button
                  size={"icon"}
                  variant={!!inputValue ? "secondary" : "ghost"}
                  className="min-w-8 h-8 ml-1"
                  disabled={!inputValue}
                  onClick={() => handleRunModel()}
                >
                  <ArrowUp size={20} weight="bold" />
                </Button>
              </div>
              <div className="flex flex-row items-center w-full justify-start gap-2 px-2 pb-2 pt-1">
                <ModelSelect />
                {renderFileUpload()}
                <div className="flex-1" />
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={openFilters}
                  className="px-1.5"
                >
                  <ClockClockwise size={16} weight="bold" />
                  History
                  <Badge>
                    <Command size={12} weight="bold" /> K
                  </Badge>
                </Button>
              </div>
            </motion.div>
          </PopoverAnchor>
          <PopoverContent className="w-[700px] p-0 rounded-2xl overflow-hidden">
            <CMDKCommand>
              <CommandInput
                placeholder="Search..."
                className="h-9"
                value={commandInput}
                onValueChange={setCommandInput}
                onKeyDown={(e) => {
                  if (
                    (e.key === "Delete" || e.key === "Backspace") &&
                    !commandInput
                  ) {
                    setOpen(false);
                    focusToInput();
                  }
                }}
              />
              <CommandEmpty>No prompt found.</CommandEmpty>
              <CommandList className="p-1">
                {examplePrompts?.map((example, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setInputValue(example.prompt);
                      inputRef?.current?.focus();
                      setOpen(false);
                    }}
                  >
                    {example.title}
                  </CommandItem>
                ))}
              </CommandList>
            </CMDKCommand>
          </PopoverContent>
        </Popover>
      </div>
      <ChatExamples
        show={isNewSession}
        onExampleClick={(prompt) => {
          handleRunModel(prompt);
        }}
      />
    </div>
  );
};
