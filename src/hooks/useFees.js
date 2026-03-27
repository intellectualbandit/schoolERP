import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/feeService';

export function useFees(filters = {}) {
  const queryFn = useCallback(() => svc.getFeeRecords(filters), [filters]);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: createRecord } = useSupabaseMutation(
    useCallback((record) => svc.createFeeRecord(record), [])
  );
  const { execute: addPayment } = useSupabaseMutation(
    useCallback((payment) => svc.addPayment(payment), [])
  );

  return { feeRecords: data, loading, error, refetch, setFeeRecords: setData, createRecord, addPayment };
}

export function useFeeSchedule(gradeLevelId) {
  const queryFn = useCallback(() => svc.getFeeSchedule(gradeLevelId), [gradeLevelId]);
  const { data, loading, error, refetch } = useSupabaseQuery(
    queryFn,
    [gradeLevelId],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  return { schedule: data, loading, error, refetch };
}
