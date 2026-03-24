import { Task, isDateLocked } from '@/types/task';
import { TaskRow } from './TaskRow';
import { format } from 'date-fns';
import { Plus, Copy, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
  const completionRate = filledTasks.length > 0 ? Math.round((doneTasks.length / filledTasks.length) * 100) : 0;

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {format(date, 'EEEE')}
                </h1>
                {isToday && (
                  <span className="text-[10px] font-bold uppercase tracking-widest gradient-hero bg-clip-text text-transparent">
                    Today
                  </span>
                )}
                {locked && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">
                {format(date, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mini stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full status-dot-done" />
                <span className="text-xs font-semibold text-foreground">{doneTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full status-dot-pending" />
                <span className="text-xs font-semibold text-foreground">{filledTasks.length - doneTasks.length - skippedTasks.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full status-dot-skipped" />
                <span className="text-xs font-semibold text-foreground">{skippedTasks.length}</span>
              </div>
            </div>

            {/* Progress ring */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="2.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--status-done))"
                  strokeWidth="2.5"
                  strokeDasharray={`${completionRate}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {completionRate}%
              </span>
            </div>

            {!locked && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyPrevious}
                className="text-xs gap-1.5 font-semibold"
              >
                <Copy size={12} />
                Copy prev day
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Sparkles size={20} className="text-primary animate-pulse-glow" />
            <span className="ml-2 text-sm text-muted-foreground">Loading tasks...</span>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TaskRow
                    task={task}
                    onUpdate={onUpdateTask}
                    onRemove={onRemoveTask}
                  />
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
                  className="font-mono text-sm bg-muted rounded-lg px-3 py-2 border-none outline-none text-foreground"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (newTime) {
                      onAddSlot(newTime);
                      setNewTime('');
                    }
                  }}
                  className="text-xs gap-1.5 text-muted-foreground hover:text-primary"
                >
                  <Plus size={14} />
                  Add time slot
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
