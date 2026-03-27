import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/teacherService';

export function useTeachers() {
  const queryFn = useCallback(() => svc.getTeachers(), []);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((teacher) => svc.createTeacher(teacher), [])
  );
  const { execute: update } = useSupabaseMutation(
    useCallback((id, updates) => svc.updateTeacher(id, updates), [])
  );
  const { execute: remove } = useSupabaseMutation(
    useCallback((id) => svc.deleteTeacher(id), [])
  );

  return { teachers: data, loading, error, refetch, setTeachers: setData, create, update, remove };
}
