import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import type { ResultRow } from './types';
import { useStudyStore } from './useStudyStore';

type NewResult = Omit<ResultRow, 'id' | 'participant' | 'platform' | 'client_time'> & { participant?: string };
export type FlushResult = { ok: true; sent: number } | { ok: false; error: string };

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Records one experiment result. It is saved on the device first, then sent to the Sheet.
 * If sending fails, the row stays queued and goes out on the next flush.
 */
export function logResult(input: NewResult): Promise<FlushResult> {
  const participant = input.participant ?? useStudyStore.getState().participant;
  if (!participant) return Promise.resolve({ ok: false, error: 'no_participant' });
  useStudyStore.getState().enqueue({
    ...input,
    id: newId(),
    participant,
    platform: Platform.OS,
    client_time: new Date().toISOString(),
  });
  return flushResults();
}

let inFlight: Promise<FlushResult> | null = null;

/** Sends every queued row. Safe to call often: rows have ids, so the Sheet ignores repeats. */
export function flushResults(): Promise<FlushResult> {
  if (inFlight) return inFlight;
  inFlight = (async (): Promise<FlushResult> => {
    const rows = useStudyStore.getState().queue;
    if (rows.length === 0) return { ok: true, sent: 0 };
    try {
      const res = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const out = (await res.json().catch(() => null)) as { ok?: boolean; ids?: string[]; error?: string } | null;
      if (res.ok && out?.ok && out.ids) {
        useStudyStore.getState().markSent(out.ids);
        return { ok: true, sent: out.ids.length };
      }
      return { ok: false, error: out?.error ?? `http_${res.status}` };
    } catch {
      return { ok: false, error: 'offline' };
    }
  })();
  return inFlight.finally(() => {
    inFlight = null;
  });
}

/** Times a task: call start() when it begins (or pass autoStart) and seconds() when it ends. */
export function useStopwatch({ autoStart = false } = {}) {
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    if (autoStart && startedAt.current === null) startedAt.current = Date.now();
  }, [autoStart]);
  return {
    start: () => {
      startedAt.current = Date.now();
    },
    seconds: () => (startedAt.current === null ? 0 : Math.round((Date.now() - startedAt.current) / 100) / 10),
  };
}
