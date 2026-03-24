import { Task, CATEGORIES, PRIORITIES, STATUSES, TaskStatus, TaskPriority, TaskCategory, isDateLocked, isTimeSlotPast } from '@/types/task';
import { cn } from '@/lib/utils';
import { Trash2, MessageSquare, Lock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskRowProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onRemove: (id: string) => void;
}

const statusConfig: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  Done: {
    bg: 'bg-[hsl(var(--status-done))]/10 ring-[hsl(var(--status-done))]/25',
    text: 'text-[hsl(var(--status-done))]',
    dot: 'bg-[hsl(var(--status-done))]',
  },
  Pending: {
    bg: 'bg-[hsl(var(--status-pending))]/10 ring-[hsl(var(--status-pending))]/25',
    text: 'text-[hsl(var(--status-pending))]',
    dot: 'bg-[hsl(var(--status-pending))]',
  },
  Skipped: {
    bg: 'bg-[hsl(var(--status-skipped))]/10 ring-[hsl(var(--status-skipped))]/25',
    text: 'text-[hsl(var(--status-skipped))]',
    dot: 'bg-[hsl(var(--status-skipped))]',
  },
};

const priorityConfig: Record<TaskPriority, { color: string; emoji: string }> = {
  High: { color: 'text-[hsl(var(--priority-high))]', emoji: '🔴' },
  Medium: { color: 'text-[hsl(var(--priority-medium))]', emoji: '🟡' },
  Low: { color: 'text-[hsl(var(--priority-low))]', emoji: '🔵' },
};

const categoryConfig: Record<TaskCategory, { stripe: string; badge: string; color: string }> = {
  Work: {
    stripe: 'border-l-[hsl(var(--cat-work))]',
    badge: 'bg-[hsl(var(--cat-work))]/10 text-[hsl(var(--cat-work))]',
    color: 'hsl(var(--cat-work))',
  },
  Fitness: {
    stripe: 'border-l-[hsl(var(--cat-fitness))]',
    badge: 'bg-[hsl(var(--cat-fitness))]/10 text-[hsl(var(--cat-fitness))]',
    color: 'hsl(var(--cat-fitness))',
  },
  Learning: {
    stripe: 'border-l-[hsl(var(--cat-learning))]',
    badge: 'bg-[hsl(var(--cat-learning))]/10 text-[hsl(var(--cat-learning))]',
    color: 'hsl(var(--cat-learning))',
  },
  Personal: {
    stripe: 'border-l-[hsl(var(--cat-personal))]',
    badge: 'bg-[hsl(var(--cat-personal))]/10 text-[hsl(var(--cat-personal))]',
    color: 'hsl(var(--cat-personal))',
  },
};

export function TaskRow({ task, onUpdate, onRemove }: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);

  const locked = isDateLocked(task.date);
  const pastSlot = isTimeSlotPast(task.date, task.time_slot);
  const isFullyLocked = locked;
  const isTimeLocked = pastSlot && !locked;

  const allowedStatuses = isTimeLocked ? ['Done', 'Skipped'] as TaskStatus[] : STATUSES;

  const catConf = categoryConfig[task.category];
  const statusConf = statusConfig[task.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-2xl bg-card border border-border/40 transition-all duration-200",
        "hover:border-border hover:shadow-md hover:shadow-foreground/[0.03]",
        "border-l-[3px]",
        catConf.stripe,
        task.status === 'Done' && 'opacity-60',
        isFullyLocked && 'opacity-40'
      )}
    >
      {isFullyLocked && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
          <Lock size={16} className="text-muted-foreground" />
        </div>
      )}

      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-3 p-4">
        {/* Time */}
        <div className="font-mono text-[11px] font-bold bg-muted/60 text-muted-foreground px-3 py-2 rounded-xl w-[4.5rem] text-center shrink-0 tracking-wider">
          {task.time_slot}
        </div>

        {/* Task input */}
        <input
          type="text"
          value={task.task_text}
          onChange={(e) => onUpdate(task.id, { task_text: e.target.value })}
          placeholder="What needs to be done?"
          disabled={isFullyLocked || isTimeLocked}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/35",
            task.status === 'Done' && 'line-through text-muted-foreground',
            (isFullyLocked || isTimeLocked) && 'cursor-not-allowed'
          )}
        />

        {/* Priority */}
        <select
          value={task.priority}
          onChange={(e) => onUpdate(task.id, { priority: e.target.value as TaskPriority })}
          disabled={isFullyLocked || isTimeLocked}
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer appearance-none",
            priorityConfig[task.priority].color,
            (isFullyLocked || isTimeLocked) && 'cursor-not-allowed'
          )}
        >
          {PRIORITIES.map(p => <option key={p} value={p}>{priorityConfig[p].emoji} {p}</option>)}
        </select>

        {/* Category */}
        <div className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-lg", catConf.badge)}>
          <select
            value={task.category}
            onChange={(e) => onUpdate(task.id, { category: e.target.value as TaskCategory })}
            disabled={isFullyLocked || isTimeLocked}
            className="bg-transparent border-none outline-none cursor-pointer appearance-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className={cn("flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl ring-1", statusConf.bg, statusConf.text)}>
          <div className={cn("w-1.5 h-1.5 rounded-full", statusConf.dot)} />
          <select
            value={task.status}
            onChange={(e) => onUpdate(task.id, { status: e.target.value as TaskStatus })}
            disabled={isFullyLocked}
            className="bg-transparent border-none outline-none cursor-pointer appearance-none font-bold"
          >
            {(isTimeLocked && task.status === 'Pending' ? allowedStatuses :
              isTimeLocked ? [task.status, ...allowedStatuses.filter(s => s !== task.status)] :
              STATUSES
            ).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Actions */}
        {!isFullyLocked && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-primary p-1 rounded-lg hover:bg-primary/10 transition-colors">
              <MessageSquare size={14} />
            </button>
            {!isTimeLocked && (
              <button onClick={() => onRemove(task.id)} className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="font-mono text-[10px] font-bold bg-muted/60 text-muted-foreground px-2 py-1 rounded-lg shrink-0">
            {task.time_slot}
          </div>
          <div className={cn("flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-lg ring-1", statusConf.bg, statusConf.text)}>
            <div className={cn("w-1.5 h-1.5 rounded-full", statusConf.dot)} />
            <select
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value as TaskStatus })}
              disabled={isFullyLocked}
              className="bg-transparent border-none outline-none cursor-pointer appearance-none font-bold text-[9px]"
            >
              {(isTimeLocked && task.status === 'Pending' ? allowedStatuses :
                isTimeLocked ? [task.status, ...allowedStatuses.filter(s => s !== task.status)] :
                STATUSES
              ).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-md", catConf.badge)}>
            {task.category}
          </div>
          <span className="text-[10px] ml-auto">{priorityConfig[task.priority].emoji}</span>
          {!isFullyLocked && (
            <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground p-0.5">
              <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
            </button>
          )}
        </div>
        <input
          type="text"
          value={task.task_text}
          onChange={(e) => onUpdate(task.id, { task_text: e.target.value })}
          placeholder="What needs to be done?"
          disabled={isFullyLocked || isTimeLocked}
          className={cn(
            "w-full bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/35",
            task.status === 'Done' && 'line-through text-muted-foreground',
          )}
        />

        <AnimatePresence>
          {expanded && !isFullyLocked && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                <select value={task.priority} onChange={(e) => onUpdate(task.id, { priority: e.target.value as TaskPriority })} disabled={isTimeLocked} className="text-[10px] bg-muted/50 rounded-lg px-2 py-1 border-none outline-none text-foreground">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={task.category} onChange={(e) => onUpdate(task.id, { category: e.target.value as TaskCategory })} disabled={isTimeLocked} className="text-[10px] bg-muted/50 rounded-lg px-2 py-1 border-none outline-none text-foreground">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {!isTimeLocked && (
                  <button onClick={() => onRemove(task.id)} className="ml-auto text-muted-foreground hover:text-destructive p-1">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <textarea
                value={task.notes}
                onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
                placeholder="Add notes..."
                disabled={isTimeLocked}
                className="mt-2 w-full text-xs bg-muted/30 rounded-xl p-3 border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/35"
                rows={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop notes */}
      <AnimatePresence>
        {expanded && !isFullyLocked && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="hidden md:block overflow-hidden">
            <textarea
              value={task.notes}
              onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
              placeholder="Add notes..."
              disabled={isTimeLocked}
              className="mx-4 mb-4 ml-[5.5rem] w-[calc(100%-6.5rem)] text-xs bg-muted/30 rounded-xl p-3 border-none outline-none resize-none text-foreground placeholder:text-muted-foreground/35"
              rows={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
