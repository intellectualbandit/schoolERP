import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText, Download, Eye, Clock, Search, Filter,
  CheckCircle, Users, GraduationCap, MapPin, ClipboardList,
  BookOpen, ChevronRight, Calendar, RotateCcw, Printer,
  ArrowLeft, History, FileCheck, Loader2, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolConfig } from '../contexts/SchoolConfigContext';

// ============================================================
// CONSTANTS
// ============================================================

// SCHOOL_YEARS, GRADE_LEVELS, SECTIONS from SchoolConfigContext

const REPORT_TYPES = [
  {
    id: 'sf1',
    name: 'SF1 — School Register',
    shortName: 'SF1',
    description: 'Official list of learners enrolled in each grade level and section, including personal information, LRN, and enrollment status.',
    icon: ClipboardList,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200',
    accentColor: 'bg-indigo-600',
  },
  {
    id: 'sf9',
    name: 'SF9 — Report Card',
    shortName: 'SF9',
    description: 'Learner progress report card showing quarterly grades per subject, general average, attendance record, and character traits.',
    icon: BookOpen,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-200',
    accentColor: 'bg-teal-600',
  },
  {
    id: 'sf10',
    name: 'SF10 — Form 137',
    shortName: 'SF10',
    description: 'Permanent learner record containing cumulative academic history, personal data, and scholastic records across school years.',
    icon: FileCheck,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    accentColor: 'bg-amber-600',
  },
  {
    id: 'enrollment',
    name: 'Enrollment Summary',
    shortName: 'Enrollment',
    description: 'Statistical summary of enrollment by grade level and section, including gender breakdown, new learners, transferees, and totals.',
    icon: Users,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    accentColor: 'bg-emerald-600',
  },
  {
    id: 'barangay',
    name: 'Barangay Report',
    shortName: 'Barangay',
    description: 'Distribution of enrolled learners by barangay of residence for LGU coordination and community-level reporting.',
    icon: MapPin,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-200',
    accentColor: 'bg-rose-600',
  },
];

// ============================================================
// STUDENT DATA (consistent with other pages)
// ============================================================

const classRoster = [
  { id: 1,  lrn: '136482790001', firstName: 'Juan',       middleName: 'Santos',     lastName: 'Dela Cruz',  gender: 'Male',   gradeLevel: 'Grade 7',  section: 'Rizal',     barangay: 'Brgy. San Jose',     status: 'Active',  dateOfBirth: '2011-03-15' },
  { id: 2,  lrn: '136482790002', firstName: 'Maria',      middleName: 'Reyes',      lastName: 'Santos',     gender: 'Female', gradeLevel: 'Grade 8',  section: 'Bonifacio', barangay: 'Brgy. Poblacion',    status: 'Active',  dateOfBirth: '2010-07-22' },
  { id: 3,  lrn: '136482790003', firstName: 'Andres',     middleName: 'Luna',       lastName: 'Bautista',   gender: 'Male',   gradeLevel: 'Grade 9',  section: 'Mabini',    barangay: 'Brgy. Del Rosario',  status: 'Active',  dateOfBirth: '2009-11-05' },
  { id: 4,  lrn: '136482790004', firstName: 'Gabriela',   middleName: 'Aquino',     lastName: 'Reyes',      gender: 'Female', gradeLevel: 'Grade 10', section: 'Aguinaldo', barangay: 'Brgy. San Jose',     status: 'Active',  dateOfBirth: '2008-05-18' },
  { id: 5,  lrn: '136482790005', firstName: 'Jose',       middleName: 'Garcia',     lastName: 'Rizal',      gender: 'Male',   gradeLevel: 'Grade 7',  section: 'Rizal',     barangay: 'Brgy. Bagumbayan',   status: 'Active',  dateOfBirth: '2011-06-19' },
  { id: 6,  lrn: '136482790006', firstName: 'Corazon',    middleName: 'Mercado',    lastName: 'Aquino',     gender: 'Female', gradeLevel: 'Grade 8',  section: 'Bonifacio', barangay: 'Brgy. Poblacion',    status: 'Active',  dateOfBirth: '2010-01-25' },
  { id: 7,  lrn: '136482790007', firstName: 'Emilio',     middleName: 'Jacinto',    lastName: 'Aguinaldo',  gender: 'Male',   gradeLevel: 'Grade 9',  section: 'Mabini',    barangay: 'Brgy. Kawit',        status: 'Active',  dateOfBirth: '2009-03-22' },
  { id: 8,  lrn: '136482790008', firstName: 'Leni',       middleName: 'Gerona',     lastName: 'Robredo',    gender: 'Female', gradeLevel: 'Grade 10', section: 'Aguinaldo', barangay: 'Brgy. Del Rosario',  status: 'Active',  dateOfBirth: '2008-04-23' },
  { id: 9,  lrn: '136482790009', firstName: 'Manuel',     middleName: 'Tinio',      lastName: 'Quezon',     gender: 'Male',   gradeLevel: 'Grade 7',  section: 'Rizal',     barangay: 'Brgy. San Jose',     status: 'Active',  dateOfBirth: '2011-08-19' },
  { id: 10, lrn: '136482790010', firstName: 'Josefa',     middleName: 'Llanes',     lastName: 'Escoda',     gender: 'Female', gradeLevel: 'Grade 8',  section: 'Bonifacio', barangay: 'Brgy. Bagumbayan',   status: 'Active',  dateOfBirth: '2010-09-20' },
  { id: 11, lrn: '136482790011', firstName: 'Apolinario', middleName: 'De La Cruz', lastName: 'Mabini',     gender: 'Male',   gradeLevel: 'Grade 9',  section: 'Mabini',    barangay: 'Brgy. Kawit',        status: 'Active',  dateOfBirth: '2009-07-23' },
  { id: 12, lrn: '136482790012', firstName: 'Teresa',     middleName: 'Magbanua',   lastName: 'Silang',     gender: 'Female', gradeLevel: 'Grade 10', section: 'Aguinaldo', barangay: 'Brgy. Poblacion',    status: 'Active',  dateOfBirth: '2008-12-25' },
];

// subjects from SchoolConfigContext

// Simplified grades for preview (subject -> [Q1,Q2,Q3,Q4])
const studentGrades = {
  1:  { Filipino: [88,85,90,87], English: [82,80,78,84], Mathematics: [91,89,93,90], Science: [86,84,88,85], 'Araling Panlipunan': [90,88,91,89], ESP: [92,90,93,91], MAPEH: [89,87,90,88], TLE: [85,83,87,84] },
  2:  { Filipino: [92,94,91,93], English: [95,93,96,94], Mathematics: [88,90,87,89], Science: [91,89,92,90], 'Araling Panlipunan': [93,95,94,92], ESP: [90,92,91,93], MAPEH: [94,92,95,93], TLE: [87,89,88,90] },
  3:  { Filipino: [78,80,76,79], English: [74,72,75,73], Mathematics: [70,68,72,71], Science: [76,74,78,75], 'Araling Panlipunan': [80,82,79,81], ESP: [77,75,78,76], MAPEH: [82,80,83,81], TLE: [75,73,76,74] },
  4:  { Filipino: [95,97,94,96], English: [98,96,97,95], Mathematics: [92,94,93,91], Science: [96,94,95,97], 'Araling Panlipunan': [94,96,95,93], ESP: [97,95,96,98], MAPEH: [93,95,94,96], TLE: [91,93,92,94] },
  5:  { Filipino: [85,83,86,84], English: [80,78,82,79], Mathematics: [77,75,79,76], Science: [83,81,84,82], 'Araling Panlipunan': [86,84,87,85], ESP: [81,79,82,80], MAPEH: [84,82,85,83], TLE: [78,76,80,77] },
  6:  { Filipino: [89,91,88,90], English: [87,85,89,86], Mathematics: [83,81,85,82], Science: [88,86,90,87], 'Araling Panlipunan': [91,89,92,90], ESP: [86,88,87,89], MAPEH: [90,88,91,89], TLE: [84,86,85,87] },
  7:  { Filipino: [72,70,74,71], English: [68,66,70,67], Mathematics: [65,63,67,64], Science: [71,69,73,70], 'Araling Panlipunan': [75,73,76,74], ESP: [70,68,72,69], MAPEH: [74,72,75,73], TLE: [67,65,69,66] },
  8:  { Filipino: [93,91,94,92], English: [96,94,95,93], Mathematics: [90,92,91,89], Science: [94,92,93,95], 'Araling Panlipunan': [92,94,93,91], ESP: [95,93,94,96], MAPEH: [91,93,92,94], TLE: [89,91,90,92] },
  9:  { Filipino: [81,79,83,80], English: [76,74,78,75], Mathematics: [73,71,74,72], Science: [79,77,80,78], 'Araling Panlipunan': [83,81,84,82], ESP: [78,76,79,77], MAPEH: [82,80,83,81], TLE: [75,73,77,74] },
  10: { Filipino: [58,60,55,57], English: [62,59,63,61], Mathematics: [55,53,57,54], Science: [60,58,62,59], 'Araling Panlipunan': [64,62,65,63], ESP: [57,55,59,56], MAPEH: [63,61,64,62], TLE: [56,54,58,55] },
  11: { Filipino: [86,84,88,85], English: [82,80,84,81], Mathematics: [79,77,81,78], Science: [85,83,86,84], 'Araling Panlipunan': [88,86,89,87], ESP: [83,81,85,82], MAPEH: [87,85,88,86], TLE: [80,78,82,79] },
  12: { Filipino: [91,93,90,92], English: [94,92,93,91], Mathematics: [88,90,89,87], Science: [92,90,91,93], 'Araling Panlipunan': [90,92,91,89], ESP: [93,91,92,94], MAPEH: [89,91,90,92], TLE: [86,88,87,89] },
};

// ============================================================
// GENERATION HISTORY
// ============================================================

const initialHistory = [
  { id: 1,  reportId: 'sf1',        schoolYear: '2025-2026', gradeLevel: 'Grade 7',  section: 'Rizal',     generatedBy: 'Admin User',             generatedAt: '2026-03-10T09:15:00' },
  { id: 2,  reportId: 'sf9',        schoolYear: '2025-2026', gradeLevel: 'Grade 8',  section: 'Bonifacio', generatedBy: 'Mrs. Gonzales',          generatedAt: '2026-03-12T14:30:00' },
  { id: 3,  reportId: 'enrollment', schoolYear: '2025-2026', gradeLevel: '',          section: '',          generatedBy: 'Admin User',             generatedAt: '2026-03-15T08:45:00' },
  { id: 4,  reportId: 'sf10',       schoolYear: '2025-2026', gradeLevel: 'Grade 10', section: 'Aguinaldo', generatedBy: 'Mr. Reyes',              generatedAt: '2026-03-16T10:20:00' },
  { id: 5,  reportId: 'barangay',   schoolYear: '2025-2026', gradeLevel: '',          section: '',          generatedBy: 'Admin User',             generatedAt: '2026-03-18T11:00:00' },
  { id: 6,  reportId: 'sf1',        schoolYear: '2025-2026', gradeLevel: 'Grade 9',  section: 'Mabini',    generatedBy: 'Mrs. Lim',               generatedAt: '2026-03-19T13:45:00' },
  { id: 7,  reportId: 'sf9',        schoolYear: '2025-2026', gradeLevel: 'Grade 7',  section: 'Rizal',     generatedBy: 'Mr. Santos',             generatedAt: '2026-03-20T09:30:00' },
  { id: 8,  reportId: 'enrollment', schoolYear: '2024-2025', gradeLevel: '',          section: '',          generatedBy: 'Admin User',             generatedAt: '2025-06-15T16:00:00' },
  { id: 9,  reportId: 'sf1',        schoolYear: '2024-2025', gradeLevel: 'Grade 8',  section: 'Bonifacio', generatedBy: 'Mrs. Gonzales',          generatedAt: '2025-06-10T10:15:00' },
  { id: 10, reportId: 'sf10',       schoolYear: '2025-2026', gradeLevel: 'Grade 9',  section: 'Mabini',    generatedBy: 'Admin User',             generatedAt: '2026-03-22T08:00:00' },
];

// ============================================================
// HELPERS
// ============================================================

const formatDateTime = (isoStr) => {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const formatDateShort = (isoStr) => {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getReportType = (id) => REPORT_TYPES.find((r) => r.id === id);

const getLastGenerated = (reportId, history) => {
  const entries = history.filter((h) => h.reportId === reportId).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  return entries[0] || null;
};

const getFullName = (s) => `${s.lastName}, ${s.firstName} ${s.middleName.charAt(0)}.`;
const getShortName = (s) => `${s.firstName} ${s.lastName}`;

// ============================================================
// PREVIEW RENDERERS
// ============================================================

function SF1Preview({ gradeLevel, section }) {
  const students = classRoster.filter((s) =>
    (!gradeLevel || s.gradeLevel === gradeLevel) && (!section || s.section === section)
  );
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 pb-3 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Republic of the Philippines &middot; Department of Education</p>
        <h3 className="text-base font-bold">School Register (SF1)</h3>
        <p className="text-sm text-muted-foreground">
          {gradeLevel || 'All Grades'} {section ? `— ${section}` : ''} &middot; S.Y. 2025-2026
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-xs">#</TableHead>
              <TableHead className="text-xs">LRN</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Sex</TableHead>
              <TableHead className="text-xs">Birth Date</TableHead>
              <TableHead className="text-xs">Grade & Section</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="text-xs font-mono">{s.lrn}</TableCell>
                <TableCell className="text-xs font-medium">{getFullName(s)}</TableCell>
                <TableCell className="text-xs">{s.gender === 'Male' ? 'M' : 'F'}</TableCell>
                <TableCell className="text-xs">{formatDateShort(s.dateOfBirth + 'T00:00:00')}</TableCell>
                <TableCell className="text-xs">{s.gradeLevel} — {s.section}</TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">{s.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground text-right pt-2 border-t">
        Total Learners: <span className="font-medium text-foreground">{students.length}</span>
        &nbsp;&middot;&nbsp;Male: <span className="font-medium text-foreground">{students.filter(s => s.gender === 'Male').length}</span>
        &nbsp;&middot;&nbsp;Female: <span className="font-medium text-foreground">{students.filter(s => s.gender === 'Female').length}</span>
      </div>
    </div>
  );
}

function SF9Preview({ gradeLevel, section }) {
  const students = classRoster.filter((s) =>
    (!gradeLevel || s.gradeLevel === gradeLevel) && (!section || s.section === section)
  );
  const student = students[0];
  if (!student) return <p className="text-sm text-muted-foreground text-center py-8">No students found for the selected filters.</p>;
  const grades = studentGrades[student.id] || {};

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 pb-3 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Republic of the Philippines &middot; Department of Education</p>
        <h3 className="text-base font-bold">Learner Progress Report Card (SF9)</h3>
        <p className="text-sm text-muted-foreground">S.Y. 2025-2026</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm px-1">
        <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{getFullName(student)}</span></div>
        <div><span className="text-muted-foreground">LRN:</span> <span className="font-mono">{student.lrn}</span></div>
        <div><span className="text-muted-foreground">Grade & Section:</span> <span className="font-medium">{student.gradeLevel} — {student.section}</span></div>
        <div><span className="text-muted-foreground">Sex:</span> {student.gender}</div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Subject</TableHead>
              <TableHead className="text-xs text-center">Q1</TableHead>
              <TableHead className="text-xs text-center">Q2</TableHead>
              <TableHead className="text-xs text-center">Q3</TableHead>
              <TableHead className="text-xs text-center">Q4</TableHead>
              <TableHead className="text-xs text-center">Final</TableHead>
              <TableHead className="text-xs text-center">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subj) => {
              const g = grades[subj] || [0,0,0,0];
              const final = Math.round(g.reduce((a, b) => a + b, 0) / 4);
              return (
                <TableRow key={subj}>
                  <TableCell className="text-xs font-medium">{subj}</TableCell>
                  {g.map((grade, qi) => (
                    <TableCell key={qi} className={cn('text-xs text-center', grade < 75 && 'text-rose-600 font-medium')}>
                      {grade}
                    </TableCell>
                  ))}
                  <TableCell className={cn('text-xs text-center font-bold', final < 75 && 'text-rose-600')}>
                    {final}
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    {final >= 75 ? (
                      <span className="text-emerald-600">Passed</span>
                    ) : (
                      <span className="text-rose-600">Failed</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {(() => {
        const allGrades = subjects.map((subj) => {
          const g = grades[subj] || [0,0,0,0];
          return Math.round(g.reduce((a, b) => a + b, 0) / 4);
        });
        const genAvg = Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length);
        return (
          <div className="flex justify-between items-center px-1 pt-2 border-t text-sm">
            <span className="text-muted-foreground">General Average</span>
            <span className={cn('font-bold text-lg', genAvg < 75 ? 'text-rose-600' : 'text-emerald-600')}>{genAvg}</span>
          </div>
        );
      })()}

      <p className="text-[10px] text-muted-foreground italic">
        Showing report card for {getShortName(student)}. Full generation will include all {students.length} student{students.length !== 1 ? 's' : ''} in the selection.
      </p>
    </div>
  );
}

function SF10Preview({ gradeLevel, section }) {
  const students = classRoster.filter((s) =>
    (!gradeLevel || s.gradeLevel === gradeLevel) && (!section || s.section === section)
  );
  const student = students[0];
  if (!student) return <p className="text-sm text-muted-foreground text-center py-8">No students found for the selected filters.</p>;
  const grades = studentGrades[student.id] || {};

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 pb-3 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Republic of the Philippines &middot; Department of Education</p>
        <h3 className="text-base font-bold">Learner's Permanent Academic Record (SF10)</h3>
        <p className="text-sm text-muted-foreground">Form 137</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm px-1">
        <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{getFullName(student)}</span></div>
        <div><span className="text-muted-foreground">LRN:</span> <span className="font-mono">{student.lrn}</span></div>
        <div><span className="text-muted-foreground">Date of Birth:</span> {formatDateShort(student.dateOfBirth + 'T00:00:00')}</div>
        <div><span className="text-muted-foreground">Sex:</span> {student.gender}</div>
      </div>

      <div className="border rounded-lg p-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Scholastic Record — S.Y. 2025-2026 ({student.gradeLevel})</p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Subject</TableHead>
                <TableHead className="text-xs text-center">Q1</TableHead>
                <TableHead className="text-xs text-center">Q2</TableHead>
                <TableHead className="text-xs text-center">Q3</TableHead>
                <TableHead className="text-xs text-center">Q4</TableHead>
                <TableHead className="text-xs text-center">Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subj) => {
                const g = grades[subj] || [0,0,0,0];
                const final = Math.round(g.reduce((a, b) => a + b, 0) / 4);
                return (
                  <TableRow key={subj}>
                    <TableCell className="text-xs">{subj}</TableCell>
                    {g.map((grade, qi) => (
                      <TableCell key={qi} className="text-xs text-center">{grade}</TableCell>
                    ))}
                    <TableCell className="text-xs text-center font-bold">{final}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground italic">
        Showing permanent record for {getShortName(student)}. Full generation will include all {students.length} student{students.length !== 1 ? 's' : ''} in the selection.
      </p>
    </div>
  );
}

function EnrollmentPreview({ gradeLevel }) {
  const gradeLevels = gradeLevel ? [gradeLevel] : GRADE_LEVELS;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 pb-3 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Republic of the Philippines &middot; Department of Education</p>
        <h3 className="text-base font-bold">Enrollment Summary Report</h3>
        <p className="text-sm text-muted-foreground">S.Y. 2025-2026</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Grade Level</TableHead>
              <TableHead className="text-xs">Section</TableHead>
              <TableHead className="text-xs text-center">Male</TableHead>
              <TableHead className="text-xs text-center">Female</TableHead>
              <TableHead className="text-xs text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradeLevels.map((gl) => {
              const section = SECTIONS[gl];
              const students = classRoster.filter((s) => s.gradeLevel === gl);
              const male = students.filter((s) => s.gender === 'Male').length;
              const female = students.filter((s) => s.gender === 'Female').length;
              return (
                <TableRow key={gl}>
                  <TableCell className="text-xs font-medium">{gl}</TableCell>
                  <TableCell className="text-xs">{section}</TableCell>
                  <TableCell className="text-xs text-center">{male}</TableCell>
                  <TableCell className="text-xs text-center">{female}</TableCell>
                  <TableCell className="text-xs text-center font-bold">{students.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Totals */}
      {(() => {
        const filtered = classRoster.filter((s) => !gradeLevel || s.gradeLevel === gradeLevel);
        const male = filtered.filter((s) => s.gender === 'Male').length;
        const female = filtered.filter((s) => s.gender === 'Female').length;
        return (
          <div className="flex gap-6 justify-center pt-2 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Male</p>
              <p className="text-lg font-bold text-indigo-600">{male}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Female</p>
              <p className="text-lg font-bold text-rose-600">{female}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Grand Total</p>
              <p className="text-lg font-bold">{filtered.length}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function BarangayPreview() {
  const barangayCounts = {};
  classRoster.forEach((s) => {
    if (!barangayCounts[s.barangay]) barangayCounts[s.barangay] = { male: 0, female: 0, total: 0 };
    barangayCounts[s.barangay].total++;
    if (s.gender === 'Male') barangayCounts[s.barangay].male++;
    else barangayCounts[s.barangay].female++;
  });

  const sorted = Object.entries(barangayCounts).sort((a, b) => b[1].total - a[1].total);
  const maxTotal = sorted[0]?.[1].total || 1;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 pb-3 border-b">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Republic of the Philippines &middot; Department of Education</p>
        <h3 className="text-base font-bold">Learner Distribution by Barangay</h3>
        <p className="text-sm text-muted-foreground">S.Y. 2025-2026</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Barangay</TableHead>
              <TableHead className="text-xs text-center">Male</TableHead>
              <TableHead className="text-xs text-center">Female</TableHead>
              <TableHead className="text-xs text-center">Total</TableHead>
              <TableHead className="text-xs">Distribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(([brgy, counts]) => (
              <TableRow key={brgy}>
                <TableCell className="text-xs font-medium">{brgy}</TableCell>
                <TableCell className="text-xs text-center">{counts.male}</TableCell>
                <TableCell className="text-xs text-center">{counts.female}</TableCell>
                <TableCell className="text-xs text-center font-bold">{counts.total}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-rose-400 rounded-full transition-all"
                        style={{ width: `${(counts.total / maxTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[10px] w-8 text-right">
                      {Math.round((counts.total / classRoster.length) * 100)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground text-right pt-2 border-t">
        Total Learners: <span className="font-medium text-foreground">{classRoster.length}</span>
        &nbsp;&middot;&nbsp;Barangays: <span className="font-medium text-foreground">{sorted.length}</span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Reports() {
  const { gradeLevels: GRADE_LEVELS, gradeSectionMap: SECTIONS, subjects, schoolYear } = useSchoolConfig();
  const SCHOOL_YEARS = useMemo(() => [schoolYear], [schoolYear]);
  const { isReadOnly: checkReadOnly } = useAuth();
  const readOnly = checkReadOnly('reports');
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(initialHistory);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters for the active report
  const [filterSchoolYear, setFilterSchoolYear] = useState('2025-2026');
  const [filterGradeLevel, setFilterGradeLevel] = useState('');
  const [filterSection, setFilterSection] = useState('');

  // History search
  const [historySearch, setHistorySearch] = useState('');

  // Loading skeleton
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Reset filters when switching reports
  useEffect(() => {
    setFilterGradeLevel('');
    setFilterSection('');
  }, [selectedReport]);

  // Auto-set section when grade level changes
  useEffect(() => {
    if (filterGradeLevel && SECTIONS[filterGradeLevel]) {
      setFilterSection(SECTIONS[filterGradeLevel]);
    } else {
      setFilterSection('');
    }
  }, [filterGradeLevel]);

  // ---- Derived data ----

  const filteredHistory = useMemo(() => {
    return history
      .filter((h) => {
        const report = getReportType(h.reportId);
        const q = historySearch.toLowerCase();
        return !q ||
          report?.name.toLowerCase().includes(q) ||
          h.generatedBy.toLowerCase().includes(q) ||
          h.schoolYear.includes(q) ||
          (h.gradeLevel && h.gradeLevel.toLowerCase().includes(q));
      })
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  }, [history, historySearch]);

  const reportStats = useMemo(() => {
    const total = history.length;
    const thisMonth = history.filter((h) => {
      const d = new Date(h.generatedAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const uniqueReports = new Set(history.map((h) => h.reportId)).size;
    return { total, thisMonth, uniqueReports };
  }, [history]);

  // ---- Handlers ----

  const showToast = useCallback((message) => {
    setToast({ message });
  }, []);

  const handleGenerate = useCallback(() => {
    if (!selectedReport) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        reportId: selectedReport,
        schoolYear: filterSchoolYear,
        gradeLevel: filterGradeLevel,
        section: filterSection,
        generatedBy: 'Admin User',
        generatedAt: new Date().toISOString(),
      };
      setHistory((prev) => [newEntry, ...prev]);
      setIsGenerating(false);
      const report = getReportType(selectedReport);
      showToast(`${report?.shortName} generated and ready for download`);
    }, 1500);
  }, [selectedReport, filterSchoolYear, filterGradeLevel, filterSection, showToast]);

  const handleDownload = useCallback(() => {
    const report = getReportType(selectedReport);
    showToast(`${report?.shortName} downloaded as PDF`);
  }, [selectedReport, showToast]);

  // ---- Loading skeleton ----

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // ---- Render helpers ----

  const renderPreview = () => {
    switch (selectedReport) {
      case 'sf1': return <SF1Preview gradeLevel={filterGradeLevel} section={filterSection} />;
      case 'sf9': return <SF9Preview gradeLevel={filterGradeLevel} section={filterSection} />;
      case 'sf10': return <SF10Preview gradeLevel={filterGradeLevel} section={filterSection} />;
      case 'enrollment': return <EnrollmentPreview gradeLevel={filterGradeLevel} />;
      case 'barangay': return <BarangayPreview />;
      default: return null;
    }
  };

  // ---- Render ----

  return (
    <div className="space-y-6">
      {/* ============ SUMMARY CARDS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Report Types</p>
                <p className="text-2xl font-bold">{REPORT_TYPES.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Generated This Month</p>
                <p className="text-2xl font-bold text-emerald-600">{reportStats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <History className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Generated</p>
                <p className="text-2xl font-bold">{reportStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-100">
                <Users className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Learners</p>
                <p className="text-2xl font-bold">{classRoster.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============ MAIN TABS ============ */}
      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports" className="gap-1.5">
            <FileText className="h-4 w-4" /> Reports
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-4 w-4" /> Generation History
          </TabsTrigger>
        </TabsList>

        {/* ======== TAB: REPORTS ======== */}
        <TabsContent value="reports" className="mt-4">
          {!selectedReport ? (
            /* ---- Report Selection Grid ---- */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TYPES.map((report) => {
                const Icon = report.icon;
                const lastGen = getLastGenerated(report.id, history);
                return (
                  <Card
                    key={report.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md group border-t-4',
                      report.borderColor
                    )}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn('p-2.5 rounded-lg', report.bgColor)}>
                          <Icon className={cn('h-6 w-6', report.color)} />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{report.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{report.description}</p>
                      <Separator className="mb-3" />
                      <div className="flex items-center justify-between">
                        {lastGen ? (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last: {formatDateShort(lastGen.generatedAt)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Never generated</span>
                        )}
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Eye className="h-3 w-3" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* ---- Report Detail + Preview ---- */
            (() => {
              const report = getReportType(selectedReport);
              if (!report) return null;
              const Icon = report.icon;

              return (
                <div className="space-y-4">
                  {/* Back + Title */}
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)} className="gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className={cn('p-1.5 rounded-md', report.bgColor)}>
                      <Icon className={cn('h-4 w-4', report.color)} />
                    </div>
                    <h2 className="font-semibold">{report.name}</h2>
                  </div>

                  {/* Filters + Actions */}
                  <Card>
                    <CardContent className="pt-5 pb-4">
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex gap-3 flex-wrap flex-1">
                          <div className="space-y-1.5">
                            <Label className="text-xs">School Year</Label>
                            <Select value={filterSchoolYear} onChange={(e) => setFilterSchoolYear(e.target.value)} className="w-[140px]">
                              {SCHOOL_YEARS.map((sy) => (
                                <option key={sy} value={sy}>{sy}</option>
                              ))}
                            </Select>
                          </div>
                          {selectedReport !== 'barangay' && (
                            <div className="space-y-1.5">
                              <Label className="text-xs">Grade Level</Label>
                              <Select value={filterGradeLevel} onChange={(e) => setFilterGradeLevel(e.target.value)} className="w-[140px]">
                                <option value="">All Grades</option>
                                {GRADE_LEVELS.map((gl) => (
                                  <option key={gl} value={gl}>{gl}</option>
                                ))}
                              </Select>
                            </div>
                          )}
                          {selectedReport !== 'barangay' && selectedReport !== 'enrollment' && filterGradeLevel && (
                            <div className="space-y-1.5">
                              <Label className="text-xs">Section</Label>
                              <Select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="w-[140px]">
                                <option value="">All Sections</option>
                                <option value={SECTIONS[filterGradeLevel]}>{SECTIONS[filterGradeLevel]}</option>
                              </Select>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={cn('gap-1.5', report.accentColor, 'hover:opacity-90 text-white')}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4" />
                                Generate Report
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={handleDownload} className="gap-1.5" disabled={isGenerating}>
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            Report Preview
                          </CardTitle>
                          <CardDescription>
                            {filterSchoolYear} {filterGradeLevel ? `• ${filterGradeLevel}` : ''} {filterSection ? `• ${filterSection}` : ''}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs gap-1">
                          <Printer className="h-3 w-3" />
                          Preview
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg p-5 bg-white">
                        {renderPreview()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()
          )}
        </TabsContent>

        {/* ======== TAB: GENERATION HISTORY ======== */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history by report name, user, or school year..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {filteredHistory.length === 0 ? (
                <div className="py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No generation history found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Report</TableHead>
                        <TableHead className="w-[110px]">School Year</TableHead>
                        <TableHead className="w-[120px]">Grade Level</TableHead>
                        <TableHead className="w-[110px]">Section</TableHead>
                        <TableHead className="w-[140px]">Generated By</TableHead>
                        <TableHead className="w-[180px]">Date & Time</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((entry) => {
                        const report = getReportType(entry.reportId);
                        if (!report) return null;
                        const Icon = report.icon;
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={cn('p-1 rounded', report.bgColor)}>
                                  <Icon className={cn('h-3.5 w-3.5', report.color)} />
                                </div>
                                <span className="text-sm font-medium">{report.shortName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{entry.schoolYear}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entry.gradeLevel || '—'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entry.section || '—'}</TableCell>
                            <TableCell className="text-sm">{entry.generatedBy}</TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDateTime(entry.generatedAt)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => showToast(`${report.shortName} re-downloaded`)}>
                                <Download className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white bg-green-600 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="h-4 w-4" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
