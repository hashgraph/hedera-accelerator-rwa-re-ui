import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
   "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
   {
      variants: {
         variant: {
            default: "border-transparent",
            outline: "border-1 bg-transparent",
         },
         color: {
            default: "",
            green: "",
            emerald: "",
            red: "",
            amber: "",
            blue: "",
            yellow: "",
            indigo: "",
            gray: "",
         },
      },
      compoundVariants: [
         {
            variant: "default",
            color: "default",
            className: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
         },
         {
            variant: "default",
            color: "green",
            className: "bg-green-100 text-green-800 [a&]:hover:bg-green-200",
         },
         {
            variant: "default",
            color: "emerald",
            className: "bg-emerald-100 text-emerald-800 [a&]:hover:bg-emerald-200",
         },
         {
            variant: "default",
            color: "red",
            className: "bg-red-100 text-red-800 [a&]:hover:bg-red-200",
         },
         {
            variant: "default",
            color: "amber",
            className: "bg-amber-100 text-amber-800 [a&]:hover:bg-amber-200",
         },
         {
            variant: "default",
            color: "blue",
            className: "bg-blue-100 text-blue-800 [a&]:hover:bg-blue-200",
         },
         {
            variant: "default",
            color: "yellow",
            className: "bg-yellow-100 text-yellow-800 [a&]:hover:bg-yellow-200",
         },
         {
            variant: "default",
            color: "indigo",
            className: "bg-indigo-100 text-indigo-800 [a&]:hover:bg-indigo-200",
         },
         {
            variant: "default",
            color: "gray",
            className: "bg-gray-100 text-gray-800 [a&]:hover:bg-gray-200",
         },
         {
            variant: "outline",
            color: "default",
            className: "text-primary border-primary",
         },
         {
            variant: "outline",
            color: "green",
            className: "text-green-800 border-green-200",
         },
         {
            variant: "outline",
            color: "emerald",
            className: "text-emerald-800 border-emerald-200",
         },
         {
            variant: "outline",
            color: "red",
            className: "text-red-800 border-red-200",
         },
         {
            variant: "outline",
            color: "amber",
            className: "text-amber-800 border-amber-200",
         },
         {
            variant: "outline",
            color: "blue",
            className: "text-blue-800 border-blue-200",
         },
         { variant: "outline", color: "yellow", className: "text-yellow-800 border-yellow-200" },
         {
            variant: "outline",
            color: "indigo",
            className: "text-indigo-800 border-indigo-200",
         },
         {
            variant: "outline",
            color: "gray",
            className: "text-gray-800 border-gray-200",
         },
      ],
      defaultVariants: {
         variant: "default",
      },
   },
);

function Badge({
   className,
   variant,
   color,
   asChild = false,
   ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
   const Comp = asChild ? Slot : "span";

   return (
      <Comp
         data-slot="badge"
         className={cn(badgeVariants({ variant, color }), className)}
         {...props}
      />
   );
}

export { Badge, badgeVariants };
