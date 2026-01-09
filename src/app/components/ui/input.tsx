import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-sm border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900",
        "placeholder:text-slate-500",
        "transition-all outline-none",
        "focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500",
        "hover:border-slate-300",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
