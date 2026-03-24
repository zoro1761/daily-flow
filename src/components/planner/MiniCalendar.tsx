import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onSelectDate }: MiniCalendarProps) {
  return (
    <div className="glass-card p-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className={cn("p-2 pointer-events-auto w-full")}
      />
    </div>
  );
}
