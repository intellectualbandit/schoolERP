import { useState, useMemo, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Check, X, AlertTriangle, Lock, Loader2 } from 'lucide-react';

// --- Sample Data ---
const classRoster = [
  { id: 1, lrn: '136482790001', firstName: 'Juan', middleName: 'Santos', lastName: 'Dela Cruz', gradeLevel: 'Grade 7', section: 'Rizal' },
  { id: 2, lrn: '136482790002', firstName: 'Maria', middleName: 'Reyes', lastName: 'Santos', gradeLevel: 'Grade 8', section: 'Bonifacio' },
  { id: 3, lrn: '136482790003', firstName: 'Andres', middleName: 'Luna', lastName: 'Bautista', gradeLevel: 'Grade 9', section: 'Mabini' },
  { id: 4, lrn: '136482790004', firstName: 'Gabriela', middleName: 'Aquino', lastName: 'Reyes', gradeLevel: 'Grade 10', section: 'Aguinaldo' },
  { id: 5, lrn: '136482790005', firstName: 'Jose', middleName: 'Garcia', lastName: 'Rizal', gradeLevel: 'Grade 7', section: 'Rizal' },
  { id: 6, lrn: '136482790006', firstName: 'Corazon', middleName: 'Mercado', lastName: 'Aquino', gradeLevel: 'Grade 8', section: 'Bonifacio' },
  { id: 7, lrn: '136482790007', firstName: 'Emilio', middleName: 'Jacinto', lastName: 'Aguinaldo', gradeLevel: 'Grade 9', section: 'Mabini' },
  { id: 8, lrn: '136482790008', firstName: 'Leni', middleName: 'Gerona', lastName: 'Robredo', gradeLevel: 'Grade 10', section: 'Aguinaldo' },
  { id: 9, lrn: '136482790009', firstName: 'Manuel', middleName: 'Tinio', lastName: 'Quezon', gradeLevel: 'Grade 7', section: 'Rizal' },
  { id: 10, lrn: '136482790010', firstName: 'Josefa', middleName: 'Llanes', lastName: 'Escoda', gradeLevel: 'Grade 8', section: 'Bonifacio' },
  { id: 11, lrn: '136482790011', firstName: 'Apolinario', middleName: 'De La Cruz', lastName: 'Mabini', gradeLevel: 'Grade 9', section: 'Mabini' },
  { id: 12, lrn: '136482790012', firstName: 'Teresa', middleName: 'Magbanua', lastName: 'Silang', gradeLevel: 'Grade 10', section: 'Aguinaldo' },
];

const subjects = ['Filipino', 'English', 'Mathematics', 'Science', 'Araling Panlipunan', 'ESP', 'MAPEH', 'TLE'];
const sectionOptions = ['Rizal', 'Bonifacio', 'Mabini', 'Aguinaldo'];
const sectionGradeMap = { Rizal: 'Grade 7', Bonifacio: 'Grade 8', Mabini: 'Grade 9', Aguinaldo: 'Grade 10' };
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

// Initial grades keyed by `${studentId}-${subject}-${quarter}`
function buildInitialGrades() {
  const g = {};
  const seed = [
    { id: 1, grades: { Filipino: [88,85,90,87], English: [82,80,78,84], Mathematics: [91,89,93,90], Science: [86,84,88,85], 'Araling Panlipunan': [90,88,91,89], ESP: [92,90,93,91], MAPEH: [89,87,90,88], TLE: [85,83,87,84] }},
    { id: 2, grades: { Filipino: [92,94,91,93], English: [95,93,96,94], Mathematics: [88,90,87,89], Science: [91,89,92,90], 'Araling Panlipunan': [93,95,94,92], ESP: [90,92,91,93], MAPEH: [94,92,95,93], TLE: [87,89,88,90] }},
    { id: 3, grades: { Filipino: [78,80,76,79], English: [74,72,75,73], Mathematics: [70,68,72,71], Science: [76,74,78,75], 'Araling Panlipunan': [80,82,79,81], ESP: [77,75,78,76], MAPEH: [82,80,83,81], TLE: [75,73,76,74] }},
    { id: 4, grades: { Filipino: [95,97,94,96], English: [98,96,97,95], Mathematics: [92,94,93,91], Science: [96,94,95,97], 'Araling Panlipunan': [94,96,95,93], ESP: [97,95,96,98], MAPEH: [93,95,94,96], TLE: [91,93,92,94] }},
    { id: 5, grades: { Filipino: [85,83,86,84], English: [80,78,82,79], Mathematics: [77,75,79,76], Science: [83,81,84,82], 'Araling Panlipunan': [86,84,87,85], ESP: [81,79,82,80], MAPEH: [84,82,85,83], TLE: [78,76,80,77] }},
    { id: 6, grades: { Filipino: [89,91,88,90], English: [87,85,89,86], Mathematics: [83,81,85,82], Science: [88,86,90,87], 'Araling Panlipunan': [91,89,92,90], ESP: [86,88,87,89], MAPEH: [90,88,91,89], TLE: [84,86,85,87] }},
    { id: 7, grades: { Filipino: [72,70,74,71], English: [68,66,70,67], Mathematics: [65,63,67,64], Science: [71,69,73,70], 'Araling Panlipunan': [75,73,76,74], ESP: [70,68,72,69], MAPEH: [74,72,75,73], TLE: [67,65,69,66] }},
    { id: 8, grades: { Filipino: [93,91,94,92], English: [96,94,95,93], Mathematics: [90,92,91,89], Science: [94,92,93,95], 'Araling Panlipunan': [92,94,93,91], ESP: [95,93,94,96], MAPEH: [91,93,92,94], TLE: [89,91,90,92] }},
    { id: 9, grades: { Filipino: [81,79,83,80], English: [76,74,78,75], Mathematics: [73,71,74,72], Science: [79,77,80,78], 'Araling Panlipunan': [83,81,84,82], ESP: [78,76,79,77], MAPEH: [82,80,83,81], TLE: [75,73,77,74] }},
    { id: 10, grades: { Filipino: [58,60,55,57], English: [62,59,63,61], Mathematics: [55,53,57,54], Science: [60,58,62,59], 'Araling Panlipunan': [64,62,65,63], ESP: [57,55,59,56], MAPEH: [63,61,64,62], TLE: [56,54,58,55] }},
    { id: 11, grades: { Filipino: [86,84,88,85], English: [82,80,84,81], Mathematics: [79,77,81,78], Science: [85,83,86,84], 'Araling Panlipunan': [88,86,89,87], ESP: [83,81,85,82], MAPEH: [87,85,88,86], TLE: [80,78,82,79] }},
    { id: 12, grades: { Filipino: [91,93,90,92], English: [94,92,93,91], Mathematics: [88,90,89,87], Science: [92,90,91,93], 'Araling Panlipunan': [90,92,91,89], ESP: [93,91,92,94], MAPEH: [89,91,90,92], TLE: [86,88,87,89] }},
  ];
  seed.forEach(({ id, grades }) => {
    Object.entries(grades).forEach(([subj, vals]) => {
      quarters.forEach((q, qi) => {
        g[`${id}-${subj}-${q}`] = vals[qi];
      });
    });
  });
  return g;
}

// DepEd transmutation table (initial grade -> transmuted grade)
const transmutationTable = [
  [100, 100], [98.40, 99], [96.80, 98], [95.20, 97], [93.60, 96],
  [92.00, 95], [90.40, 94], [88.80, 93], [87.20, 92], [85.60, 91],
  [84.00, 90], [82.40, 89], [80.80, 88], [79.20, 87], [77.60, 86],
  [76.00, 85], [74.40, 84], [72.80, 83], [71.20, 82], [69.60, 81],
  [68.00, 80], [66.40, 79], [64.80, 78], [63.20, 77], [61.60, 76],
  [60.00, 75], [56.00, 74], [52.00, 73], [48.00, 72], [44.00, 71],
  [40.00, 70], [36.00, 69], [32.00, 68], [28.00, 67], [24.00, 66],
  [20.00, 65], [16.00, 64], [12.00, 63], [8.00, 62], [4.00, 61],
  [0, 60],
];

function transmute(raw) {
  if (raw == null || isNaN(raw)) return null;
  const v = Math.min(100, Math.max(0, Number(raw)));
  for (const [threshold, grade] of transmutationTable) {
    if (v >= threshold) return grade;
  }
  return 60;
}

function gradeColor(val) {
  if (val == null) return '';
  if (val >= 90) return 'text-green-700 bg-green-50';
  if (val >= 75) return 'text-blue-700 bg-blue-50';
  if (val >= 60) return 'text-amber-700 bg-amber-50';
  return 'text-red-700 bg-red-50';
}

function gradeColorBadge(val) {
  if (val == null) return 'bg-gray-100 text-gray-400';
  if (val >= 90) return 'bg-green-100 text-green-700';
  if (val >= 75) return 'bg-blue-100 text-blue-700';
  if (val >= 60) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function getInitials(s) {
  return ((s.firstName?.[0] || '') + (s.lastName?.[0] || '')).toUpperCase();
}

// --- Component ---
export default function Grades() {
  const { isReadOnly: checkReadOnly } = useAuth();
  const readOnly = checkReadOnly('grades');
  const [grades, setGrades] = useState(buildInitialGrades);
  const [activeQuarter, setActiveQuarter] = useState('Q1');
  const [filterSection, setFilterSection] = useState('Rizal');
  const [filterSubject, setFilterSubject] = useState('');
  const [editingCell, setEditingCell] = useState(null); // `${studentId}-${subject}`
  const [editValue, setEditValue] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
  const [releasedQuarters, setReleasedQuarters] = useState({});
  const [toast, setToast] = useState(null);
  const isAdmin = !readOnly;
  const [isLoading, setIsLoading] = useState(true);
  const [showTransmutation, setShowTransmutation] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return classRoster.filter(s => s.section === filterSection);
  }, [filterSection]);

  // Subjects to display
  const displaySubjects = useMemo(() => {
    if (filterSubject) return [filterSubject];
    return subjects;
  }, [filterSubject]);

  // Compute averages
  const getStudentSubjectAvg = (studentId, subject) => {
    let sum = 0, count = 0;
    quarters.forEach(q => {
      const v = grades[`${studentId}-${subject}-${q}`];
      if (v != null && !isNaN(v)) { sum += Number(v); count++; }
    });
    return count > 0 ? Math.round(sum / count) : null;
  };

  const getStudentQuarterAvg = (studentId, quarter) => {
    let sum = 0, count = 0;
    subjects.forEach(subj => {
      const v = grades[`${studentId}-${subj}-${quarter}`];
      if (v != null && !isNaN(v)) { sum += Number(v); count++; }
    });
    return count > 0 ? Math.round(sum / count) : null;
  };

  const getStudentGeneralAvg = (studentId) => {
    let sum = 0, count = 0;
    subjects.forEach(subj => {
      const avg = getStudentSubjectAvg(studentId, subj);
      if (avg != null) { sum += avg; count++; }
    });
    return count > 0 ? Math.round(sum / count) : null;
  };

  // Inline edit handlers
  const startEdit = (studentId, subject) => {
    if (releasedQuarters[`${filterSection}-${activeQuarter}`]) return;
    const key = `${studentId}-${subject}-${activeQuarter}`;
    setEditingCell(`${studentId}-${subject}`);
    setEditValue(grades[key] != null ? String(grades[key]) : '');
  };

  const saveEdit = (studentId, subject) => {
    const key = `${studentId}-${subject}-${activeQuarter}`;
    const num = editValue.trim() === '' ? null : Number(editValue);
    if (num !== null && (isNaN(num) || num < 0 || num > 100)) {
      setToast({ type: 'error', message: 'Grade must be 0-100' });
      return;
    }
    setGrades(prev => ({ ...prev, [key]: num }));
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e, studentId, subject) => {
    if (e.key === 'Enter') saveEdit(studentId, subject);
    if (e.key === 'Escape') cancelEdit();
    if (e.key === 'Tab') {
      e.preventDefault();
      saveEdit(studentId, subject);
      // Move to next cell
      const currentSubjIdx = displaySubjects.indexOf(subject);
      const currentStudentIdx = filteredStudents.findIndex(s => s.id === studentId);
      if (currentSubjIdx < displaySubjects.length - 1) {
        startEdit(studentId, displaySubjects[currentSubjIdx + 1]);
      } else if (currentStudentIdx < filteredStudents.length - 1) {
        startEdit(filteredStudents[currentStudentIdx + 1].id, displaySubjects[0]);
      }
    }
  };

  const handleRelease = () => {
    const key = `${filterSection}-${activeQuarter}`;
    setReleasedQuarters(prev => ({ ...prev, [key]: true }));
    setShowReleaseConfirm(false);
    setToast({ type: 'success', message: `${activeQuarter} grades for ${filterSection} section released successfully.` });
  };

  const isQuarterReleased = releasedQuarters[`${filterSection}-${activeQuarter}`];

  // Stats for the current view
  const stats = useMemo(() => {
    let total = 0, passing = 0, failing = 0, honors = 0;
    filteredStudents.forEach(s => {
      const avg = getStudentQuarterAvg(s.id, activeQuarter);
      if (avg != null) {
        total++;
        if (avg >= 75) passing++;
        if (avg < 75) failing++;
        if (avg >= 90) honors++;
      }
    });
    return { total, passing, failing, honors };
  }, [filteredStudents, activeQuarter, grades]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-slide-in",
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Students</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Passing</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{stats.passing}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4">
            <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Failing</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{stats.failing}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">With Honors</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{stats.honors}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls Row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Quarter Tabs */}
            <Tabs value={activeQuarter} onValueChange={setActiveQuarter} className="shrink-0">
              <TabsList>
                {quarters.map(q => (
                  <TabsTrigger key={q} value={q} className="gap-1">
                    {q}
                    {releasedQuarters[`${filterSection}-${q}`] && (
                      <Check className="h-3 w-3" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Filters */}
            <div className="flex flex-1 flex-wrap gap-2">
              <Select
                value={filterSection}
                onChange={e => setFilterSection(e.target.value)}
                className="w-auto"
              >
                {sectionOptions.map(s => (
                  <option key={s} value={s}>{s} ({sectionGradeMap[s]})</option>
                ))}
              </Select>
              <Select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="w-auto"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <Button
                variant={showTransmutation ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowTransmutation(!showTransmutation)}
                title="Toggle DepEd Transmutation"
              >
                T
              </Button>
              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => !isQuarterReleased && setShowReleaseConfirm(true)}
                  disabled={isQuarterReleased}
                  variant={isQuarterReleased ? 'secondary' : 'default'}
                >
                  {isQuarterReleased ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Released
                    </>
                  ) : (
                    'Release Grades'
                  )}
                </Button>
              )}
            </div>
          </div>

          {isQuarterReleased && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <Lock className="h-4 w-4" />
              <span>{activeQuarter} grades for {filterSection} section have been released. Editing is locked.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transmutation Reference */}
      {showTransmutation && (
        <Card className="border-indigo-200">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-indigo-800">DepEd Transmutation Table Reference</CardTitle>
            <p className="text-xs text-muted-foreground">Based on DepEd Order No. 8, s. 2015 -- Policy Guidelines on Classroom Assessment for the K to 12 Basic Education Program</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1 text-xs">
              {transmutationTable.slice(0, 30).map(([raw, trans]) => (
                <div key={raw} className={cn("text-center p-1.5 rounded", gradeColor(trans))}>
                  <div className="font-mono font-semibold">{trans}</div>
                  <div className="text-[10px] opacity-70">{'\u2265'}{raw}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grade Entry Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="sticky left-0 bg-muted/50 z-10 min-w-[180px]">Student</TableHead>
              {displaySubjects.map(subj => (
                <TableHead key={subj} className="text-center min-w-[90px]">
                  <span className="block truncate max-w-[100px]" title={subj}>{subj.length > 10 ? subj.slice(0, 8) + '\u2026' : subj}</span>
                  {showTransmutation && <span className="block text-[10px] font-normal text-indigo-500">Transmuted</span>}
                </TableHead>
              ))}
              <TableHead className="text-center text-primary bg-indigo-50/50 min-w-[80px]">Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, idx) => {
              const qAvg = getStudentQuarterAvg(student.id, activeQuarter);
              return (
                <TableRow
                  key={student.id}
                  className={cn(idx % 2 === 0 ? 'bg-background' : 'bg-muted/20')}
                >
                  <TableCell className="px-4 py-2.5 sticky left-0 bg-inherit z-10">
                    <button
                      onClick={() => setSelectedStudent(student.id === selectedStudent ? null : student.id)}
                      className="flex items-center gap-2 text-left hover:text-primary transition-colors group w-full"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-bold">
                          {getInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground group-hover:text-primary truncate text-sm">
                          {student.lastName}, {student.firstName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{student.lrn}</div>
                      </div>
                    </button>
                  </TableCell>
                  {displaySubjects.map(subj => {
                    const key = `${student.id}-${subj}-${activeQuarter}`;
                    const val = grades[key];
                    const isEditing = editingCell === `${student.id}-${subj}`;
                    const transmuted = showTransmutation ? transmute(val) : null;
                    const displayVal = showTransmutation ? transmuted : val;

                    return (
                      <TableCell key={subj} className="text-center px-1 py-1.5">
                        {isEditing ? (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(student.id, subj)}
                            onKeyDown={e => handleKeyDown(e, student.id, subj)}
                            autoFocus
                            className="w-16 mx-auto px-2 py-1 text-center text-sm h-8 border-2 border-primary"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(student.id, subj)}
                            className={cn(
                              "w-16 mx-auto px-2 py-1 rounded-md text-sm font-mono font-semibold transition-all cursor-pointer hover:ring-2 hover:ring-primary/40",
                              displayVal != null ? gradeColor(displayVal) : 'bg-muted text-muted-foreground',
                              isQuarterReleased && 'cursor-default hover:ring-0'
                            )}
                            title={showTransmutation && val != null ? `Raw: ${val} \u2192 Transmuted: ${transmuted}` : isQuarterReleased ? 'Released \u2014 editing locked' : 'Click to edit'}
                          >
                            {displayVal != null ? displayVal : '\u2014'}
                          </button>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center px-3 py-2.5 bg-indigo-50/30">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-bold font-mono border-0",
                        gradeColorBadge(showTransmutation ? transmute(qAvg) : qAvg)
                      )}
                    >
                      {qAvg != null ? (showTransmutation ? transmute(qAvg) : qAvg) : '\u2014'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={displaySubjects.length + 2} className="text-center py-12 text-muted-foreground">
                  No students found in this section.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Student Grade Summary Panel */}
      {selectedStudent && (() => {
        const student = classRoster.find(s => s.id === selectedStudent);
        if (!student) return null;
        const genAvg = getStudentGeneralAvg(student.id);
        const transmutedGenAvg = showTransmutation ? transmute(genAvg) : genAvg;

        return (
          <Card className="overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white/20 text-white text-sm font-bold">
                    {getInitials(student)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold">{student.lastName}, {student.firstName} {student.middleName}</h3>
                  <p className="text-indigo-200 text-xs">LRN: {student.lrn} {'\u00B7'} {student.gradeLevel} - {student.section}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStudent(null)}
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Subject</TableHead>
                    {quarters.map(q => (
                      <TableHead key={q} className="text-center font-semibold">{q}</TableHead>
                    ))}
                    <TableHead className="text-center font-semibold text-primary">Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map(subj => {
                    const avg = getStudentSubjectAvg(student.id, subj);
                    const transAvg = showTransmutation ? transmute(avg) : avg;
                    return (
                      <TableRow key={subj}>
                        <TableCell className="font-medium">{subj}</TableCell>
                        {quarters.map(q => {
                          const val = grades[`${student.id}-${subj}-${q}`];
                          const display = showTransmutation ? transmute(val) : val;
                          return (
                            <TableCell key={q} className="text-center">
                              <Badge
                                variant="outline"
                                className={cn("font-bold font-mono text-xs border-0 w-10 justify-center", gradeColorBadge(display))}
                              >
                                {display != null ? display : '\u2014'}
                              </Badge>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn("font-bold font-mono text-xs border-0", gradeColorBadge(transAvg))}
                          >
                            {transAvg != null ? transAvg : '\u2014'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">General Average</TableCell>
                    {quarters.map(q => {
                      const qAvg = getStudentQuarterAvg(student.id, q);
                      const display = showTransmutation ? transmute(qAvg) : qAvg;
                      return (
                        <TableCell key={q} className="text-center">
                          <Badge
                            variant="outline"
                            className={cn("font-bold font-mono text-xs border-0 w-10 justify-center", gradeColorBadge(display))}
                          >
                            {display != null ? display : '\u2014'}
                          </Badge>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn("font-extrabold font-mono text-sm border-0 px-3 py-1", gradeColorBadge(transmutedGenAvg))}
                      >
                        {transmutedGenAvg != null ? transmutedGenAvg : '\u2014'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              {/* Remarks */}
              {genAvg != null && (
                <div className={cn(
                  "mt-3 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2",
                  transmutedGenAvg >= 90
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : transmutedGenAvg >= 75
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                )}>
                  {transmutedGenAvg >= 90
                    ? <Check className="h-4 w-4" />
                    : transmutedGenAvg >= 75
                    ? <Check className="h-4 w-4" />
                    : <AlertTriangle className="h-4 w-4" />}
                  <span>
                    {transmutedGenAvg >= 98 ? 'With Highest Honors' :
                     transmutedGenAvg >= 95 ? 'With High Honors' :
                     transmutedGenAvg >= 90 ? 'With Honors' :
                     transmutedGenAvg >= 75 ? 'Passed' :
                     'Did Not Meet Expectations'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {/* Release Grades Confirmation Modal */}
      <Dialog open={showReleaseConfirm} onOpenChange={setShowReleaseConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Release Grades</DialogTitle>
            <DialogDescription>
              You are about to release <span className="font-bold text-foreground">{activeQuarter}</span> grades for <span className="font-bold text-foreground">{filterSection}</span> section ({sectionGradeMap[filterSection]}).
            </DialogDescription>
          </DialogHeader>
          <div className="px-0 py-2">
            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">This action cannot be undone.</p>
                <p className="mt-1 text-xs">Once released, grades will be visible to students and parents, and editing will be locked for this quarter.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReleaseConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleRelease}>
              Confirm Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
