import { MiniCalendar } from '@/components/planner/MiniCalendar';
import { CalendarDays, BarChart3, Target, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'planner' | 'analytics';

interface AppSidebarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  currentView: View;
  onViewChange: (view: View) => void;
  userEmail?: string;
  onSignOut: () => void;
}

export function AppSidebar({ selectedDate, onSelectDate, currentView, onViewChange, userEmail, onSignOut }: AppSidebarProps) {
  const navItems = [
    { id: 'planner' as View, label: 'Planner', icon: CalendarDays },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-72 border-r border-border flex flex-col shrink-0" style={{ background: 'var(--gradient-sidebar)' }}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center glow-primary">
          <Target size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">FlowDay</h2>
          <p className="text-[10px] text-muted-foreground font-mono">Productivity Engine</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
              currentView === item.id
                ? "gradient-hero text-primary-foreground shadow-md glow-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Calendar */}
      <div className="px-3 py-2 flex-1 overflow-y-auto">
        <MiniCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </div>

      {/* User / Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{userEmail}</p>
            <p className="text-[10px] text-muted-foreground">Plan → Execute → Improve</p>
          </div>
          <button
            onClick={onSignOut}
            className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-muted"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
