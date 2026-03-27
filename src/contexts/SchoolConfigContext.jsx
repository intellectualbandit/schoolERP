import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import * as configService from '../services/configService';

const STORAGE_KEY = 'schoolerp_config';

const DEFAULT_CONFIG = {
  gradeLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
  sections: [
    { name: 'Rizal', gradeLevel: 'Grade 7' },
    { name: 'Bonifacio', gradeLevel: 'Grade 8' },
    { name: 'Mabini', gradeLevel: 'Grade 9' },
    { name: 'Aguinaldo', gradeLevel: 'Grade 10' },
  ],
  subjects: ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan', 'ESP', 'MAPEH', 'TLE'],
  quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
  schoolYear: '2025-2026',
};

function loadLocalConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // ignore corrupt data
  }
  return DEFAULT_CONFIG;
}

const SchoolConfigContext = createContext(null);

export function SchoolConfigProvider({ children }) {
  const [config, setConfig] = useState(loadLocalConfig);
  const [configLoading, setConfigLoading] = useState(isSupabaseConfigured);

  // Load from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function load() {
      try {
        const remote = await configService.getSchoolConfig();
        if (remote && !cancelled) {
          setConfig({
            gradeLevels: remote.gradeLevels,
            sections: remote.sections.map(s => ({ name: s.name, gradeLevel: s.gradeLevel })),
            subjects: remote.subjects,
            quarters: remote.quarters,
            schoolYear: remote.schoolYear,
            // Keep raw rows for ID lookups
            _gradeLevelRows: remote.gradeLevelRows,
            _sectionRows: remote.sections,
            _subjectRows: remote.subjectRows,
          });
        }
      } catch (err) {
        console.error('Failed to load config from Supabase:', err);
      } finally {
        if (!cancelled) setConfigLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const updateConfig = useCallback(async (partial) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      if (!isSupabaseConfigured) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        await configService.updateSchoolConfig(partial);
      } catch (err) {
        console.error('Failed to update config in Supabase:', err);
      }
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(DEFAULT_CONFIG);
  }, []);

  // Derived helpers
  const sectionNames = useMemo(
    () => config.sections.map((s) => s.name),
    [config.sections],
  );

  const sectionGradeMap = useMemo(
    () => Object.fromEntries(config.sections.map((s) => [s.name, s.gradeLevel])),
    [config.sections],
  );

  const gradeSectionMap = useMemo(
    () => Object.fromEntries(config.sections.map((s) => [s.gradeLevel, s.name])),
    [config.sections],
  );

  const sectionLabels = useMemo(
    () => config.sections.map((s) => ({ id: s.name, label: `${s.gradeLevel} - ${s.name}` })),
    [config.sections],
  );

  const departmentOptions = useMemo(
    () => [...config.subjects],
    [config.subjects],
  );

  // ID lookup helpers for Supabase FK references
  const gradeLevelIdMap = useMemo(() => {
    if (!config._gradeLevelRows) return {};
    return Object.fromEntries(config._gradeLevelRows.map(g => [g.name, g.id]));
  }, [config._gradeLevelRows]);

  const sectionIdMap = useMemo(() => {
    if (!config._sectionRows) return {};
    return Object.fromEntries(config._sectionRows.map(s => [s.name, s.id]));
  }, [config._sectionRows]);

  const subjectIdMap = useMemo(() => {
    if (!config._subjectRows) return {};
    return Object.fromEntries(config._subjectRows.map(s => [s.name, s.id]));
  }, [config._subjectRows]);

  const value = useMemo(
    () => ({
      ...config,
      configLoading,
      sectionNames,
      sectionGradeMap,
      gradeSectionMap,
      sectionLabels,
      departmentOptions,
      gradeLevelIdMap,
      sectionIdMap,
      subjectIdMap,
      updateConfig,
      resetToDefaults,
    }),
    [config, configLoading, sectionNames, sectionGradeMap, gradeSectionMap, sectionLabels, departmentOptions, gradeLevelIdMap, sectionIdMap, subjectIdMap, updateConfig, resetToDefaults],
  );

  return (
    <SchoolConfigContext.Provider value={value}>
      {children}
    </SchoolConfigContext.Provider>
  );
}

export function useSchoolConfig() {
  const ctx = useContext(SchoolConfigContext);
  if (!ctx) throw new Error('useSchoolConfig must be used within SchoolConfigProvider');
  return ctx;
}

export { DEFAULT_CONFIG };
