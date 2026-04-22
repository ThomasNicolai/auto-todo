import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCompletionsForDate,
  getCompletionsForHabit,
  toggleCompletion,
  type Completion,
} from '@/lib/database';

export function useCompletionsForDate(date: string) {
  const [completions, setCompletions] = useState<Completion[]>([]);

  const refresh = useCallback(() => {
    setCompletions(getCompletionsForDate(date));
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    (habitId: number) => {
      toggleCompletion(habitId, date);
      refresh();
    },
    [date, refresh]
  );

  return { completions, toggle, refresh };
}

export function useCompletionsForHabit(habitId: number) {
  const [completions, setCompletions] = useState<Completion[]>([]);

  const refresh = useCallback(() => {
    setCompletions(getCompletionsForHabit(habitId));
  }, [habitId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const completionDates = useMemo(
    () => new Set(completions.map((c) => c.date)),
    [completions]
  );

  return { completions, completionDates, refresh };
}
