import { Task } from '@/types/task';
import { CheckCircle, Clock, SkipForward, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { label: 'Done', value: done, icon: CheckCircle, bg: 'status-done', glow: 'glow-done' },
    { label: 'Pending', value: pending, icon: Clock, bg: 'status-pending', glow: 'glow-pending' },
    { label: 'Skipped', value: skipped, icon: SkipForward, bg: 'status-skipped', glow: 'glow-skipped' },
    { label: 'Focus Score', value: focusScore, icon: Zap, bg: 'bg-primary/10 text-primary', glow: 'glow-primary' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b border-border">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`rounded-xl p-4 ${stat.bg} ${stat.glow} transition-all`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
          </div>
          <span className="text-3xl font-bold">{stat.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
