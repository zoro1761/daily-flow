import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col space-y-3",
        month: "space-y-2 w-full",
        caption: "flex justify-center pt-1 relative items-center mb-1",
        caption_label: "text-xs font-bold tracking-tight text-foreground",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-lg h-7 w-7",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-primary/10 hover:text-primary",
          "transition-all duration-200"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground/60 flex-1 text-center font-semibold text-[0.6rem] uppercase tracking-wider py-1",
        row: "flex w-full mt-0.5",
        cell: cn(
          "relative flex-1 text-center text-xs p-0.5",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-primary/8 [&:has([aria-selected])]:rounded-lg",
        ),
        day: cn(
          "h-8 w-full p-0 font-medium rounded-lg text-xs",
          "text-foreground/80 hover:text-foreground",
          "hover:bg-primary/10 hover:text-primary",
          "transition-all duration-150",
          "focus:outline-none focus:ring-1 focus:ring-primary/30",
          "aria-selected:opacity-100",
          "inline-flex items-center justify-center",
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "!bg-primary !text-primary-foreground font-bold",
          "shadow-sm shadow-primary/20",
          "hover:!bg-primary hover:!text-primary-foreground",
          "focus:!bg-primary focus:!text-primary-foreground",
        ),
        day_today: cn(
          "bg-primary/10 text-primary font-bold",
          "ring-1 ring-primary/25",
        ),
        day_outside: "day-outside text-muted-foreground/25 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/25",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-3.5 w-3.5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-3.5 w-3.5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
