export type TaskStatus = 'Done' | 'Pending' | 'Skipped';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Work' | 'Fitness' | 'Learning' | 'Personal';

export interface Task {
  id: string;
  user_id: string;
  date: string;
  time_slot: string;
  task_text: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 10;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const CATEGORIES: TaskCategory[] = ['Work', 'Fitness', 'Learning', 'Personal'];
export const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low'];
export const STATUSES: TaskStatus[] = ['Done', 'Pending', 'Skipped'];

export function isDateLocked(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date + 'T00:00:00');
  const diffMs = today.getTime() - target.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 2;
}

export function isTimeSlotPast(date: string, timeSlot: string): boolean {
  const now = new Date();
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotEnd = new Date(date + 'T00:00:00');
  slotEnd.setHours(hours + 1, minutes, 0, 0);
  return now > slotEnd;
}
