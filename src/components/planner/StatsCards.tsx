import { Task } from '@/types/task';
import { CheckCircle, Clock, SkipForward, Zap } from 'lucide-react';

interface StatsCardsProps {
  tasks: Task[];
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const filled = tasks.filter(t => t.taskText.trim());
  const done = filled.filter(t => t.status === 'Done').length;
  const pending = filled.filter(t => t.status === 'Pending').length;
  const skipped = filled.filter(t => t.status === 'Skipped').length;

  const focusScore = filled.reduce((acc, t) => {
    if (t.status !== 'Done') return acc;
    const pts = t.priority === 'High' ? 3 : t.priority === 'Medium' ? 2 : 1;
    return acc + pts;
  }, 0);

  const stats = [
    { label: 'Done', value: done, icon: CheckCircle, className: 'status-done' },
    { label: 'Pending', value: pending, icon: Clock, className: 'status-pending' },
    { label: 'Skipped', value: skipped, icon: SkipForward, className: 'status-skipped' },
    { label: 'Focus Score', value: focusScore, icon: Zap, className: 'bg-primary/10 text-primary' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b border-border">
      {stats.map(stat => (
        <div key={stat.label} className={`rounded-lg p-3 ${stat.className}`}>
          <div className="flex items-center gap-2 mb-1">
            <stat.icon size={14} />
            <span className="text-xs font-medium">{stat.label}</span>
          </div>
          <span className="text-2xl font-bold">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
