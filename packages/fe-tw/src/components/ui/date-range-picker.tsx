"use client";

import type * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
   value: DateRange;
   onChange: (value: DateRange | undefined) => void;
}

export function DateRangePicker({
   value,
   className,
   onChange,
}: React.HTMLAttributes<HTMLDivElement> & DateRangePickerProps) {
   return (
      <div className={cn("grid gap-2", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                     "w-[300px] justify-start text-left font-normal",
                     !value.to && !value.from && "text-muted-foreground",
                  )}
               >
                  <CalendarIcon />
                  {value?.from ? (
                     value.to ? (
                        <>
                           {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                        </>
                     ) : (
                        format(value.from, "LLL dd, y")
                     )
                  ) : (
                     <span>Pick a date</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={value?.from}
                  selected={value}
                  onSelect={onChange}
                  numberOfMonths={2}
               />
            </PopoverContent>
         </Popover>
      </div>
   );
}
