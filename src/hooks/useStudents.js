import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/studentService';

export function useStudents(filters = {}) {
  const queryFn = useCallback(() => svc.getStudents(filters), [filters]);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((student) => svc.createStudent(student), [])
  );
  const { execute: update } = useSupabaseMutation(
    useCallback((id, updates) => svc.updateStudent(id, updates), [])
  );
  const { execute: remove } = useSupabaseMutation(
    useCallback((id) => svc.deleteStudent(id), [])
  );

  return { students: data, loading, error, refetch, setStudents: setData, create, update, remove };
}
