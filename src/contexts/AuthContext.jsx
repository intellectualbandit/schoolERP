import { createContext, useContext, useState, useCallback } from 'react';
import MOCK_USERS from '../data/mockUsers';
import ROLE_CONFIG from '../data/roleConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('erp_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  const login = useCallback((emailOrRole, password) => {
    // Quick demo login by role key (no password needed)
    const byRole = MOCK_USERS.find(u => u.role === emailOrRole);
    if (byRole && !password) {
      sessionStorage.setItem('erp_user', JSON.stringify(byRole));
      setUser(byRole);
      return { success: true, user: byRole };
    }

    // Credential login
    const found = MOCK_USERS.find(
      u => u.email === emailOrRole && u.password === password
    );
    if (found) {
      sessionStorage.setItem('erp_user', JSON.stringify(found));
      setUser(found);
      return { success: true, user: found };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('erp_user');
    setUser(null);
  }, []);

  const hasAccess = useCallback((pageId) => {
    if (!user) return false;
    const config = ROLE_CONFIG[user.role];
    return config?.allowedPages?.includes(pageId) ?? false;
  }, [user]);

  const getPermission = useCallback((pageId) => {
    if (!user) return null;
    return ROLE_CONFIG[user.role]?.permissions?.[pageId] ?? null;
  }, [user]);

  const isReadOnly = useCallback((pageId) => {
    const perm = getPermission(pageId);
    return perm === 'r' || perm === 'r*' || perm === 'r+';
  }, [getPermission]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasAccess,
      getPermission,
      isReadOnly,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
