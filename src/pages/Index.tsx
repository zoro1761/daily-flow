import { useState } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DayPlanner } from '@/components/planner/DayPlanner';
import { StatsCards } from '@/components/planner/StatsCards';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { AuthPage } from '@/components/auth/AuthPage';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useAuth } from '@/hooks/useAuth';
import { format, subDays } from 'date-fns';
import { Loader2, Target } from 'lucide-react';

type View = 'planner' | 'analytics';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('planner');
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    updateTask,
    addTimeSlot,
    removeTask,
    copyFromDate,
    loading: tasksLoading,
  } = useTaskStore(user?.id ?? null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse-glow">
          <Target size={22} className="text-primary-foreground" />
        </div>
        <Loader2 size={18} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        currentView={currentView}
        onViewChange={setCurrentView}
        userEmail={user.email}
        onSignOut={signOut}
      />

      <main className="flex-1 flex flex-col overflow-hidden pt-[60px] lg:pt-0">
        {currentView === 'planner' ? (
          <>
            <StatsCards tasks={tasks} />
            <DayPlanner
              date={selectedDate}
              tasks={tasks}
              loading={tasksLoading}
              onUpdateTask={updateTask}
              onRemoveTask={removeTask}
              onAddSlot={addTimeSlot}
              onCopyPrevious={() => {
                const prev = format(subDays(selectedDate, 1), 'yyyy-MM-dd');
                copyFromDate(prev);
              }}
            />
          </>
        ) : (
          <AnalyticsDashboard userId={user.id} />
        )}
      </main>
    </div>
  );
};

export default Index;
