import { createContext, useContext, useState, useMemo, useCallback } from 'react';

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

function loadConfig() {
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
  const [config, setConfig] = useState(loadConfig);

  const updateConfig = useCallback((partial) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
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

  // { Rizal: 'Grade 7', Bonifacio: 'Grade 8', ... }
  const sectionGradeMap = useMemo(
    () => Object.fromEntries(config.sections.map((s) => [s.name, s.gradeLevel])),
    [config.sections],
  );

  // { 'Grade 7': 'Rizal', 'Grade 8': 'Bonifacio', ... }
  const gradeSectionMap = useMemo(
    () => Object.fromEntries(config.sections.map((s) => [s.gradeLevel, s.name])),
    [config.sections],
  );

  // [{ id: 'Rizal', label: 'Grade 7 - Rizal' }, ...]
  const sectionLabels = useMemo(
    () => config.sections.map((s) => ({ id: s.name, label: `${s.gradeLevel} - ${s.name}` })),
    [config.sections],
  );

  // Unique departments derived from subjects (used by Teachers)
  const departmentOptions = useMemo(
    () => [...config.subjects],
    [config.subjects],
  );

  const value = useMemo(
    () => ({
      ...config,
      sectionNames,
      sectionGradeMap,
      gradeSectionMap,
      sectionLabels,
      departmentOptions,
      updateConfig,
      resetToDefaults,
    }),
    [config, sectionNames, sectionGradeMap, gradeSectionMap, sectionLabels, departmentOptions, updateConfig, resetToDefaults],
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
