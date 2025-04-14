import { cva } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

export const Stepper = ({ children, ...props }: React.ComponentProps<"div">) => {
   return (
      <div className={cn("relative flex flex-row justify-around gap-4")} {...props}>
         <div className="absolute top-[25%] left-0 w-full h-[1px] bg-gray-100" />
         {children}
      </div>
   );
};

interface StepperStepProps extends React.ComponentProps<"div"> {
   "data-state"?: "not-started" | "valid" | "invalid" | "in-progress";
}

export const StepperStep = ({ children, ...props }: StepperStepProps) => {
   return (
      <div
         data-state={props["data-state"]}
         className="group flex flex-col items-center gap-2 z-10 **:transition-all **:duration-150 cursor-pointer "
         {...props}
      >
         <div className="relative h-12 w-12 rounded-full border-1 bg-white border-gray-200 group-data-[state=in-progress]:bg-sky-50 group-data-[state=invalid]:bg-red-50 group-data-[state=in-progress]:border-sky-300 group-data-[state=invalid]:border-red-300 group-data-[state=valid]:border-none group-data-[state=valid]:bg-green-500 group-data-[state=deployed]:bg-green-500 group-data-[state=deployed]:border-none flex items-center justify-center">
            <Check className="absolute opacity-0 group-data-[state=valid]:opacity-100 group-data-[state=valid]:text-white" />
            <CheckCheck className="absolute opacity-0 group-data-[state=deployed]:opacity-100 group-data-[state=deployed]:text-white" />
            <div className="absolute h-4 w-4 rounded-full border-1 bg-gray-100 group-data-[state=in-progress]:bg-sky-500 group-data-[state=in-progress]:h-6 group-data-[state=in-progress]:w-6 group-data-[state=in-progress]:border-sky-500 group-data-[state=invalid]:bg-red-500 group-data-[state=invalid]:border-red-500 group-data-[state=valid]:opacity-0 group-data-[state=deployed]:opacity-0" />
         </div>
         {children}
      </div>
   );
};

export const StepperStepContent = (props: React.ComponentProps<"div">) => {
   return <div className="flex flex-col items-center" {...props} />;
};

export const StepperStepTitle = (props: React.ComponentProps<"h4">) => {
   return <h4 {...props} />;
};

export const StepperStepStatus = (props: React.ComponentProps<"p">) => {
   return <p className="text-sm text-muted-foreground" {...props} />;
};
