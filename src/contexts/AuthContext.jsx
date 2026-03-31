import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import MOCK_USERS from '../data/mockUsers';
import ROLE_CONFIG from '../data/roleConfig';

const AuthContext = createContext(null);

// Demo credentials map: role → email/password (for quick-login buttons)
const DEMO_CREDENTIALS = {
  admin:      { email: 'admin@school.edu.ph',                    password: 'Demo1234!' },
  principal:  { email: 'principal@school.edu.ph',                 password: 'Demo1234!' },
  teacher:    { email: 'rosa.montoya@school.edu.ph',              password: 'Demo1234!' },
  student:    { email: 'juan.delacruz@student.school.edu.ph',     password: 'Demo1234!' },
  parent:     { email: 'maria.delacruz@parent.school.edu.ph',     password: 'Demo1234!' },
  registrar:  { email: 'registrar@school.edu.ph',                 password: 'Demo1234!' },
  cashier:    { email: 'cashier@school.edu.ph',                   password: 'Demo1234!' },
  counselor:  { email: 'counselor@school.edu.ph',                 password: 'Demo1234!' },
};

/**
 * Fetch user profile + linked data from Supabase after auth.
 */
async function fetchUserProfile(authUser) {
  // Get base profile from users table
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) return null;

  const user = {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role,
    avatar: profile.avatar_url,
  };

  // For teachers: fetch assigned sections, subjects, and teacherId
  if (profile.role === 'teacher') {
    const { data: teacher } = await supabase
      .from('teachers')
      .select('id, employee_id')
      .eq('user_id', profile.id)
      .single();

    if (teacher) {
      user.teacherId = teacher.id;
      user.employeeId = teacher.employee_id;

      const { data: ts } = await supabase
        .from('teacher_sections')
        .select('section_id, sections(name), subject_id, subjects(name)')
        .eq('teacher_id', teacher.id);

      if (ts) {
        user.assignedSections = [...new Set(ts.map(r => r.sections.name))];
        user.subjects = [...new Set(ts.map(r => r.subjects.name))];
      }
    }
  }

  // For students: fetch studentId, lrn, gradeLevel, section
  if (profile.role === 'student') {
    const { data: student } = await supabase
      .from('students')
      .select('id, lrn, grade_level_id, section_id, grade_levels(name), sections(name)')
      .eq('user_id', profile.id)
      .single();

    if (student) {
      user.studentId = student.id;
      user.lrn = student.lrn;
      user.gradeLevel = student.grade_levels.name;
      user.section = student.sections.name;
    }
  }

  // For parents: fetch child IDs and names
  if (profile.role === 'parent') {
    const { data: links } = await supabase
      .from('parent_children')
      .select('student_id, students(id, first_name, last_name)')
      .eq('parent_id', profile.id);

    if (links) {
      user.childIds = links.map(l => l.student_id);
      user.childNames = links.map(l => `${l.students.first_name} ${l.students.last_name}`);
    }
  }

  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // On mount: use onAuthStateChange for session init (avoids lock conflict with getSession)
  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseConfigured) {
      // Fallback: check sessionStorage for mock user
      try {
        const stored = sessionStorage.getItem('erp_user');
        if (stored) setUser(JSON.parse(stored));
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    // onAuthStateChange fires INITIAL_SESSION on setup, then SIGNED_IN / SIGNED_OUT later
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT' || !session?.user) {
          if (mountedRef.current) setUser(null);
        } else if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          if (mountedRef.current) setUser(profile);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;

  const login = useCallback(async (emailOrRole, password) => {
    if (isSupabaseConfigured) {
      // Determine credentials: if no password given, use demo credentials map
      let email = emailOrRole;
      let pass = password;

      if (!password && DEMO_CREDENTIALS[emailOrRole]) {
        email = DEMO_CREDENTIALS[emailOrRole].email;
        pass = DEMO_CREDENTIALS[emailOrRole].password;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const profile = await fetchUserProfile(data.user);
      if (!profile) {
        return { success: false, error: 'User profile not found. Please contact admin.' };
      }

      setUser(profile);
      return { success: true, user: profile };
    }

    // Fallback: mock login
    const byRole = MOCK_USERS.find(u => u.role === emailOrRole);
    if (byRole && !password) {
      sessionStorage.setItem('erp_user', JSON.stringify(byRole));
      setUser(byRole);
      return { success: true, user: byRole };
    }

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

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
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
      loading,
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
