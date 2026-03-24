import { useState } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DayPlanner } from '@/components/planner/DayPlanner';
import { StatsCards } from '@/components/planner/StatsCards';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useTaskStore } from '@/hooks/useTaskStore';
import { format, subDays } from 'date-fns';

type View = 'planner' | 'analytics';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('planner');
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    updateTask,
    addTimeSlot,
    removeTask,
    copyFromDate,
    getAllTasks,
  } = useTaskStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'planner' ? (
          <>
            <StatsCards tasks={tasks} />
            <DayPlanner
              date={selectedDate}
              tasks={tasks}
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
          <AnalyticsDashboard tasks={getAllTasks()} />
        )}
      </main>
    </div>
  );
};

export default Index;
