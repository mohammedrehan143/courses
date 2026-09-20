import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0a192f] text-white shadow hover:bg-[#132c54] active:bg-[#081426]",
        destructive:
          "bg-rose-700 text-white shadow-sm hover:bg-rose-800",
        outline:
          "border border-slate-200 bg-white text-[#0a192f] shadow-sm hover:bg-slate-50 hover:border-[#0a192f]/40 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800",
        secondary:
          "bg-slate-100 text-[#0a192f] hover:bg-slate-200/80 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
        ghost: "hover:bg-slate-100 hover:text-[#0a192f] dark:hover:bg-slate-800 dark:hover:text-white",
        link: "text-[#0a192f] underline-offset-4 hover:underline dark:text-blue-200",
        gradient: "bg-[#0a192f] hover:bg-[#132c54] text-white shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9 rounded-lg",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
