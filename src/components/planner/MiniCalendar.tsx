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
    <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className={cn("p-2 pointer-events-auto")}
        modifiers={{
          locked: (date) => isDateLocked(format(date, 'yyyy-MM-dd')),
        }}
        modifiersClassNames={{
          locked: 'opacity-25 line-through',
        }}
      />
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 px-2 pb-2.5 pt-0.5 border-t border-border/30">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[8px] font-medium text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30 ring-1 ring-primary/25" />
          <span className="text-[8px] font-medium text-muted-foreground">Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
          <span className="text-[8px] font-medium text-muted-foreground">Locked</span>
        </div>
      </div>
    </div>
  );
}
