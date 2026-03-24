import { Task, TaskCategory, TaskStatus } from '@/types/task';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  Done: 'hsl(152, 69%, 40%)',
  Pending: 'hsl(0, 72%, 51%)',
  Skipped: 'hsl(38, 92%, 50%)',
};

const CAT_COLORS: Record<TaskCategory, string> = {
  Work: 'hsl(230, 80%, 56%)',
  Fitness: 'hsl(152, 69%, 40%)',
  Learning: 'hsl(270, 60%, 56%)',
  Personal: 'hsl(330, 70%, 56%)',
};

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const filled = tasks.filter(t => t.taskText.trim());

  // Status distribution
  const statusData = (['Done', 'Pending', 'Skipped'] as TaskStatus[]).map(status => ({
    name: status,
    value: filled.filter(t => t.status === status).length,
  })).filter(d => d.value > 0);

  // Category breakdown
  const catData = (['Work', 'Fitness', 'Learning', 'Personal'] as TaskCategory[]).map(cat => {
    const catTasks = filled.filter(t => t.category === cat);
    return {
      name: cat,
      total: catTasks.length,
      done: catTasks.filter(t => t.status === 'Done').length,
    };
  }).filter(d => d.total > 0);

  // Priority breakdown
  const priorityData = ['High', 'Medium', 'Low'].map(p => ({
    name: p,
    total: filled.filter(t => t.priority === p).length,
    done: filled.filter(t => t.priority === p && t.status === 'Done').length,
  })).filter(d => d.total > 0);

  if (filled.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="text-sm">Add some tasks to see analytics</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <h2 className="text-xl font-bold text-foreground">Productivity Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status pie */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map(entry => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name as TaskStatus]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[d.name as TaskStatus] }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category bar */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="done" fill="hsl(var(--status-done))" radius={[4, 4, 0, 0]} name="Done" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority breakdown */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">By Priority</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityData} layout="vertical" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} width={60} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} name="Total" />
              <Bar dataKey="done" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Done" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
