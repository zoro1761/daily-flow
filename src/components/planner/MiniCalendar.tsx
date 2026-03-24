import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { isDateLocked } from '@/types/task';
import { format, subDays } from 'date-fns';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onSelectDate }: MiniCalendarProps) {
  const minDate = subDays(new Date(), 1); // can go back 1 day (2+ is locked)

  return (
    <div className="glass-card p-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className={cn("p-2 pointer-events-auto w-full")}
        modifiers={{
          locked: (date) => isDateLocked(format(date, 'yyyy-MM-dd')),
        }}
        modifiersClassNames={{
          locked: 'opacity-40',
        }}
      />
    </div>
  );
}
