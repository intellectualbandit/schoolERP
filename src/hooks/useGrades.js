import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/gradeService';

export function useGrades(filters = {}) {
  const queryFn = useCallback(() => svc.getGrades(filters), [filters]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: saveGrades } = useSupabaseMutation(
    useCallback((grades) => svc.saveGrades(grades), [])
  );

  return { grades: data, loading, error, refetch, saveGrades };
}

export function useGradeMap(studentIds) {
  const queryFn = useCallback(
    () => svc.getGradeMap(studentIds || []),
    [studentIds]
  );
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(studentIds)],
    { enabled: isSupabaseConfigured && studentIds?.length > 0, initialData: {} }
  );

  return { gradeMap: data, loading, error, refetch };
}

export function useGradeReleases(sectionId) {
  const queryFn = useCallback(() => svc.getGradeReleases(sectionId), [sectionId]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [sectionId],
    { enabled: isSupabaseConfigured, initialData: {} }
  );

  const { execute: setRelease } = useSupabaseMutation(
    useCallback((sectionId, quarter, released, releasedBy) =>
      svc.setGradeRelease(sectionId, quarter, released, releasedBy), [])
  );

  return { releases: data, loading, error, refetch, setRelease };
}
