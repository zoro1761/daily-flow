import { MiniCalendar } from '@/components/planner/MiniCalendar';
import { CalendarDays, BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'planner' | 'analytics';

interface AppSidebarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function AppSidebar({ selectedDate, onSelectDate, currentView, onViewChange }: AppSidebarProps) {
  const navItems = [
    { id: 'planner' as View, label: 'Planner', icon: CalendarDays },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Target size={16} className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-tight">FlowDay</h2>
          <p className="text-[10px] text-muted-foreground">Productivity Engine</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              currentView === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Calendar */}
      <div className="px-3 py-2 flex-1">
        <MiniCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Plan → Execute → Analyze → Improve
        </p>
      </div>
    </aside>
  );
}
