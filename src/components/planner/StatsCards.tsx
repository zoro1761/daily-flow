import { Task } from '@/types/task';
import { CheckCircle, Clock, SkipForward, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  tasks: Task[];
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const filled = tasks.filter(t => t.task_text.trim());
  const done = filled.filter(t => t.status === 'Done').length;
  const pending = filled.filter(t => t.status === 'Pending').length;
  const skipped = filled.filter(t => t.status === 'Skipped').length;

  const focusScore = filled.reduce((acc, t) => {
    if (t.status !== 'Done') return acc;
    return acc + (t.priority === 'High' ? 3 : t.priority === 'Medium' ? 2 : 1);
  }, 0);

  const stats = [
    {
      label: 'Done', value: done, icon: CheckCircle,
      bg: 'bg-[hsl(var(--status-done))]/10',
      iconColor: 'text-[hsl(var(--status-done))]',
      valueColor: 'text-[hsl(var(--status-done))]',
      ring: 'ring-[hsl(var(--status-done))]/20',
    },
    {
      label: 'Pending', value: pending, icon: Clock,
      bg: 'bg-[hsl(var(--status-pending))]/10',
      iconColor: 'text-[hsl(var(--status-pending))]',
      valueColor: 'text-[hsl(var(--status-pending))]',
      ring: 'ring-[hsl(var(--status-pending))]/20',
    },
    {
      label: 'Skipped', value: skipped, icon: SkipForward,
      bg: 'bg-[hsl(var(--status-skipped))]/10',
      iconColor: 'text-[hsl(var(--status-skipped))]',
      valueColor: 'text-[hsl(var(--status-skipped))]',
      ring: 'ring-[hsl(var(--status-skipped))]/20',
    },
    {
      label: 'Focus', value: focusScore, icon: Zap,
      bg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-primary',
      ring: 'ring-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 md:px-6 py-4 border-b border-border/50">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
          className={cn(
            "rounded-2xl p-4 ring-1 transition-all hover:scale-[1.02]",
            stat.bg, stat.ring,
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
            <stat.icon size={16} className={stat.iconColor} />
          </div>
          <span className={cn("text-3xl md:text-4xl font-bold", stat.valueColor)}>{stat.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
