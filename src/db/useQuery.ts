import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteBindValue } from 'expo-sqlite';
import { useCallback, useState } from 'react';

/**
 * Runs a SELECT and re-runs it whenever the screen regains focus or `reload`
 * is called. Good enough for small personal datasets; no cache layer needed.
 */
export function useQuery<T>(sql: string, params: SQLiteBindValue[] = []) {
  const db = useSQLiteContext();
  const [rows, setRows] = useState<T[]>([]);
  const key = JSON.stringify(params);

  const reload = useCallback(async () => {
    setRows(await db.getAllAsync<T>(sql, params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, sql, key]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { rows, reload };
}
