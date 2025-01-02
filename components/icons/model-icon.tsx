import { cn } from "@/lib/utils";
import Image from "next/image";

export type TModelIcon = {
  type: "gpt3" | "gpt4" | "anthropic" | "gemini" | "openai" | "aichatin";
  size: "sm" | "md" | "lg";
};

export const ModelIcon = ({ type, size }: TModelIcon) => {
  const iconSrc = {
    gpt3: "/icons/gpt3.svg",
    gpt4: "/icons/gpt4.svg",
    anthropic: "/icons/claude.svg",
    gemini: "/icons/gemini.svg",
    openai: "/icons/openai.svg",
    aichatin: "/icons/aichat.svg",
  };

  return (
    <Image
      src={iconSrc[type]}
      alt={type}
      width={0}
      height={0}
      className={cn(
        "object-cover",
        size === "sm" && "min-w-4 h-4",
        size === "md" && "min-w-6 h-6",
        size === "lg" && "min-w-8 h-8"
      )}
      sizes="100vw"
    />
  );
};
