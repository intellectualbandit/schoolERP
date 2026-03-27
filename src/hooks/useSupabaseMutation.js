import { useState, useCallback } from 'react';

/**
 * Generic hook for Supabase mutations (insert, update, delete).
 * @param {Function} mutationFn — async function that performs the mutation
 */
export function useSupabaseMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      return result;
    } catch (err) {
      setError(err.message || 'Mutation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { execute, loading, error };
}
