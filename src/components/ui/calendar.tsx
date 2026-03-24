import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3 w-full",
        caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-sm font-bold tracking-tight text-foreground",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-xl h-8 w-8",
          "text-muted-foreground hover:text-foreground",
          "bg-muted/60 hover:bg-primary/10 hover:text-primary",
          "transition-all duration-200"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex justify-between",
        head_cell: "text-muted-foreground/70 rounded-md w-9 font-semibold text-[0.65rem] uppercase tracking-widest",
        row: "flex w-full mt-1 justify-between",
        cell: cn(
          "relative h-9 w-9 text-center text-sm p-0",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:rounded-xl",
        ),
        day: cn(
          "h-9 w-9 p-0 font-medium rounded-xl",
          "text-foreground/80 hover:text-foreground",
          "hover:bg-primary/10 hover:text-primary",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
          "aria-selected:opacity-100",
          "inline-flex items-center justify-center",
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "!bg-primary !text-primary-foreground font-bold",
          "shadow-md shadow-primary/25",
          "hover:!bg-primary hover:!text-primary-foreground",
          "focus:!bg-primary focus:!text-primary-foreground",
        ),
        day_today: cn(
          "bg-gradient-to-br from-primary/15 to-primary/5",
          "text-primary font-bold",
          "ring-1 ring-primary/30",
        ),
        day_outside: "day-outside text-muted-foreground/30 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/30",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
