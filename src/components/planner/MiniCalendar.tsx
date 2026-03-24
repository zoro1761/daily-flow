import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { isDateLocked } from '@/types/task';
import { format } from 'date-fns';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onSelectDate }: MiniCalendarProps) {
  return (
    <div className="rounded-2xl bg-card border border-border/50 p-1 shadow-sm">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className={cn("p-2 pointer-events-auto w-full")}
        modifiers={{
          locked: (date) => isDateLocked(format(date, 'yyyy-MM-dd')),
        }}
        modifiersClassNames={{
          locked: 'opacity-30 line-through',
        }}
      />
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-3 pb-3 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/30" />
          <span className="text-[9px] font-medium text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary/20 ring-1 ring-primary/30" />
          <span className="text-[9px] font-medium text-muted-foreground">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
          <span className="text-[9px] font-medium text-muted-foreground">Locked</span>
        </div>
      </div>
    </div>
  );
}
