import { Task, isDateLocked } from '@/types/task';
import { TaskRow } from './TaskRow';
import { format } from 'date-fns';
import { Plus, Copy, Lock, Sparkles, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DayPlannerProps {
  date: Date;
  tasks: Task[];
  loading: boolean;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onRemoveTask: (id: string) => void;
  onAddSlot: (timeSlot: string) => void;
  onCopyPrevious: () => void;
}

export function DayPlanner({ date, tasks, loading, onUpdateTask, onRemoveTask, onAddSlot, onCopyPrevious }: DayPlannerProps) {
  const [newTime, setNewTime] = useState('');
  const dateStr = format(date, 'yyyy-MM-dd');
  const locked = isDateLocked(dateStr);

  const filledTasks = tasks.filter(t => t.task_text.trim());
  const doneTasks = filledTasks.filter(t => t.status === 'Done');
  const skippedTasks = filledTasks.filter(t => t.status === 'Skipped');
  const pendingTasks = filledTasks.length - doneTasks.length - skippedTasks.length;
  const completionRate = filledTasks.length > 0 ? Math.round((doneTasks.length / filledTasks.length) * 100) : 0;

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center shrink-0",
              isToday ? "gradient-hero text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
            )}>
              <span className="text-[10px] font-bold uppercase leading-none">{format(date, 'MMM')}</span>
              <span className="text-lg md:text-xl font-bold leading-none">{format(date, 'd')}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {format(date, 'EEEE')}
                </h1>
                {isToday && (
                  <span className="text-[9px] font-bold uppercase tracking-widest gradient-hero text-primary-foreground px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
                {locked && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    <Lock size={9} /> Locked
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {format(date, 'MMMM yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Status dots */}
            <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-3 py-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--status-done))]" />
                <span className="text-xs font-bold text-foreground">{doneTasks.length}</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--status-pending))]" />
                <span className="text-xs font-bold text-foreground">{pendingTasks}</span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--status-skipped))]" />
                <span className="text-xs font-bold text-foreground">{skippedTasks.length}</span>
              </div>
            </div>

            {/* Progress ring */}
            <div className="relative w-11 h-11 md:w-12 md:h-12">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="hsl(var(--border))" strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="hsl(var(--status-done))" strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`} strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                {completionRate}%
              </span>
            </div>

            {!locked && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyPrevious}
                className="text-xs gap-1.5 font-semibold rounded-xl hidden sm:flex"
              >
                <Copy size={12} />
                Copy prev
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center animate-pulse-glow shadow-lg shadow-primary/20">
              <Sparkles size={20} className="text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Loading your tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <CalendarDays size={28} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No tasks for this day</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                >
                  <TaskRow task={task} onUpdate={onUpdateTask} onRemove={onRemoveTask} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add slot */}
            {!locked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 pt-3"
              >
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="font-mono text-sm bg-muted/50 rounded-xl px-3 py-2 border border-border/50 outline-none text-foreground"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (newTime) { onAddSlot(newTime); setNewTime(''); }
                  }}
                  className="text-xs gap-1.5 text-muted-foreground hover:text-primary rounded-xl"
                >
                  <Plus size={14} />
                  Add slot
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
