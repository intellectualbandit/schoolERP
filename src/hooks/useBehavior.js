import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/behaviorService';

export function useBehavior(filters = {}) {
  const queryFn = useCallback(() => svc.getIncidents(filters), [filters]);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((incident) => svc.createIncident(incident), [])
  );
  const { execute: update } = useSupabaseMutation(
    useCallback((id, updates) => svc.updateIncident(id, updates), [])
  );
  const { execute: remove } = useSupabaseMutation(
    useCallback((id) => svc.deleteIncident(id), [])
  );

  return { incidents: data, loading, error, refetch, setIncidents: setData, create, update, remove };
}
