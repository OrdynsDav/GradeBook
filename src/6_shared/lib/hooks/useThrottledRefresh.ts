import { useCallback, useRef, useState } from 'react';

const DEFAULT_COOLDOWN_MS = 3000;

/**
 * Возвращает `[refreshing, handleRefresh]` с троттлингом:
 * повторный вызов игнорируется, пока не пройдёт `cooldownMs` после завершения предыдущего.
 */
export function useThrottledRefresh(
  action: () => Promise<void>,
  cooldownMs = DEFAULT_COOLDOWN_MS
): [boolean, () => void] {
  const [refreshing, setRefreshing] = useState(false);
  const lastFinishedAt = useRef(0);

  const handleRefresh = useCallback(() => {
    const now = Date.now();
    if (refreshing || now - lastFinishedAt.current < cooldownMs) return;

    setRefreshing(true);
    action().finally(() => {
      lastFinishedAt.current = Date.now();
      setRefreshing(false);
    });
  }, [action, cooldownMs, refreshing]);

  return [refreshing, handleRefresh];
}
