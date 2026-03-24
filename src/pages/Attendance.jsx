import { useState, useEffect, useMemo } from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolConfig } from '../contexts/SchoolConfigContext';
import { useNotifications } from '../contexts/NotificationContext';
import MOCK_USERS from '../data/mockUsers';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { QrCode, Check, X, AlertCircle, Save, RotateCcw, Pencil, Calendar, Users, Clock, UserX, ShieldCheck, Camera, FileText, CheckCircle, XCircle } from 'lucide-react';

// --- Sample Data ---
const classRoster = [
  { id: 1, lrn: '136482790001', firstName: 'Juan', middleName: 'Santos', lastName: 'Dela Cruz', gradeLevel: 'Grade 7', section: 'Rizal', status: 'Active' },
  { id: 2, lrn: '136482790002', firstName: 'Maria', middleName: 'Reyes', lastName: 'Santos', gradeLevel: 'Grade 8', section: 'Bonifacio', status: 'Active' },
  { id: 3, lrn: '136482790003', firstName: 'Andres', middleName: 'Luna', lastName: 'Bautista', gradeLevel: 'Grade 9', section: 'Mabini', status: 'Active' },
  { id: 4, lrn: '136482790004', firstName: 'Gabriela', middleName: 'Aquino', lastName: 'Reyes', gradeLevel: 'Grade 10', section: 'Aguinaldo', status: 'Active' },
  { id: 5, lrn: '136482790005', firstName: 'Jose', middleName: 'Garcia', lastName: 'Rizal', gradeLevel: 'Grade 7', section: 'Rizal', status: 'Inactive' },
  { id: 6, lrn: '136482790006', firstName: 'Corazon', middleName: 'Mercado', lastName: 'Aquino', gradeLevel: 'Grade 8', section: 'Bonifacio', status: 'Active' },
  { id: 7, lrn: '136482790007', firstName: 'Emilio', middleName: 'Jacinto', lastName: 'Aguinaldo', gradeLevel: 'Grade 9', section: 'Mabini', status: 'Active' },
  { id: 8, lrn: '136482790008', firstName: 'Leni', middleName: 'Gerona', lastName: 'Robredo', gradeLevel: 'Grade 10', section: 'Aguinaldo', status: 'Active' },
  { id: 9, lrn: '136482790009', firstName: 'Manuel', middleName: 'Tinio', lastName: 'Quezon', gradeLevel: 'Grade 7', section: 'Rizal', status: 'Active' },
  { id: 10, lrn: '136482790010', firstName: 'Josefa', middleName: 'Llanes', lastName: 'Escoda', gradeLevel: 'Grade 8', section: 'Bonifacio', status: 'Inactive' },
];

const initialAttendanceHistory = [
  { id: 1, date: '2026-03-09', section: 'Rizal', subject: 'Filipino', records: { 1: 'present', 9: 'present' }, savedBy: 'Maria Fe Dela Rosa', savedAt: '2026-03-09T08:15:00' },
  { id: 2, date: '2026-03-09', section: 'Bonifacio', subject: 'English', records: { 2: 'present', 6: 'late' }, savedBy: 'Jerome Pascual Bautista', savedAt: '2026-03-09T09:10:00' },
  { id: 3, date: '2026-03-10', section: 'Mabini', subject: 'Mathematics', records: { 3: 'present', 7: 'absent' }, savedBy: 'Rosa Lina Montoya', savedAt: '2026-03-10T07:45:00' },
  { id: 4, date: '2026-03-10', section: 'Aguinaldo', subject: 'Science', records: { 4: 'present', 8: 'present' }, savedBy: 'Carlos Andrade Santos', savedAt: '2026-03-10T10:30:00' },
  { id: 5, date: '2026-03-11', section: 'Rizal', subject: 'Mathematics', records: { 1: 'late', 9: 'present' }, savedBy: 'Rosa Lina Montoya', savedAt: '2026-03-11T07:50:00' },
  { id: 6, date: '2026-03-11', section: 'Bonifacio', subject: 'Filipino', records: { 2: 'present', 6: 'present' }, savedBy: 'Maria Fe Dela Rosa', savedAt: '2026-03-11T08:20:00' },
  { id: 7, date: '2026-03-12', section: 'Mabini', subject: 'Science', records: { 3: 'absent', 7: 'present' }, savedBy: 'Carlos Andrade Santos', savedAt: '2026-03-12T10:35:00' },
  { id: 8, date: '2026-03-12', section: 'Aguinaldo', subject: 'Araling Panlipunan', records: { 4: 'excused', 8: 'present' }, savedBy: 'Lourdes Reyes Villanueva', savedAt: '2026-03-12T13:10:00' },
  { id: 9, date: '2026-03-13', section: 'Rizal', subject: 'Science', records: { 1: 'present', 9: 'absent' }, savedBy: 'Carlos Andrade Santos', savedAt: '2026-03-13T10:40:00' },
  { id: 10, date: '2026-03-13', section: 'Bonifacio', subject: 'Mathematics', records: { 2: 'late', 6: 'present' }, savedBy: 'Rosa Lina Montoya', savedAt: '2026-03-13T07:55:00' },
  { id: 11, date: '2026-03-16', section: 'Rizal', subject: 'English', records: { 1: 'present', 9: 'present' }, savedBy: 'Jerome Pascual Bautista', savedAt: '2026-03-16T13:05:00' },
  { id: 12, date: '2026-03-16', section: 'Mabini', subject: 'Filipino', records: { 3: 'present', 7: 'late' }, savedBy: 'Maria Fe Dela Rosa', savedAt: '2026-03-16T08:25:00' },
  { id: 13, date: '2026-03-17', section: 'Aguinaldo', subject: 'Filipino', records: { 4: 'present', 8: 'absent' }, savedBy: 'Maria Fe Dela Rosa', savedAt: '2026-03-17T08:30:00' },
  { id: 14, date: '2026-03-18', section: 'Rizal', subject: 'Araling Panlipunan', records: { 1: 'present', 9: 'excused' }, savedBy: 'Lourdes Reyes Villanueva', savedAt: '2026-03-18T13:15:00' },
  { id: 15, date: '2026-03-19', section: 'Bonifacio', subject: 'Science', records: { 2: 'present', 6: 'absent' }, savedBy: 'Carlos Andrade Santos', savedAt: '2026-03-19T10:45:00' },
];

const EXCUSE_STORAGE_KEY = 'schoolerp_excuse_requests';

function loadExcuseRequests() {
  try {
    const raw = localStorage.getItem(EXCUSE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveExcuseRequests(data) {
  localStorage.setItem(EXCUSE_STORAGE_KEY, JSON.stringify(data));
}

const heatmapColors = {
  present: 'bg-green-400', late: 'bg-amber-400', absent: 'bg-red-400', excused: 'bg-blue-400', none: 'bg-muted',
};

function getInitials(student) {
  return ((student.firstName?.[0] || '') + (student.lastName?.[0] || '')).toUpperCase();
}
function statusPriority(status) {
  const map = { absent: 3, late: 2, excused: 1, present: 0 };
  return map[status] ?? -1;
}
function computeCounts(records) {
  const counts = { present: 0, late: 0, absent: 0, excused: 0 };
  Object.values(records).forEach((s) => { if (counts[s] !== undefined) counts[s]++; });
  return counts;
}
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function currentMonthStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

export default function Attendance() {
  const { sectionNames: sectionOptions, subjects: subjectOptions, sectionGradeMap } = useSchoolConfig();
  const { isReadOnly: checkReadOnly, user } = useAuth();
  const { addNotification, notifications } = useNotifications();
  const readOnly = checkReadOnly('attendance');
  const [attendanceHistory, setAttendanceHistory] = useState(initialAttendanceHistory);
  const [excuseRequests, setExcuseRequests] = useState(loadExcuseRequests);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedSection, setSelectedSection] = useState('Rizal');
  const [selectedSubject, setSelectedSubject] = useState('Filipino');
  const [currentRecords, setCurrentRecords] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeView, setActiveView] = useState('daily');
  const [isQrMode, setIsQrMode] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [heatmapMonth, setHeatmapMonth] = useState(currentMonthStr());
  const [heatmapSection, setHeatmapSection] = useState('Rizal');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historySection, setHistorySection] = useState('');
  const [historySubject, setHistorySubject] = useState('');

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 800); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!lastScanned) return; const t = setTimeout(() => setLastScanned(null), 3000); return () => clearTimeout(t); }, [lastScanned]);

  useEffect(() => {
    const existing = attendanceHistory.find(
      (r) => r.date === selectedDate && r.section === selectedSection && r.subject === selectedSubject
    );
    setCurrentRecords(existing ? { ...existing.records } : {});
    setHasUnsavedChanges(false);
  }, [selectedDate, selectedSection, selectedSubject, attendanceHistory]);

  const sectionStudents = useMemo(
    () => classRoster.filter((s) => s.section === selectedSection && s.status === 'Active'),
    [selectedSection]
  );

  const summaryCounts = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0, excused: 0, unmarked: 0 };
    sectionStudents.forEach((s) => {
      const status = currentRecords[s.id];
      if (status && counts[status] !== undefined) counts[status]++;
      else counts.unmarked++;
    });
    return counts;
  }, [sectionStudents, currentRecords]);

  const daysInMonth = useMemo(() => {
    if (!heatmapMonth) return [];
    const [y, m] = heatmapMonth.split('-').map(Number);
    const count = new Date(y, m, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [heatmapMonth]);

  const heatmapStudents = useMemo(
    () => classRoster.filter((s) => s.section === heatmapSection && s.status === 'Active'),
    [heatmapSection]
  );

  const heatmapData = useMemo(() => {
    if (!heatmapMonth) return {};
    const data = {};
    heatmapStudents.forEach((s) => { data[s.id] = {}; });
    attendanceHistory
      .filter((r) => r.date.startsWith(heatmapMonth) && r.section === heatmapSection)
      .forEach((r) => {
        const day = parseInt(r.date.split('-')[2], 10);
        Object.entries(r.records).forEach(([sid, status]) => {
          const id = Number(sid);
          if (!data[id]) return;
          const existing = data[id][day];
          if (!existing || statusPriority(status) > statusPriority(existing)) {
            data[id][day] = status;
          }
        });
      });
    return data;
  }, [heatmapMonth, heatmapSection, heatmapStudents, attendanceHistory]);

  const filteredHistory = useMemo(() => {
    return attendanceHistory.filter((r) => {
      if (historyDateFrom && r.date < historyDateFrom) return false;
      if (historyDateTo && r.date > historyDateTo) return false;
      if (historySection && r.section !== historySection) return false;
      if (historySubject && r.subject !== historySubject) return false;
      return true;
    });
  }, [attendanceHistory, historyDateFrom, historyDateTo, historySection, historySubject]);

  // --- Cumulative absence count ---
  function getCumulativeAbsences(studentId) {
    let count = 0;
    attendanceHistory.forEach(r => {
      if (r.records[studentId] === 'absent') count++;
    });
    return count;
  }

  // --- Notify parents and admin on absences ---
  function notifyAbsences(records, date, section, subject) {
    const absentIds = Object.entries(records)
      .filter(([, status]) => status === 'absent')
      .map(([id]) => Number(id));

    absentIds.forEach(studentId => {
      const student = classRoster.find(s => s.id === studentId);
      if (!student) return;
      const studentName = `${student.firstName} ${student.lastName}`;

      // Find parent user with this student's id in childIds
      const parentUser = MOCK_USERS.find(u => u.role === 'parent' && u.childIds?.includes(studentId));
      if (parentUser) {
        addNotification({
          recipientKey: `parent_${parentUser.id}`,
          type: 'absence_alert',
          title: `Absence Alert: ${studentName}`,
          message: `${studentName} was marked absent in ${subject} (${section}) on ${formatDate(date)}.`,
          data: { studentId, studentName, date, section, subject },
        });
      }

      // Check cumulative absences (including this new one)
      const totalAbsences = getCumulativeAbsences(studentId) + 1;
      if (totalAbsences >= 3) {
        // Notify admin, principal, counselor
        ['admin', 'principal', 'counselor'].forEach(role => {
          const roleUser = MOCK_USERS.find(u => u.role === role);
          if (roleUser) {
            addNotification({
              recipientKey: `${role}_${roleUser.id}`,
              type: 'absence_threshold',
              title: `Attendance Alert: ${studentName}`,
              message: `${studentName} has accumulated ${totalAbsences} absences. Intervention may be needed.`,
              data: { studentId, studentName, totalAbsences },
            });
          }
        });
      }
    });
  }

  function handleMarkStatus(studentId, status) {
    setCurrentRecords((prev) => {
      if (prev[studentId] === status) {
        const next = { ...prev };
        delete next[studentId];
        return next;
      }
      return { ...prev, [studentId]: status };
    });
    setHasUnsavedChanges(true);
  }

  function handleMarkAll(status) {
    const next = {};
    sectionStudents.forEach((s) => { next[s.id] = status; });
    setCurrentRecords(next);
    setHasUnsavedChanges(true);
  }

  function handleResetRecords() {
    const existing = attendanceHistory.find(
      (r) => r.date === selectedDate && r.section === selectedSection && r.subject === selectedSubject
    );
    setCurrentRecords(existing ? { ...existing.records } : {});
    setHasUnsavedChanges(false);
  }

  function handleQrScan() {
    const lrn = qrInput.trim();
    if (!lrn) return;
    const student = sectionStudents.find((s) => s.lrn === lrn);
    if (!student) {
      setToast({ message: `LRN "${lrn}" not found in ${selectedSection} section`, type: 'error' });
      setQrInput('');
      return;
    }
    setCurrentRecords((prev) => ({ ...prev, [student.id]: 'present' }));
    setHasUnsavedChanges(true);
    setLastScanned({ studentId: student.id, name: `${student.firstName} ${student.lastName}`, timestamp: new Date().toLocaleTimeString() });
    setToast({ message: `${student.firstName} ${student.lastName} marked present`, type: 'success' });
    setQrInput('');
  }

  function handleSaveAttendance() {
    const existingIdx = attendanceHistory.findIndex(
      (r) => r.date === selectedDate && r.section === selectedSection && r.subject === selectedSubject
    );
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Current User';
    if (existingIdx >= 0) {
      setAttendanceHistory((prev) => {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], records: { ...currentRecords }, savedBy: userName, savedAt: new Date().toISOString() };
        return updated;
      });
    } else {
      const newRecord = {
        id: attendanceHistory.length + 1,
        date: selectedDate,
        section: selectedSection,
        subject: selectedSubject,
        records: { ...currentRecords },
        savedBy: userName,
        savedAt: new Date().toISOString(),
      };
      setAttendanceHistory((prev) => [...prev, newRecord]);
    }

    // Auto-notify parents about absences
    notifyAbsences(currentRecords, selectedDate, selectedSection, selectedSubject);

    setHasUnsavedChanges(false);
    setShowSaveConfirm(false);
    setToast({ message: 'Attendance saved successfully!', type: 'success' });
  }

  function handleLoadRecord(record) {
    setSelectedDate(record.date);
    setSelectedSection(record.section);
    setSelectedSubject(record.subject);
    setActiveView('daily');
  }

  function getStudentDayStatus(studentId, day) {
    return heatmapData[studentId]?.[day] || null;
  }

  function getStudentMonthRate(studentId) {
    const data = heatmapData[studentId];
    if (!data) return null;
    const entries = Object.values(data);
    if (entries.length === 0) return null;
    const presentCount = entries.filter((s) => s === 'present' || s === 'late').length;
    return Math.round((presentCount / entries.length) * 100);
  }

  // --- Excuse request handlers ---
  const pendingExcuses = excuseRequests.filter(e => e.status === 'pending');

  function handleApproveExcuse(excuseId) {
    const excuse = excuseRequests.find(e => e.id === excuseId);
    if (!excuse) return;

    // Update excuse status
    const updated = excuseRequests.map(e => e.id === excuseId ? { ...e, status: 'approved' } : e);
    setExcuseRequests(updated);
    saveExcuseRequests(updated);

    // Update attendance record to 'excused'
    setAttendanceHistory(prev => prev.map(r => {
      if (r.date === excuse.date && r.section === excuse.section && r.subject === excuse.subject) {
        return { ...r, records: { ...r.records, [excuse.studentId]: 'excused' } };
      }
      return r;
    }));

    // Notify the parent
    if (excuse.parentUserId) {
      addNotification({
        recipientKey: `parent_${excuse.parentUserId}`,
        type: 'excuse_response',
        title: 'Excuse Approved',
        message: `The excuse for ${excuse.studentName} on ${formatDate(excuse.date)} has been approved.`,
        data: { excuseId },
      });
    }

    setToast({ message: 'Excuse approved — record updated to "excused"', type: 'success' });
  }

  function handleDenyExcuse(excuseId) {
    const excuse = excuseRequests.find(e => e.id === excuseId);
    if (!excuse) return;

    const updated = excuseRequests.map(e => e.id === excuseId ? { ...e, status: 'denied' } : e);
    setExcuseRequests(updated);
    saveExcuseRequests(updated);

    if (excuse.parentUserId) {
      addNotification({
        recipientKey: `parent_${excuse.parentUserId}`,
        type: 'excuse_response',
        title: 'Excuse Denied',
        message: `The excuse for ${excuse.studentName} on ${formatDate(excuse.date)} was not approved.`,
        data: { excuseId },
      });
    }

    setToast({ message: 'Excuse denied', type: 'error' });
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Card><CardContent className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12" />)}
        </CardContent></Card>
      </div>
    );
  }

  const statCards = [
    { label: 'Present', count: summaryCounts.present, icon: Check, bgClass: 'bg-green-50', borderClass: 'border-green-200', labelClass: 'text-green-600', countClass: 'text-green-700', iconBg: 'bg-green-100' },
    { label: 'Late', count: summaryCounts.late, icon: Clock, bgClass: 'bg-amber-50', borderClass: 'border-amber-200', labelClass: 'text-amber-600', countClass: 'text-amber-700', iconBg: 'bg-amber-100' },
    { label: 'Absent', count: summaryCounts.absent, icon: UserX, bgClass: 'bg-red-50', borderClass: 'border-red-200', labelClass: 'text-red-600', countClass: 'text-red-700', iconBg: 'bg-red-100' },
    { label: 'Excused', count: summaryCounts.excused, icon: ShieldCheck, bgClass: 'bg-blue-50', borderClass: 'border-blue-200', labelClass: 'text-blue-600', countClass: 'text-blue-700', iconBg: 'bg-blue-100' },
  ];

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Title + View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="daily">Daily Marking</TabsTrigger>
            <TabsTrigger value="heatmap">Calendar Heatmap</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            {isTeacherOrAdmin && (
              <TabsTrigger value="excuses" className="relative">
                Excuse Requests
                {pendingExcuses.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {pendingExcuses.length}
                  </span>
                )}
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      {/* === DAILY VIEW === */}
      {activeView === 'daily' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={cn(stat.bgClass, stat.borderClass)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className={cn('text-sm font-medium', stat.labelClass)}>{stat.label}</p>
                      <div className={cn('h-8 w-8 rounded-full flex items-center justify-center', stat.iconBg)}>
                        <Icon className={cn('h-4 w-4', stat.labelClass)} />
                      </div>
                    </div>
                    <p className={cn('text-2xl font-bold mt-1', stat.countClass)}>{stat.count}</p>
                    <p className="text-xs text-muted-foreground mt-1">of {sectionStudents.length} students</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-auto" />
            <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-auto">
              {sectionOptions.map((s) => <option key={s} value={s}>{sectionGradeMap[s]} - {s}</option>)}
            </Select>
            <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-auto">
              {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Button variant={isQrMode ? 'default' : 'outline'} onClick={() => setIsQrMode(!isQrMode)} className="gap-2">
              <QrCode className="h-4 w-4" />QR Scan
            </Button>
          </div>

          {isQrMode && (
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center">
                <Camera className="h-10 w-10 mx-auto mb-3 text-primary/60" />
                <p className="text-primary font-medium mb-4">Scan QR Code or type LRN below</p>
                <div className="max-w-sm mx-auto flex gap-2">
                  <Input type="text" value={qrInput} onChange={(e) => setQrInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleQrScan()} placeholder="Enter LRN..." className="flex-1 text-lg font-mono text-center" />
                  <Button onClick={handleQrScan}>Scan</Button>
                </div>
                {lastScanned && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg animate-pulse">
                    <Check className="h-5 w-5" /><span className="font-medium">{lastScanned.name}</span>
                    <span className="text-sm">-- marked present at {lastScanned.timestamp}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!isQrMode && (
            <>
              {sectionStudents.length === 0 ? (
                <Card><CardContent className="p-12 text-center">
                  <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
                  <p className="text-muted-foreground font-medium">No active students in this section</p>
                </CardContent></Card>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')} className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:text-green-800">All Present</Button>
                    <Button variant="outline" size="sm" onClick={() => handleMarkAll('late')} className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 hover:text-amber-800">All Late</Button>
                    <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')} className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200 hover:text-red-800">All Absent</Button>
                  </div>
                  <Card>
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>LRN</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionStudents.map((student, idx) => {
                          const current = currentRecords[student.id];
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{getInitials(student)}</AvatarFallback></Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{student.lastName}, {student.firstName} {student.middleName?.[0]}.</p>
                                    <p className="text-xs text-muted-foreground">{student.gradeLevel}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground font-mono">{student.lrn}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-1">
                                  {[
                                    { key: 'present', letter: 'P', full: 'Present', activeClass: 'bg-green-500 text-white hover:bg-green-600 border-green-500', hoverClass: 'hover:border-green-400 hover:text-green-600' },
                                    { key: 'late', letter: 'L', full: 'Late', activeClass: 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500', hoverClass: 'hover:border-amber-400 hover:text-amber-600' },
                                    { key: 'absent', letter: 'A', full: 'Absent', activeClass: 'bg-red-500 text-white hover:bg-red-600 border-red-500', hoverClass: 'hover:border-red-400 hover:text-red-600' },
                                    { key: 'excused', letter: 'E', full: 'Excused', activeClass: 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500', hoverClass: 'hover:border-blue-400 hover:text-blue-600' },
                                  ].map((btn) => (
                                    <Button key={btn.key} variant="outline" size="sm" onClick={() => handleMarkStatus(student.id, btn.key)}
                                      className={cn('px-2 sm:px-3 h-8 text-xs sm:text-sm', current === btn.key ? btn.activeClass : cn('text-muted-foreground', btn.hoverClass))}>
                                      <span className="sm:hidden">{btn.letter}</span>
                                      <span className="hidden sm:inline">{btn.full}</span>
                                    </Button>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </>
              )}
            </>
          )}

          <Card>
            <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /><span className="text-sm text-amber-600 font-medium">Unsaved changes</span></>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleResetRecords} className="gap-2"><RotateCcw className="h-4 w-4" />Reset</Button>
                {!readOnly && (
                  <Button size="sm" onClick={() => setShowSaveConfirm(true)} disabled={!hasUnsavedChanges} className="gap-2">
                    <Save className="h-4 w-4" />Save Attendance
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* === HEATMAP VIEW === */}
      {activeView === 'heatmap' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input type="month" value={heatmapMonth} onChange={(e) => setHeatmapMonth(e.target.value)} className="w-auto" />
            <Select value={heatmapSection} onChange={(e) => setHeatmapSection(e.target.value)} className="w-auto">
              {sectionOptions.map((s) => <option key={s} value={s}>{sectionGradeMap[s]} - {s}</option>)}
            </Select>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {[{ label: 'Present', color: 'bg-green-400' }, { label: 'Late', color: 'bg-amber-400' }, { label: 'Absent', color: 'bg-red-400' }, { label: 'Excused', color: 'bg-blue-400' }, { label: 'No Data', color: 'bg-muted' }].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={cn('w-4 h-4 rounded', item.color)} /><span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          {heatmapStudents.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" /><p className="text-muted-foreground font-medium">No active students in this section</p></CardContent></Card>
          ) : daysInMonth.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><p className="text-muted-foreground font-medium">Select a month to view the heatmap</p></CardContent></Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 sticky left-0 bg-muted/50 z-10 min-w-[140px]">Student</th>
                      {daysInMonth.map((d) => <th key={d} className="text-center text-xs font-semibold text-muted-foreground/60 px-0.5 py-2 w-6">{d}</th>)}
                      <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 min-w-[60px]">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapStudents.map((student) => {
                      const rate = getStudentMonthRate(student.id);
                      return (
                        <tr key={student.id} className="border-b border-border/50">
                          <td className="px-3 py-2 text-sm font-medium text-foreground sticky left-0 bg-card z-10 whitespace-nowrap">{student.lastName}, {student.firstName?.[0]}.</td>
                          {daysInMonth.map((day) => {
                            const status = getStudentDayStatus(student.id, day);
                            return (
                              <td key={day} className="px-0.5 py-2 text-center">
                                <div className={cn('w-5 h-5 rounded mx-auto', status ? heatmapColors[status] : heatmapColors.none)} title={status ? `Day ${day}: ${status}` : `Day ${day}: No data`} />
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 text-center">
                            {rate !== null ? (
                              <Badge variant="outline" className={cn('font-bold', rate >= 85 ? 'border-green-300 text-green-600 bg-green-50' : rate >= 70 ? 'border-amber-300 text-amber-600 bg-amber-50' : 'border-red-300 text-red-600 bg-red-50')}>{rate}%</Badge>
                            ) : <span className="text-xs text-muted-foreground">--</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* === HISTORY VIEW === */}
      {activeView === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2"><Label className="text-muted-foreground whitespace-nowrap">From:</Label><Input type="date" value={historyDateFrom} onChange={(e) => setHistoryDateFrom(e.target.value)} className="w-auto" /></div>
            <div className="flex items-center gap-2"><Label className="text-muted-foreground whitespace-nowrap">To:</Label><Input type="date" value={historyDateTo} onChange={(e) => setHistoryDateTo(e.target.value)} className="w-auto" /></div>
            <Select value={historySection} onChange={(e) => setHistorySection(e.target.value)} className="w-auto">
              <option value="">All Sections</option>
              {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select value={historySubject} onChange={(e) => setHistorySubject(e.target.value)} className="w-auto">
              <option value="">All Subjects</option>
              {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          {filteredHistory.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><AlertCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" /><p className="text-muted-foreground font-medium">No attendance records found</p></CardContent></Card>
          ) : (
            <Card>
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead><TableHead>Section</TableHead><TableHead>Subject</TableHead>
                    <TableHead className="text-center">Present</TableHead><TableHead className="text-center">Late</TableHead>
                    <TableHead className="text-center">Absent</TableHead><TableHead className="text-center">Excused</TableHead>
                    <TableHead>Saved By</TableHead><TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => {
                    const counts = computeCounts(record.records);
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                        <TableCell className="text-muted-foreground">{sectionGradeMap[record.section]} - {record.section}</TableCell>
                        <TableCell className="text-muted-foreground">{record.subject}</TableCell>
                        <TableCell className="text-center"><Badge className="bg-green-100 text-green-700 border-0">{counts.present}</Badge></TableCell>
                        <TableCell className="text-center"><Badge className="bg-amber-100 text-amber-700 border-0">{counts.late}</Badge></TableCell>
                        <TableCell className="text-center"><Badge className="bg-red-100 text-red-700 border-0">{counts.absent}</Badge></TableCell>
                        <TableCell className="text-center"><Badge className="bg-blue-100 text-blue-700 border-0">{counts.excused}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{record.savedBy}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleLoadRecord(record)} className="gap-1.5 text-primary hover:text-primary">
                            <Pencil className="h-3.5 w-3.5" />Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      {/* === EXCUSE REQUESTS VIEW === */}
      {activeView === 'excuses' && isTeacherOrAdmin && (
        <div className="space-y-4">
          {excuseRequests.length === 0 ? (
            <Card><CardContent className="p-12 text-center">
              <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
              <p className="text-muted-foreground font-medium">No excuse requests yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Parents can submit excuses from their dashboard</p>
            </CardContent></Card>
          ) : (
            <Card>
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Student</TableHead><TableHead>Date</TableHead><TableHead>Section</TableHead>
                    <TableHead>Subject</TableHead><TableHead>Reason</TableHead><TableHead>Note</TableHead>
                    <TableHead className="text-center">Status</TableHead><TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {excuseRequests.map((excuse) => (
                    <TableRow key={excuse.id}>
                      <TableCell className="font-medium">{excuse.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(excuse.date)}</TableCell>
                      <TableCell className="text-muted-foreground">{excuse.section}</TableCell>
                      <TableCell className="text-muted-foreground">{excuse.subject}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{excuse.reason}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-xs max-w-[150px] truncate">{excuse.note || '--'}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn('text-xs', excuse.status === 'pending' ? 'bg-amber-100 text-amber-700 border-0' : excuse.status === 'approved' ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0')}>
                          {excuse.status === 'pending' ? 'Pending' : excuse.status === 'approved' ? 'Approved' : 'Denied'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {excuse.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleApproveExcuse(excuse.id)} className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50">
                              <CheckCircle className="h-3.5 w-3.5" />Approve
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDenyExcuse(excuse.id)} className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <XCircle className="h-3.5 w-3.5" />Deny
                            </Button>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">--</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      {/* Save Confirmation Modal */}
      <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
            <DialogDescription>Review the attendance details before saving.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Date:</span> {formatDate(selectedDate)}</p>
            <p><span className="font-medium text-foreground">Section:</span> {sectionGradeMap[selectedSection]} - {selectedSection}</p>
            <p><span className="font-medium text-foreground">Subject:</span> {selectedSubject}</p>
            <p><span className="font-medium text-foreground">Students:</span> {Object.keys(currentRecords).length} marked</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowSaveConfirm(false)}>Cancel</Button>
            <Button onClick={handleSaveAttendance}><Save className="h-4 w-4 mr-2" />Confirm Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Card className={cn('flex items-center gap-3 px-4 py-3 shadow-lg',
            toast.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800')}>
            {toast.type === 'success' ? <Check className="h-5 w-5 text-green-500 flex-shrink-0" /> : <X className="h-5 w-5 text-red-500 flex-shrink-0" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
