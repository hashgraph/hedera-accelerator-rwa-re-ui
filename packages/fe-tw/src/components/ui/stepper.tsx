import { cva } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

const stepperCircle = cva(
   "relative h-12 w-12 rounded-full border-1 flex items-center justify-center",
   {
      variants: {
         state: {
            "not-started": "bg-white border-gray-200",
            "in-progress": "bg-sky-50 border-sky-300",
            invalid: "bg-red-50 border-red-300",
            valid: "bg-green-500 border-none",
            deployed: "bg-green-500 border-none",
         },
      },
      defaultVariants: {
         state: "not-started",
      },
   },
);

const stepperCheckIcon = cva("absolute opacity-0", {
   variants: {
      state: {
         valid: "opacity-100 text-white",
         deployed: "hidden",
         "not-started": "",
         "in-progress": "",
         invalid: "",
      },
   },
   defaultVariants: {
      state: "not-started",
   },
});

const stepperCheckCheckIcon = cva("absolute opacity-0", {
   variants: {
      state: {
         deployed: "opacity-100 text-white",
         valid: "hidden",
         "not-started": "",
         "in-progress": "",
         invalid: "",
      },
   },
   defaultVariants: {
      state: "not-started",
   },
});

const stepperInnerDot = cva("absolute rounded-full border-1 bg-gray-100 h-4 w-4", {
   variants: {
      state: {
         "not-started": "",
         "in-progress": "bg-sky-500 h-6 w-6 border-sky-500",
         invalid: "bg-red-500 border-red-500",
         valid: "opacity-0",
         deployed: "opacity-0",
      },
   },
   defaultVariants: {
      state: "not-started",
   },
});

export const Stepper = ({ children, ...props }: React.ComponentProps<"div">) => {
   return (
      <div className={cn("relative flex flex-row justify-around gap-4")} {...props}>
         <div className="absolute top-[25%] left-0 w-full h-[1px] bg-gray-100" />
         {children}
      </div>
   );
};

interface StepperStepProps extends React.ComponentProps<"div"> {
   "data-state"?: "not-started" | "valid" | "invalid" | "in-progress" | "deployed";
}

export const StepperStep = ({ children, ...props }: StepperStepProps) => {
   const state = props["data-state"] ?? "not-started";
   return (
      <div
         data-state={state}
         className="group flex flex-col items-center gap-2 z-10 **:transition-all **:duration-150 cursor-pointer "
         {...props}
      >
         <div className={stepperCircle({ state })}>
            <Check className={stepperCheckIcon({ state })} />
            <CheckCheck className={stepperCheckCheckIcon({ state })} />
            <div className={stepperInnerDot({ state })} />
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
