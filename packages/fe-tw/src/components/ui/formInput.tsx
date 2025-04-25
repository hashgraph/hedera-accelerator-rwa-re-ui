import type * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "./input";

interface InputProps extends React.ComponentProps<"input"> {
   required?: boolean;
   label: string;
   name: string;
   error?: string;
   className?: string;
}

function FormInput({ required, label, name, error, className, type, ...props }: InputProps) {
   return (
      <div className="w-full">
         <Label htmlFor={name} className="gap-1">
            {label}
            {required && <span className={"text-red-500"}>*</span>}
         </Label>
         <Input
            aria-invalid={!!error}
            label={label}
            id={name}
            name={name}
            type={type}
            data-slot="input"
            className={cn(
               "mt-1",
               "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
               "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
               "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-red-500",
               className,
            )}
            {...props}
         />
         {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </div>
   );
}

export { FormInput };
