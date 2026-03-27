import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/alumniService';

export function useAlumni() {
  const queryFn = useCallback(() => svc.getAlumni(), []);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((alumni) => svc.createAlumni(alumni), [])
  );
  const { execute: update } = useSupabaseMutation(
    useCallback((id, updates) => svc.updateAlumni(id, updates), [])
  );
  const { execute: remove } = useSupabaseMutation(
    useCallback((id) => svc.deleteAlumni(id), [])
  );

  return { alumni: data, loading, error, refetch, setAlumni: setData, create, update, remove };
}

export function useAlumniAchievements(alumniId) {
  const queryFn = useCallback(() => svc.getAlumniAchievements(alumniId), [alumniId]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [alumniId],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  return { achievements: data, loading, error, refetch };
}
