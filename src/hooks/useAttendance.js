import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/attendanceService';

export function useAttendance(filters = {}) {
  const queryFn = useCallback(() => svc.getAttendanceRecords(filters), [filters]);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: save } = useSupabaseMutation(
    useCallback((params) => svc.saveAttendance(params), [])
  );

  return { records: data, loading, error, refetch, setRecords: setData, save };
}

export function useExcuseRequests(filters = {}) {
  const queryFn = useCallback(() => svc.getExcuseRequests(filters), [filters]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((request) => svc.createExcuseRequest(request), [])
  );
  const { execute: updateStatus } = useSupabaseMutation(
    useCallback((id, status, reviewedBy) => svc.updateExcuseStatus(id, status, reviewedBy), [])
  );

  return { excuses: data, loading, error, refetch, create, updateStatus };
}
