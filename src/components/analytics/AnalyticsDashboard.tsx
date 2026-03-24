import { useEffect, useState } from 'react';
import { Task, TaskCategory, TaskStatus } from '@/types/task';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  userId: string;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  Done: 'hsl(155, 75%, 42%)',
  Pending: 'hsl(4, 80%, 56%)',
  Skipped: 'hsl(40, 95%, 52%)',
};

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .neq('task_text', '')
      .then(({ data }) => {
        setTasks((data || []) as Task[]);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center animate-pulse-glow shadow-lg shadow-primary/20">
          <Sparkles size={20} className="text-primary-foreground" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">Loading analytics...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-3xl gradient-hero flex items-center justify-center shadow-xl shadow-primary/20">
          <Sparkles size={32} className="text-primary-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground mb-1">No data yet</p>
          <p className="text-sm text-muted-foreground">Add tasks and complete them to see your analytics</p>
        </div>
      </div>
    );
  }

  const statusData = (['Done', 'Pending', 'Skipped'] as TaskStatus[]).map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length,
  })).filter(d => d.value > 0);

  const catData = (['Work', 'Fitness', 'Learning', 'Personal'] as TaskCategory[]).map(cat => ({
    name: cat,
    total: tasks.filter(t => t.category === cat).length,
    done: tasks.filter(t => t.category === cat && t.status === 'Done').length,
  })).filter(d => d.total > 0);

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0;
  const focusScore = tasks.reduce((acc, t) => {
    if (t.status !== 'Done') return acc;
    return acc + (t.priority === 'High' ? 3 : t.priority === 'Medium' ? 2 : 1);
  }, 0);

  const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '16px',
    fontSize: '12px',
    fontFamily: 'Space Grotesk',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    padding: '12px 16px',
  };

  const metricCards = [
    {
      label: 'Total Tasks', value: tasks.length, icon: Target,
      gradient: 'from-primary/15 to-primary/5',
      iconBg: 'bg-primary/15 text-primary',
    },
    {
      label: 'Completion', value: `${completionRate}%`, icon: TrendingUp,
      gradient: 'from-[hsl(var(--status-done))]/15 to-[hsl(var(--status-done))]/5',
      iconBg: 'bg-[hsl(var(--status-done))]/15 text-[hsl(var(--status-done))]',
    },
    {
      label: 'Focus Score', value: focusScore, icon: Flame,
      gradient: 'from-[hsl(var(--status-skipped))]/15 to-[hsl(var(--status-skipped))]/5',
      iconBg: 'bg-[hsl(var(--status-skipped))]/15 text-[hsl(var(--status-skipped))]',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-foreground">Analytics</h2>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {metricCards.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
            className={cn("rounded-2xl p-5 bg-gradient-to-br border border-border/30", m.gradient)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.label}</span>
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", m.iconBg)}>
                <m.icon size={16} />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-foreground">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Status pie */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border/40 p-5 md:p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value" strokeWidth={0}>
                {statusData.map(entry => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name as TaskStatus]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-3">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: STATUS_COLORS[d.name as TaskStatus] }} />
                <span className="text-muted-foreground font-medium">{d.name}</span>
                <span className="font-bold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-2xl bg-card border border-border/40 p-5 md:p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" fill="hsl(var(--muted-foreground))" radius={[8, 8, 0, 0]} name="Total" />
              <Bar dataKey="done" fill="hsl(155, 75%, 42%)" radius={[8, 8, 0, 0]} name="Done" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
