"use client";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { createContext, useContext } from "react";
import { type VariantProps } from "class-variance-authority";

const cardVariants = cva(
   "rounded-xl border bg-card text-card-foreground shadow-lg transition-all duration-300",
   {
      variants: {
         variant: {
            default: "border-gray-200",
            indigo: "border-indigo-100",
            emerald: "border-emerald-100",
            blue: "border-blue-100",
            amber: "border-amber-100",
         },
      },
      defaultVariants: {
         variant: "default",
      },
   },
);

const cardHeaderVariants = cva("rounded-t-xl border-b p-6", {
   variants: {
      variant: {
         default: "bg-gray-50 border-gray-100",
         indigo: "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100",
         emerald: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100",
         blue: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100",
         amber: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

const iconBackgroundVariants = cva("p-3 rounded-lg", {
   variants: {
      variant: {
         default: "bg-gray-100",
         indigo: "bg-indigo-100",
         emerald: "bg-emerald-100",
         blue: "bg-blue-100",
         amber: "bg-amber-100",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

const iconVariants = cva("h-6 w-6", {
   variants: {
      variant: {
         default: "text-gray-600",
         indigo: "text-indigo-600",
         emerald: "text-emerald-600",
         blue: "text-blue-600",
         amber: "text-amber-600",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

const titleVariants = cva("text-2xl font-bold", {
   variants: {
      variant: {
         default: "text-gray-900",
         indigo: "text-indigo-900",
         emerald: "text-emerald-900",
         blue: "text-blue-900",
         amber: "text-amber-900",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

const descriptionVariants = cva("text-sm font-medium", {
   variants: {
      variant: {
         default: "text-gray-700/70",
         indigo: "text-indigo-700/70",
         emerald: "text-emerald-700/70",
         blue: "text-blue-700/70",
         amber: "text-amber-700/70",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

type CardVariant = VariantProps<typeof cardVariants>["variant"];

const CardContext = createContext<{ variant: CardVariant }>({
   variant: "default",
});

const useCardContext = () => {
   const context = useContext(CardContext);
   if (!context) {
      throw new Error("Card components must be used within a Card");
   }
   return context;
};

export interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({ variant = "default", className, children, ...props }: CardProps) {
   return (
      <CardContext.Provider value={{ variant }}>
         <div data-slot="card" className={cardVariants({ variant, className })} {...props}>
            {children}
         </div>
      </CardContext.Provider>
   );
}

interface CardHeaderProps extends React.ComponentProps<"div"> {
   icon?: React.ReactNode;
   title?: string;
   description?: string;
   badge?: React.ReactNode;
}

function CardHeader({
   icon,
   title,
   description,
   badge,
   className,
   children,
   ...props
}: CardHeaderProps) {
   const { variant } = useCardContext();

   // If structured props are provided, render the structured layout
   if (icon || title || description || badge) {
      return (
         <div
            data-slot="card-header"
            className={cardHeaderVariants({ variant, className })}
            {...props}
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  {icon && (
                     <div className={iconBackgroundVariants({ variant })}>
                        <div className={iconVariants({ variant })}>{icon}</div>
                     </div>
                  )}
                  <div>
                     {title && (
                        <CardTitle className={titleVariants({ variant })}>{title}</CardTitle>
                     )}
                     {description && (
                        <p className={descriptionVariants({ variant })}>{description}</p>
                     )}
                  </div>
               </div>
               {badge && badge}
            </div>
            {children}
         </div>
      );
   }

   // Fallback to children-based rendering
   return (
      <div
         data-slot="card-header"
         className={cardHeaderVariants({ variant, className })}
         {...props}
      >
         {children}
      </div>
   );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         data-slot="card-title"
         className={cn("leading-none font-semibold", className)}
         {...props}
      />
   );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         data-slot="card-description"
         className={cn("text-muted-foreground text-sm", className)}
         {...props}
      />
   );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         data-slot="card-action"
         className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
         {...props}
      />
   );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
   return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         data-slot="card-footer"
         className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
         {...props}
      />
   );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
