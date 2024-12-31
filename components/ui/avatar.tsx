import { default as BoringAvatar } from "boring-avatars";

import { cn } from "@/lib/utils";

export type TAvatar = {
  name: string;
  size?: "sm" | "md" | "lg";
};

export const Avatar = ({ name, size = "md" }: TAvatar) => {
  const sizes = {
    sm: 28,
    md: 32,
    lg: 48,
  };

  return (
    <div
      className={cn(
        "rounded-full relative",
        size === "sm" && "w-7 h-7",
        size === "md" && "w-8 h-8",
        size === "lg" && "w-12 h-12"
      )}
    >
      <BoringAvatar
        name={name}
        size={sizes[size]}
        variant="marble"
        colors={["#ffffff"]}
      >
        <p className="text-zinc-900/70 font-bold uppercase absolute inset-0 flex items-center justify-center">
          {name?.[0]}
        </p>
      </BoringAvatar>
    </div>
  );
};
