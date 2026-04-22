import { useCallback, useEffect, useState } from 'react';
import {
  getAllHabits,
  insertHabit,
  updateHabit,
  deleteHabit,
  type Habit,
} from '@/lib/database';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const refresh = useCallback(() => {
    setHabits(getAllHabits());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = useCallback(
    (name: string) => {
      insertHabit(name);
      refresh();
    },
    [refresh]
  );

  const editHabit = useCallback(
    (id: number, name: string) => {
      updateHabit(id, name);
      refresh();
    },
    [refresh]
  );

  const removeHabit = useCallback(
    (id: number) => {
      deleteHabit(id);
      refresh();
    },
    [refresh]
  );

  return { habits, addHabit, editHabit, removeHabit, refresh };
}
