import { useState, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, TaskCategory, TIME_SLOTS } from '@/types/task';
import { format } from 'date-fns';

const generateId = () => crypto.randomUUID();

const createDefaultTasks = (date: string): Task[] => {
  return TIME_SLOTS.map(slot => ({
    id: generateId(),
    date,
    timeSlot: slot,
    taskText: '',
    priority: 'Medium' as TaskPriority,
    category: 'Work' as TaskCategory,
    status: 'Pending' as TaskStatus,
    notes: '',
    createdAt: new Date().toISOString(),
  }));
};

export function useTaskStore() {
  const [tasksByDate, setTasksByDate] = useState<Record<string, Task[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const tasks = tasksByDate[dateKey] || (() => {
    const defaults = createDefaultTasks(dateKey);
    setTasksByDate(prev => ({ ...prev, [dateKey]: defaults }));
    return defaults;
  })();

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasksByDate(prev => {
      const dateTasks = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: dateTasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      };
    });
  }, [dateKey]);

  const addTimeSlot = useCallback((timeSlot: string) => {
    setTasksByDate(prev => {
      const dateTasks = prev[dateKey] || [];
      const newTask: Task = {
        id: generateId(),
        date: dateKey,
        timeSlot,
        taskText: '',
        priority: 'Medium',
        category: 'Work',
        status: 'Pending',
        notes: '',
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [dateKey]: [...dateTasks, newTask].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)),
      };
    });
  }, [dateKey]);

  const removeTask = useCallback((taskId: string) => {
    setTasksByDate(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(t => t.id !== taskId),
    }));
  }, [dateKey]);

  const copyFromDate = useCallback((sourceDate: string) => {
    setTasksByDate(prev => {
      const sourceTasks = prev[sourceDate];
      if (!sourceTasks) return prev;
      return {
        ...prev,
        [dateKey]: sourceTasks.map(t => ({
          ...t,
          id: generateId(),
          date: dateKey,
          status: 'Pending' as TaskStatus,
          createdAt: new Date().toISOString(),
        })),
      };
    });
  }, [dateKey]);

  // Analytics helpers
  const getAllTasks = useCallback(() => {
    return Object.values(tasksByDate).flat().filter(t => t.taskText.trim());
  }, [tasksByDate]);

  const getTasksForRange = useCallback((startDate: string, endDate: string) => {
    return Object.entries(tasksByDate)
      .filter(([date]) => date >= startDate && date <= endDate)
      .flatMap(([, tasks]) => tasks.filter(t => t.taskText.trim()));
  }, [tasksByDate]);

  return {
    tasks,
    selectedDate,
    setSelectedDate,
    updateTask,
    addTimeSlot,
    removeTask,
    copyFromDate,
    getAllTasks,
    getTasksForRange,
    tasksByDate,
  };
}
