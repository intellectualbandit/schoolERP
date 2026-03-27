import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/wellnessService';

export function useWellness(filters = {}) {
  const queryFn = useCallback(() => svc.getMoods(filters), [filters]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: setMood } = useSupabaseMutation(
    useCallback((studentId, date, mood) => svc.setMood(studentId, date, mood), [])
  );

  return { moods: data, loading, error, refetch, setMood };
}

export function useCounselorNotes(filters = {}) {
  const queryFn = useCallback(() => svc.getCounselorNotes(filters), [filters]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: addNote } = useSupabaseMutation(
    useCallback((note) => svc.addCounselorNote(note), [])
  );

  return { notes: data, loading, error, refetch, addNote };
}
