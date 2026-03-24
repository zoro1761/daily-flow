import { Task, CATEGORIES, PRIORITIES, STATUSES, TaskStatus, TaskPriority, TaskCategory } from '@/types/task';
import { cn } from '@/lib/utils';
import { Trash2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskRowProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onRemove: (id: string) => void;
}

const statusStyles: Record<TaskStatus, string> = {
  Done: 'status-done',
  Pending: 'status-pending',
  Skipped: 'status-skipped',
};

const statusDotStyles: Record<TaskStatus, string> = {
  Done: 'status-dot-done',
  Pending: 'status-dot-pending',
  Skipped: 'status-dot-skipped',
};

const priorityStyles: Record<TaskPriority, string> = {
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
};

const categoryColors: Record<TaskCategory, string> = {
  Work: 'bg-[hsl(var(--cat-work))]',
  Fitness: 'bg-[hsl(var(--cat-fitness))]',
  Learning: 'bg-[hsl(var(--cat-learning))]',
  Personal: 'bg-[hsl(var(--cat-personal))]',
};

export function TaskRow({ task, onUpdate, onRemove }: TaskRowProps) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={cn(
        "group glass-card p-3 transition-all hover:shadow-md",
        task.status === 'Done' && 'opacity-75'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Time */}
        <span className="font-mono text-sm text-muted-foreground w-14 shrink-0">
          {task.timeSlot}
        </span>

        {/* Category dot */}
        <div className={cn('w-2 h-2 rounded-full shrink-0', categoryColors[task.category])} />

        {/* Task input */}
        <input
          type="text"
          value={task.taskText}
          onChange={(e) => onUpdate(task.id, { taskText: e.target.value })}
          placeholder="What needs to be done?"
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/50",
            task.status === 'Done' && 'line-through'
          )}
        />

        {/* Priority */}
        <select
          value={task.priority}
          onChange={(e) => onUpdate(task.id, { priority: e.target.value as TaskPriority })}
          className={cn(
            "text-xs font-medium bg-transparent border-none outline-none cursor-pointer",
            priorityStyles[task.priority]
          )}
        >
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Category */}
        <select
          value={task.category}
          onChange={(e) => onUpdate(task.id, { category: e.target.value as TaskCategory })}
          className="text-xs bg-transparent border-none outline-none cursor-pointer text-muted-foreground"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={task.status}
          onChange={(e) => onUpdate(task.id, { status: e.target.value as TaskStatus })}
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-md cursor-pointer border-none outline-none",
            statusStyles[task.status]
          )}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Actions */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        >
          <MessageSquare size={14} />
        </button>
        <button
          onClick={() => onRemove(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={task.notes}
              onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
              placeholder="Add notes..."
              className="mt-2 ml-[4.25rem] w-[calc(100%-4.25rem)] text-xs bg-muted/50 rounded-md p-2 border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/50"
              rows={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
