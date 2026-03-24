export type TaskStatus = 'Done' | 'Pending' | 'Skipped';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Work' | 'Fitness' | 'Learning' | 'Personal';

export interface Task {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00"
  taskText: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  notes: string;
  createdAt: string;
}

export const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 10;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const CATEGORIES: TaskCategory[] = ['Work', 'Fitness', 'Learning', 'Personal'];
export const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low'];
export const STATUSES: TaskStatus[] = ['Done', 'Pending', 'Skipped'];
