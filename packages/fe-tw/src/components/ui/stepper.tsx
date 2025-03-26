import { cva } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const stepperVariants = cva("flex items-center gap-2", {
   variants: {
      variant: {
         fullWidth: "w-full justify-between",
      },
      size: {
         default: "[&>div[data-slot='stepper-step']]:h-12 [&>div[data-slot='stepper-step']]:w-12",
         sm: "[&>div[data-slot='stepper-step']]:h-10 [&>div[data-slot='stepper-step']]:w-10",
         md: "[&>div[data-slot='stepper-step']]:h-12 [&>div[data-slot='stepper-step']]:w-12",
         lg: "[&>div[data-slot='stepper-step']]:h-14 [&>div[data-slot='stepper-step']]:w-14",
      },
   },
   defaultVariants: {
      variant: "fullWidth",
      size: "default",
   },
});

export interface IStepperProps extends React.ComponentProps<"div"> {
   variant: "fullWidth";
   size: "default" | "sm" | "md" | "lg";
}

export const Stepper = ({ variant, size, ...props }: IStepperProps) => {
   return (
      <div
         data-slot="stepper"
         className={cn(stepperVariants({ variant, size }), props.className)}
         {...props}
      />
   );
};

export interface IStepperStepProps extends React.ComponentProps<"div"> {
   isSelected: boolean;
}

export const StepperStep = ({ isSelected, ...props }: IStepperStepProps) => {
   return (
      <div
         data-slot="stepper-step"
         className={cn(
            "flex items-center justify-center rounded-full text-md font-semibold cursor-pointer transition-colors duration-200",
            isSelected
               ? "bg-primary text-white hover:bg-primary/90"
               : "bg-gray-200 text-gray-700 hover:bg-gray-300",
            props.className,
         )}
         {...props}
      />
   );
};

export const StepperSeparator = ({ ...props }: React.ComponentProps<"div">) => {
   return (
      <div
         data-slot="stepper-separator"
         className={cn("border-[0.5px] border-b-gray-400 border-solid w-8 h-0.5", props.className)}
         {...props}
      />
   );
};
