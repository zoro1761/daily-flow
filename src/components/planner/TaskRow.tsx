import { Task, CATEGORIES, PRIORITIES, STATUSES, TaskStatus, TaskPriority, TaskCategory, isDateLocked, isTimeSlotPast } from '@/types/task';
import { cn } from '@/lib/utils';
import { Trash2, MessageSquare, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskRowProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onRemove: (id: string) => void;
}

const statusConfig: Record<TaskStatus, { bg: string; text: string; dot: string; selectBg: string }> = {
  Done: {
    bg: 'bg-emerald-500/10 ring-emerald-500/20',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    selectBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  Pending: {
    bg: 'bg-red-500/10 ring-red-500/20',
    text: 'text-red-500',
    dot: 'bg-red-500',
    selectBg: 'bg-red-50 border-red-200 text-red-600',
  },
  Skipped: {
    bg: 'bg-amber-500/10 ring-amber-500/20',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    selectBg: 'bg-amber-50 border-amber-200 text-amber-700',
  },
};

const priorityConfig: Record<TaskPriority, { color: string; emoji: string; label: string }> = {
  High: { color: 'text-red-500', emoji: '🔴', label: 'High' },
  Medium: { color: 'text-amber-500', emoji: '🟡', label: 'Medium' },
  Low: { color: 'text-blue-400', emoji: '🔵', label: 'Low' },
};

const categoryConfig: Record<TaskCategory, { stripe: string; badge: string }> = {
  Work: { stripe: 'border-l-[hsl(var(--cat-work))]', badge: 'bg-[hsl(var(--cat-work))]/10 text-[hsl(var(--cat-work))] border-[hsl(var(--cat-work))]/20' },
  Fitness: { stripe: 'border-l-[hsl(var(--cat-fitness))]', badge: 'bg-[hsl(var(--cat-fitness))]/10 text-[hsl(var(--cat-fitness))] border-[hsl(var(--cat-fitness))]/20' },
  Learning: { stripe: 'border-l-[hsl(var(--cat-learning))]', badge: 'bg-[hsl(var(--cat-learning))]/10 text-[hsl(var(--cat-learning))] border-[hsl(var(--cat-learning))]/20' },
  Personal: { stripe: 'border-l-[hsl(var(--cat-personal))]', badge: 'bg-[hsl(var(--cat-personal))]/10 text-[hsl(var(--cat-personal))] border-[hsl(var(--cat-personal))]/20' },
};

export function TaskRow({ task, onUpdate, onRemove }: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);

  const locked = isDateLocked(task.date);
  const pastSlot = isTimeSlotPast(task.date, task.time_slot);
  const isFullyLocked = locked;
  const isTimeLocked = pastSlot && !locked;

  const availableStatuses = isTimeLocked && task.status === 'Pending'
    ? ['Done', 'Skipped'] as TaskStatus[]
    : isTimeLocked
    ? [task.status, ...(['Done', 'Skipped'] as TaskStatus[]).filter(s => s !== task.status)]
    : STATUSES;

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
        "hover:border-border/80 hover:shadow-md hover:shadow-foreground/[0.03]",
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
      <div className="hidden md:flex items-center gap-2.5 p-3.5">
        {/* Time */}
        <div className="font-mono text-[11px] font-bold bg-muted/60 text-muted-foreground px-2.5 py-1.5 rounded-xl w-[4.2rem] text-center shrink-0 tracking-wider">
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
            "flex-1 bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/35 min-w-0",
            task.status === 'Done' && 'line-through text-muted-foreground',
            (isFullyLocked || isTimeLocked) && 'cursor-not-allowed'
          )}
        />

        {/* Priority select */}
        <Select
          value={task.priority}
          onValueChange={(val) => onUpdate(task.id, { priority: val as TaskPriority })}
          disabled={isFullyLocked || isTimeLocked}
        >
          <SelectTrigger className={cn("w-auto h-7 gap-1 border-0 bg-transparent px-2 text-[10px] font-bold shadow-none focus:ring-0", priorityConfig[task.priority].color)}>
            <span>{priorityConfig[task.priority].emoji}</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[120px] rounded-xl border-border/50 shadow-xl">
            {PRIORITIES.map(p => (
              <SelectItem key={p} value={p} className="text-xs font-semibold rounded-lg">
                <span className="flex items-center gap-2">
                  <span>{priorityConfig[p].emoji}</span>
                  <span className={priorityConfig[p].color}>{p}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category select */}
        <Select
          value={task.category}
          onValueChange={(val) => onUpdate(task.id, { category: val as TaskCategory })}
          disabled={isFullyLocked || isTimeLocked}
        >
          <SelectTrigger className={cn("w-auto h-7 gap-1 px-2.5 text-[10px] font-semibold rounded-lg shadow-none focus:ring-0 border", catConf.badge)}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[130px] rounded-xl border-border/50 shadow-xl">
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c} className="text-xs font-semibold rounded-lg">
                <span className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", categoryConfig[c].stripe.replace('border-l-', 'bg-'))} style={{ backgroundColor: `hsl(var(--cat-${c.toLowerCase()}))` }} />
                  {c}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status select */}
        <Select
          value={task.status}
          onValueChange={(val) => onUpdate(task.id, { status: val as TaskStatus })}
          disabled={isFullyLocked}
        >
          <SelectTrigger className={cn("w-auto h-7 gap-1.5 px-2.5 text-[10px] font-bold rounded-xl shadow-none focus:ring-0 ring-1", statusConf.bg, statusConf.text)}>
            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusConf.dot)} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[120px] rounded-xl border-border/50 shadow-xl">
            {availableStatuses.map(s => (
              <SelectItem key={s} value={s} className="text-xs font-semibold rounded-lg">
                <span className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", statusConfig[s].dot)} />
                  <span className={statusConfig[s].text}>{s}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Actions */}
        {!isFullyLocked && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
              <MessageSquare size={13} />
            </button>
            {!isTimeLocked && (
              <button onClick={() => onRemove(task.id)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 size={13} />
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

          {/* Mobile status */}
          <Select
            value={task.status}
            onValueChange={(val) => onUpdate(task.id, { status: val as TaskStatus })}
            disabled={isFullyLocked}
          >
            <SelectTrigger className={cn("w-auto h-6 gap-1 px-2 text-[9px] font-bold rounded-lg shadow-none focus:ring-0 ring-1", statusConf.bg, statusConf.text)}>
              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusConf.dot)} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[110px] rounded-xl shadow-xl">
              {availableStatuses.map(s => (
                <SelectItem key={s} value={s} className="text-xs font-semibold rounded-lg">
                  <span className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", statusConfig[s].dot)} />
                    <span className={statusConfig[s].text}>{s}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-md border", catConf.badge)}>
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
                <Select value={task.priority} onValueChange={(val) => onUpdate(task.id, { priority: val as TaskPriority })} disabled={isTimeLocked}>
                  <SelectTrigger className="w-auto h-7 gap-1 px-2 text-[10px] font-semibold bg-muted/50 border-border/50 rounded-lg shadow-none focus:ring-0">
                    <span>{priorityConfig[task.priority].emoji}</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl">
                    {PRIORITIES.map(p => (
                      <SelectItem key={p} value={p} className="text-xs font-semibold rounded-lg">
                        {priorityConfig[p].emoji} {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={task.category} onValueChange={(val) => onUpdate(task.id, { category: val as TaskCategory })} disabled={isTimeLocked}>
                  <SelectTrigger className={cn("w-auto h-7 gap-1 px-2 text-[10px] font-semibold rounded-lg shadow-none focus:ring-0 border", catConf.badge)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c} className="text-xs font-semibold rounded-lg">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isTimeLocked && (
                  <button onClick={() => onRemove(task.id)} className="ml-auto text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <textarea
                value={task.notes}
                onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
                placeholder="Add notes..."
                disabled={isTimeLocked}
                className="mt-2 w-full text-xs bg-muted/30 rounded-xl p-3 border border-border/30 outline-none resize-none text-foreground placeholder:text-muted-foreground/35"
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
              className="mx-3.5 mb-3.5 ml-[4.75rem] w-[calc(100%-5.75rem)] text-xs bg-muted/30 rounded-xl p-3 border border-border/30 outline-none resize-none text-foreground placeholder:text-muted-foreground/35"
              rows={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
