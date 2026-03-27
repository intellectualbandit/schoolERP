import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/payrollService';

export function usePayroll(filters = {}) {
  const queryFn = useCallback(() => svc.getPayslips(filters), [filters]);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((payslip) => svc.createPayslip(payslip), [])
  );
  const { execute: updateStatus } = useSupabaseMutation(
    useCallback((id, status) => svc.updatePayslipStatus(id, status), [])
  );
  const { execute: generate } = useSupabaseMutation(
    useCallback((periodId, periodLabel, teachers) =>
      svc.generatePayslips(periodId, periodLabel, teachers), [])
  );

  return { payslips: data, loading, error, refetch, setPayslips: setData, create, updateStatus, generate };
}
