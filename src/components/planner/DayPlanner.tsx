import { Task } from '@/types/task';
import { TaskRow } from './TaskRow';
import { format } from 'date-fns';
import { Plus, Copy } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface DayPlannerProps {
  date: Date;
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onRemoveTask: (id: string) => void;
  onAddSlot: (timeSlot: string) => void;
  onCopyPrevious: () => void;
}

export function DayPlanner({ date, tasks, onUpdateTask, onRemoveTask, onAddSlot, onCopyPrevious }: DayPlannerProps) {
  const [newTime, setNewTime] = useState('');

  const filledTasks = tasks.filter(t => t.taskText.trim());
  const doneTasks = filledTasks.filter(t => t.status === 'Done');
  const completionRate = filledTasks.length > 0 ? Math.round((doneTasks.length / filledTasks.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {format(date, 'EEEE')}
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {format(date, 'MMMM d, yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress ring */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--status-done))"
                  strokeWidth="3"
                  strokeDasharray={`${completionRate}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {completionRate}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {doneTasks.length}/{filledTasks.length}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onCopyPrevious}
            className="text-xs gap-1"
          >
            <Copy size={12} />
            Copy previous
          </Button>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onRemove={onRemoveTask}
            />
          ))}
        </AnimatePresence>

        {/* Add slot */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="font-mono text-sm bg-muted/50 rounded-md px-3 py-2 border-none outline-none text-foreground"
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
            className="text-xs gap-1 text-muted-foreground"
          >
            <Plus size={14} />
            Add time slot
          </Button>
        </div>
      </div>
    </div>
  );
}
