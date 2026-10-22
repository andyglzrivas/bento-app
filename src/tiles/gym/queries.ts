export type GymSet = {
  id: number;
  exercise: string;
  weight: number;
  reps: number;
  day: string; // YYYY-MM-DD, device local time
};

export const recentSets = `
  SELECT id, exercise, weight, reps, date(performed_at, 'unixepoch', 'localtime') AS day
  FROM gym_sets
  ORDER BY performed_at DESC, id DESC
  LIMIT 200`;

export const recentExercises = `
  SELECT exercise FROM gym_sets
  GROUP BY exercise
  ORDER BY MAX(performed_at) DESC
  LIMIT 8`;

export const weekSummary = `
  SELECT
    COUNT(*) AS sets,
    COUNT(DISTINCT date(performed_at, 'unixepoch', 'localtime')) AS days,
    MAX(date(performed_at, 'unixepoch', 'localtime')) AS lastDay
  FROM gym_sets
  WHERE performed_at >= unixepoch('now', '-6 days', 'start of day')`;

export function formatDay(day: string): string {
  const today = new Date();
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (day === iso(today)) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (day === iso(yesterday)) return 'Yesterday';
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
