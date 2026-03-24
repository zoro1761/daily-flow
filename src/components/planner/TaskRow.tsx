import { Task, CATEGORIES, PRIORITIES, STATUSES, TaskStatus, TaskPriority, TaskCategory, isDateLocked, isTimeSlotPast } from '@/types/task';
import { cn } from '@/lib/utils';
import { Trash2, MessageSquare, Lock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskRowProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onRemove: (id: string) => void;
}

const statusStyles: Record<TaskStatus, string> = {
  Done: 'status-done glow-done',
  Pending: 'status-pending glow-pending',
  Skipped: 'status-skipped glow-skipped',
};

const priorityStyles: Record<TaskPriority, string> = {
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
};

const categoryStripe: Record<TaskCategory, string> = {
  Work: 'cat-stripe-work',
  Fitness: 'cat-stripe-fitness',
  Learning: 'cat-stripe-learning',
  Personal: 'cat-stripe-personal',
};

const categoryBadge: Record<TaskCategory, string> = {
  Work: 'bg-[hsl(var(--cat-work))]/15 text-[hsl(var(--cat-work))]',
  Fitness: 'bg-[hsl(var(--cat-fitness))]/15 text-[hsl(var(--cat-fitness))]',
  Learning: 'bg-[hsl(var(--cat-learning))]/15 text-[hsl(var(--cat-learning))]',
  Personal: 'bg-[hsl(var(--cat-personal))]/15 text-[hsl(var(--cat-personal))]',
};

export function TaskRow({ task, onUpdate, onRemove }: TaskRowProps) {
  const [showNotes, setShowNotes] = useState(false);

  const locked = isDateLocked(task.date);
  const pastSlot = isTimeSlotPast(task.date, task.time_slot);
  const isFullyLocked = locked;
  const isTimeLocked = pastSlot && !locked; // past time but within 2 days

  // Allowed statuses when time is past
  const allowedStatuses = isTimeLocked ? ['Done', 'Skipped'] as TaskStatus[] : STATUSES;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group relative glass-card p-4 transition-all hover:shadow-md",
        categoryStripe[task.category],
        task.status === 'Done' && 'opacity-70',
        isFullyLocked && 'opacity-50'
      )}
    >
      {isFullyLocked && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
          <Lock size={16} className="text-muted-foreground" />
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Time badge */}
        <div className="font-mono text-xs font-semibold bg-muted/80 text-muted-foreground px-2.5 py-1.5 rounded-lg w-16 text-center shrink-0">
          {task.time_slot}
        </div>

        {/* Task input */}
        <input
          type="text"
          value={task.taskText}
          onChange={(e) => onUpdate(task.id, { taskText: e.target.value })}
          placeholder="What needs to be done?"
          disabled={isFullyLocked || isTimeLocked}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/40",
            task.status === 'Done' && 'line-through text-muted-foreground',
            (isFullyLocked || isTimeLocked) && 'cursor-not-allowed'
          )}
        />

        {/* Priority badge */}
        <select
          value={task.priority}
          onChange={(e) => onUpdate(task.id, { priority: e.target.value as TaskPriority })}
          disabled={isFullyLocked || isTimeLocked}
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer",
            priorityStyles[task.priority],
            (isFullyLocked || isTimeLocked) && 'cursor-not-allowed'
          )}
        >
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Category */}
        <select
          value={task.category}
          onChange={(e) => onUpdate(task.id, { category: e.target.value as TaskCategory })}
          disabled={isFullyLocked || isTimeLocked}
          className={cn(
            "text-[10px] font-semibold px-2 py-1 rounded-md border-none outline-none cursor-pointer",
            categoryBadge[task.category],
            (isFullyLocked || isTimeLocked) && 'cursor-not-allowed'
          )}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status */}
        <select
          value={task.status}
          onChange={(e) => onUpdate(task.id, { status: e.target.value as TaskStatus })}
          disabled={isFullyLocked}
          className={cn(
            "text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer border-none outline-none",
            statusStyles[task.status],
            isFullyLocked && 'cursor-not-allowed'
          )}
        >
          {(isTimeLocked && task.status === 'Pending' ? allowedStatuses : 
            isTimeLocked ? [task.status, ...allowedStatuses.filter(s => s !== task.status)] : 
            STATUSES
          ).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Actions */}
        {!isFullyLocked && (
          <>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
            >
              <MessageSquare size={14} />
            </button>
            {!isTimeLocked && (
              <button
                onClick={() => onRemove(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showNotes && !isFullyLocked && (
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
              disabled={isTimeLocked}
              className="mt-3 ml-[4.75rem] w-[calc(100%-4.75rem)] text-xs bg-muted/50 rounded-lg p-3 border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/40"
              rows={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
