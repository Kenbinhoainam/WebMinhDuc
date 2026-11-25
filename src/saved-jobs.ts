import {useMemo,useSyncExternalStore} from 'react';
import {jobs} from './jobs-data';

const SAVED_KEY = 'minhduc.saved-jobs.v1';
const SAVED_EVENT = 'minhduc:saved-jobs';
let memorySaved = '[]';
let useMemorySaved = false;

function getSavedSnapshot() {
  if (useMemorySaved) return memorySaved;
  try {
    memorySaved = window.localStorage.getItem(SAVED_KEY) ?? '[]';
    return memorySaved;
  } catch { useMemorySaved = true; return memorySaved; }
}
function subscribeSaved(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SAVED_KEY || event.key === null) {
      memorySaved = event.newValue ?? '[]';
      useMemorySaved = false;
      callback();
    }
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(SAVED_EVENT, callback);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(SAVED_EVENT, callback); };
}
function parseSaved(raw: string): string[] {
  try { const result: unknown = JSON.parse(raw); return Array.isArray(result) ? [...new Set(result.filter((id): id is string => typeof id === 'string' && jobs.some(job => job.id === id)))] : []; } catch { return []; }
}
export function useSavedJobs() {
  const raw = useSyncExternalStore(subscribeSaved, getSavedSnapshot, () => '[]');
  const savedIds = useMemo(() => parseSaved(raw), [raw]);
  const toggleSaved = (id: string) => {
    if (!jobs.some(job => job.id === id)) return;
    const current = parseSaved(getSavedSnapshot());
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    memorySaved = JSON.stringify(next);
    try {
      window.localStorage.setItem(SAVED_KEY, memorySaved);
      useMemorySaved = false;
    } catch { useMemorySaved = true; }
    window.dispatchEvent(new Event(SAVED_EVENT));
  };
  return { savedIds, isTemporary:useMemorySaved, toggleSaved, isSaved: (id: string) => savedIds.includes(id), count: savedIds.length };
}

