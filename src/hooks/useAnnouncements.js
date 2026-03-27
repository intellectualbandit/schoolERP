import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useSupabaseMutation } from './useSupabaseMutation';
import { isSupabaseConfigured } from '../lib/supabase';
import * as svc from '../services/announcementService';

export function useAnnouncements(filters = {}) {
  const queryFn = useCallback(() => svc.getAnnouncements(filters), [filters]);
  const { data, loading, error, refetch, setData } = useSupabaseQuery(
    queryFn,
    [JSON.stringify(filters)],
    { enabled: isSupabaseConfigured, initialData: [] }
  );

  const { execute: create } = useSupabaseMutation(
    useCallback((announcement) => svc.createAnnouncement(announcement), [])
  );
  const { execute: update } = useSupabaseMutation(
    useCallback((id, updates) => svc.updateAnnouncement(id, updates), [])
  );
  const { execute: remove } = useSupabaseMutation(
    useCallback((id) => svc.deleteAnnouncement(id), [])
  );

  return { announcements: data, loading, error, refetch, setAnnouncements: setData, create, update, remove };
}
