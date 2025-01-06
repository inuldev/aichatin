import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-normal hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-black/10 text-zinc-600 dark:text-zinc-300 hover:bg-black/15 dark:bg-white/10",
        ghost:
          "hover:bg-black/10 text-zinc-600 dark:hover:bg-white/10 hover:text-zinc-800 dark:text-zinc-200 dark:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline h-auto decoration-black/20 dark:decoration-white/20",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs md:text-sm",
        sm: "h-8 px-3 text-xs md:text-sm",
        lg: "h-10 px-8 text-xs md:text-sm",
        icon: "h-9 min-w-9 text-xs md:text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
