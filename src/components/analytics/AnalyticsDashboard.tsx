import { useEffect, useState } from 'react';
import { Task, TaskCategory, TaskStatus } from '@/types/task';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AnalyticsDashboardProps {
  userId: string;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  Done: 'hsl(155, 75%, 42%)',
  Pending: 'hsl(4, 80%, 56%)',
  Skipped: 'hsl(40, 95%, 52%)',
};

const CAT_COLORS: Record<TaskCategory, string> = {
  Work: 'hsl(250, 85%, 60%)',
  Fitness: 'hsl(155, 75%, 42%)',
  Learning: 'hsl(280, 70%, 58%)',
  Personal: 'hsl(340, 75%, 55%)',
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
      <div className="flex-1 flex items-center justify-center">
        <Sparkles size={20} className="text-primary animate-pulse-glow" />
        <span className="ml-2 text-sm text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center glow-primary">
          <Sparkles size={28} className="text-primary-foreground" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Add some tasks to see analytics</p>
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
    borderRadius: '12px',
    fontSize: '12px',
    fontFamily: 'Space Grotesk',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header with big stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
      </div>

      {/* Big metric cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-4xl font-bold text-foreground">{tasks.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Completion Rate</p>
          <p className="text-4xl font-bold gradient-hero bg-clip-text text-transparent">{completionRate}%</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Focus Score</p>
          <p className="text-4xl font-bold text-primary">{focusScore}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status pie */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value" strokeWidth={0}>
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
                <div className="w-3 h-3 rounded-full" style={{ background: STATUS_COLORS[d.name as TaskStatus] }} />
                <span className="text-muted-foreground font-medium">{d.name}</span>
                <span className="font-bold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="glass-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={catData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontFamily: 'Space Grotesk' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="total" fill="hsl(var(--muted-foreground))" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="done" fill="hsl(155, 75%, 42%)" radius={[6, 6, 0, 0]} name="Done" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
