import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority, TaskCategory, TIME_SLOTS } from '@/types/task';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function useTaskStore(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // Fetch tasks for selected date
  useEffect(() => {
    if (!userId) { setTasks([]); return; }
    setLoading(true);
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateKey)
      .order('time_slot')
      .then(({ data, error }) => {
        if (error) {
          toast({ title: 'Error loading tasks', description: error.message, variant: 'destructive' });
        } else if (data && data.length > 0) {
          setTasks(data as Task[]);
        } else {
          // Create default time slots
          const defaults = TIME_SLOTS.map(slot => ({
            user_id: userId,
            date: dateKey,
            time_slot: slot,
            task_text: '',
            priority: 'Medium' as TaskPriority,
            category: 'Work' as TaskCategory,
            status: 'Pending' as TaskStatus,
            notes: '',
          }));
          supabase.from('tasks').insert(defaults).select().then(({ data: inserted, error: insertErr }) => {
            if (insertErr) {
              toast({ title: 'Error creating slots', description: insertErr.message, variant: 'destructive' });
            } else {
              setTasks((inserted || []) as Task[]);
            }
          });
        }
        setLoading(false);
      });
  }, [userId, dateKey]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`tasks-${dateKey}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Task;
          if (updated.date === dateKey) {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, dateKey]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));

    // Debounced save
    if (debounceTimers.current[taskId]) clearTimeout(debounceTimers.current[taskId]);
    debounceTimers.current[taskId] = setTimeout(() => {
      supabase.from('tasks').update(updates).eq('id', taskId).then(({ error }) => {
        if (error) toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      });
    }, 500);
  }, []);

  const addTimeSlot = useCallback(async (timeSlot: string) => {
    if (!userId) return;
    const { data, error } = await supabase.from('tasks').insert({
      user_id: userId,
      date: dateKey,
      time_slot: timeSlot,
      task_text: '',
      priority: 'Medium' as TaskPriority,
      category: 'Work' as TaskCategory,
      status: 'Pending' as TaskStatus,
      notes: '',
    }).select().single();
    if (error) {
      toast({ title: 'Error adding slot', description: error.message, variant: 'destructive' });
    } else if (data) {
      setTasks(prev => [...prev, data as Task].sort((a, b) => a.time_slot.localeCompare(b.time_slot)));
    }
  }, [userId, dateKey]);

  const removeTask = useCallback(async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) toast({ title: 'Error deleting', description: error.message, variant: 'destructive' });
  }, []);

  const copyFromDate = useCallback(async (sourceDate: string) => {
    if (!userId) return;
    const { data: sourceTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', sourceDate);

    if (!sourceTasks || sourceTasks.length === 0) {
      toast({ title: 'No tasks found', description: `No tasks on ${sourceDate}` });
      return;
    }

    // Delete existing tasks for current date
    await supabase.from('tasks').delete().eq('user_id', userId).eq('date', dateKey);

    const newTasks = sourceTasks.map(t => ({
      user_id: userId,
      date: dateKey,
      time_slot: t.time_slot,
      task_text: t.task_text,
      priority: t.priority as TaskPriority,
      category: t.category as TaskCategory,
      status: 'Pending' as TaskStatus,
      notes: t.notes,
    }));

    const { data: inserted, error } = await supabase.from('tasks').insert(newTasks).select();
    if (error) {
      toast({ title: 'Copy failed', description: error.message, variant: 'destructive' });
    } else {
      setTasks((inserted || []) as Task[]);
      toast({ title: 'Tasks copied!' });
    }
  }, [userId, dateKey]);

  // Get all tasks for analytics
  const getAllTasks = useCallback(async () => {
    if (!userId) return [];
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .neq('task_text', '');
    return (data || []) as Task[];
  }, [userId]);

  return {
    tasks,
    selectedDate,
    setSelectedDate,
    updateTask,
    addTimeSlot,
    removeTask,
    copyFromDate,
    getAllTasks,
    loading,
    dateKey,
  };
}
