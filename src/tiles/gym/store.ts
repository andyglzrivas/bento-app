import { useMemo } from 'react';

import { useCollection } from '@/store/collection';

export type GymSet = {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  performedAt: number; // epoch ms
};

/** YYYY-MM-DD in device local time. */
export function localDay(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDay(day: string): string {
  const now = Date.now();
  if (day === localDay(now)) return 'Today';
  if (day === localDay(now - 86_400_000)) return 'Yesterday';
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function useGymSets() {
  const sets = useCollection<GymSet>('gym.sets');

  const derived = useMemo(() => {
    const newestFirst = [...sets.docs].sort((a, b) => b.performedAt - a.performedAt);

    const byDay = new Map<string, GymSet[]>();
    for (const s of newestFirst) {
      const day = localDay(s.performedAt);
      byDay.set(day, [...(byDay.get(day) ?? []), s]);
    }

    const recentExercises = [...new Set(newestFirst.map((s) => s.exercise))].slice(0, 8);

    // Today plus the previous six days.
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - 6);
    const thisWeek = newestFirst.filter((s) => s.performedAt >= weekStart.getTime());

    return {
      days: [...byDay].map(([day, data]) => ({ day, data })),
      recentExercises,
      week: {
        sets: thisWeek.length,
        days: new Set(thisWeek.map((s) => localDay(s.performedAt))).size,
        lastDay: newestFirst[0] ? localDay(newestFirst[0].performedAt) : null,
      },
    };
  }, [sets.docs]);

  return { ...sets, ...derived };
}
