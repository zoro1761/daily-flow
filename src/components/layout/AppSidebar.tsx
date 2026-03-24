import { MiniCalendar } from '@/components/planner/MiniCalendar';
import { CalendarDays, BarChart3, Target, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'planner' as View, label: 'Planner', icon: CalendarDays },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setMobileOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    onSelectDate(date);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center shadow-lg shadow-primary/20">
            <Target size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">FlowDay</h2>
            <p className="text-[10px] text-muted-foreground font-mono">Productivity Engine</p>
          </div>
        </div>
        {/* Close on mobile */}
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground p-1">
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-1.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
              currentView === item.id
                ? "gradient-hero text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Calendar */}
      <div className="px-3 py-2 flex-1 overflow-y-auto">
        <MiniCalendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
      </div>

      {/* User / Footer */}
      <div className="px-4 py-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center shrink-0 text-[10px] font-bold text-primary-foreground">
            {userEmail?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">{userEmail}</p>
            <p className="text-[10px] text-muted-foreground">Plan → Execute → Improve</p>
          </div>
          <button
            onClick={onSignOut}
            className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-xl hover:bg-destructive/10"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-hero flex items-center justify-center shadow-md shadow-primary/20">
            <Target size={16} className="text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">FlowDay</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-foreground p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-80 bg-card border-r border-border/50 flex flex-col shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[280px] border-r border-border/50 flex-col shrink-0 bg-card">
        {sidebarContent}
      </aside>
    </>
  );
}
