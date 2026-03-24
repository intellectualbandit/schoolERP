import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClipboardList, Plus, Search, Filter, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, Users, Sparkles, Calendar, Clock,
  ThumbsUp, ThumbsDown, Minus, ChevronRight, Award, BarChart3,
  Eye, FileText, Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolConfig } from '../contexts/SchoolConfigContext';

// ============================================================
// CONSTANTS
// ============================================================

// SECTIONS from SchoolConfigContext (sectionLabels)

const INCIDENT_TYPES = {
  Positive: { bg: 'bg-emerald-100', text: 'text-emerald-700', fill: 'bg-emerald-500', dot: 'bg-emerald-400', border: 'border-emerald-200', icon: ThumbsUp, label: 'Positive' },
  Negative: { bg: 'bg-rose-100', text: 'text-rose-700', fill: 'bg-rose-500', dot: 'bg-rose-400', border: 'border-rose-200', icon: ThumbsDown, label: 'Negative' },
  Neutral: { bg: 'bg-sky-100', text: 'text-sky-700', fill: 'bg-sky-500', dot: 'bg-sky-400', border: 'border-sky-200', icon: Minus, label: 'Neutral' },
};

const CATEGORIES = {
  Negative: ['Tardiness', 'Disruptive Behavior', 'Bullying', 'Academic Dishonesty', 'Vandalism', 'Defiance'],
  Positive: ['Academic Excellence', 'Leadership', 'Helpfulness', 'Perfect Attendance', 'Community Service', 'Sports Achievement'],
  Neutral: ['Parent Conference', 'Counselor Referral', 'Transfer Note', 'Schedule Change'],
};

const ALL_CATEGORIES = [...CATEGORIES.Positive, ...CATEGORIES.Negative, ...CATEGORIES.Neutral];

// ============================================================
// STUDENT ROSTER
// ============================================================

const STUDENTS = [
  { id: 1, firstName: 'Juan', lastName: 'Dela Cruz', section: 'Rizal', gradeLevel: 'Grade 7' },
  { id: 2, firstName: 'Maria', lastName: 'Santos', section: 'Bonifacio', gradeLevel: 'Grade 8' },
  { id: 3, firstName: 'Andres', lastName: 'Bautista', section: 'Mabini', gradeLevel: 'Grade 9' },
  { id: 4, firstName: 'Sofia', lastName: 'Garcia', section: 'Rizal', gradeLevel: 'Grade 7' },
  { id: 5, firstName: 'Carlos', lastName: 'Reyes', section: 'Aguinaldo', gradeLevel: 'Grade 10' },
  { id: 6, firstName: 'Angela', lastName: 'Fernandez', section: 'Bonifacio', gradeLevel: 'Grade 8' },
  { id: 7, firstName: 'Miguel', lastName: 'Ramos', section: 'Mabini', gradeLevel: 'Grade 9' },
  { id: 8, firstName: 'Patricia', lastName: 'Villanueva', section: 'Rizal', gradeLevel: 'Grade 7' },
  { id: 9, firstName: 'Gabriel', lastName: 'Navarro', section: 'Aguinaldo', gradeLevel: 'Grade 10' },
  { id: 10, firstName: 'Isabelle', lastName: 'Morales', section: 'Bonifacio', gradeLevel: 'Grade 8' },
  { id: 11, firstName: 'Rafael', lastName: 'Mendoza', section: 'Mabini', gradeLevel: 'Grade 9' },
  { id: 12, firstName: 'Camille', lastName: 'Aquino', section: 'Rizal', gradeLevel: 'Grade 7' },
  { id: 13, firstName: 'Marco', lastName: 'Bautista', section: 'Aguinaldo', gradeLevel: 'Grade 10' },
  { id: 14, firstName: 'Hannah', lastName: 'Lim', section: 'Bonifacio', gradeLevel: 'Grade 8' },
  { id: 15, firstName: 'Jerico', lastName: 'Santos', section: 'Mabini', gradeLevel: 'Grade 9' },
  { id: 16, firstName: 'Andrea', lastName: 'Tan', section: 'Aguinaldo', gradeLevel: 'Grade 10' },
];

// ============================================================
// MOCK INCIDENTS
// ============================================================

const initialIncidents = [
  // Andres Bautista - 4 negative incidents (AI alert trigger)
  { id: 1, studentId: 3, type: 'Negative', category: 'Tardiness', description: 'Arrived 15 minutes late to first period.', actionTaken: 'Verbal warning given. Parent notified via text.', date: '2026-03-03', loggedBy: 'Mr. Reyes' },
  { id: 2, studentId: 3, type: 'Negative', category: 'Disruptive Behavior', description: 'Disrupted class by talking loudly during a quiz. Refused to stop when asked.', actionTaken: 'Sent to guidance office. Reflective essay assigned.', date: '2026-03-10', loggedBy: 'Mrs. Gonzales' },
  { id: 3, studentId: 3, type: 'Negative', category: 'Defiance', description: 'Refused to submit phone during class hours despite repeated requests.', actionTaken: 'Phone confiscated. Parent conference scheduled.', date: '2026-03-17', loggedBy: 'Mr. Reyes' },
  { id: 4, studentId: 3, type: 'Negative', category: 'Tardiness', description: 'Late to afternoon classes for the third time this month.', actionTaken: 'Written warning issued. Detention assigned.', date: '2026-03-21', loggedBy: 'Mrs. Lim' },

  // Carlos Reyes - 3 negative incidents (AI alert trigger)
  { id: 5, studentId: 5, type: 'Negative', category: 'Bullying', description: 'Reported by multiple classmates for verbal bullying during recess.', actionTaken: 'Counselor session scheduled. Anti-bullying module assigned.', date: '2026-03-05', loggedBy: 'Mrs. Gonzales' },
  { id: 6, studentId: 5, type: 'Negative', category: 'Disruptive Behavior', description: 'Threw paper balls at other students during study period.', actionTaken: 'Written warning. Community service assigned.', date: '2026-03-14', loggedBy: 'Mr. Santos' },
  { id: 7, studentId: 5, type: 'Negative', category: 'Vandalism', description: 'Wrote on classroom desk with permanent marker.', actionTaken: 'Required to clean desk. Parent notified.', date: '2026-03-20', loggedBy: 'Mr. Santos' },

  // Positive incidents
  { id: 8, studentId: 2, type: 'Positive', category: 'Academic Excellence', description: 'Achieved highest score in the quarterly Science exam.', actionTaken: 'Certificate of recognition to be awarded at assembly.', date: '2026-03-07', loggedBy: 'Mrs. Gonzales' },
  { id: 9, studentId: 4, type: 'Positive', category: 'Leadership', description: 'Organized a successful peer tutoring session for struggling classmates.', actionTaken: 'Commendation letter sent to parents.', date: '2026-03-12', loggedBy: 'Mr. Reyes' },
  { id: 10, studentId: 8, type: 'Positive', category: 'Helpfulness', description: 'Volunteered to help clean and organize the school library after hours.', actionTaken: 'Noted in student record. Verbal commendation.', date: '2026-03-08', loggedBy: 'Mrs. Lim' },
  { id: 11, studentId: 1, type: 'Positive', category: 'Perfect Attendance', description: 'Achieved perfect attendance for the entire quarter with no tardiness.', actionTaken: 'Perfect Attendance certificate to be given.', date: '2026-03-22', loggedBy: 'Mr. Reyes' },
  { id: 12, studentId: 10, type: 'Positive', category: 'Community Service', description: 'Led the Brigada Eskwela cleanup drive for the school grounds.', actionTaken: 'Featured in school newsletter. Commendation letter.', date: '2026-03-15', loggedBy: 'Mrs. Gonzales' },
  { id: 13, studentId: 9, type: 'Positive', category: 'Sports Achievement', description: 'Won gold medal in Division Meet swimming competition.', actionTaken: 'Recognized at flag ceremony. Trophy displayed.', date: '2026-03-18', loggedBy: 'Mr. Santos' },
  { id: 14, studentId: 12, type: 'Positive', category: 'Leadership', description: 'Elected class president and immediately organized a reading program.', actionTaken: 'Commendation letter. Leadership award nomination.', date: '2026-03-06', loggedBy: 'Mrs. Lim' },

  // More negative incidents for other students
  { id: 15, studentId: 7, type: 'Negative', category: 'Academic Dishonesty', description: 'Caught using phone to look up answers during a seatwork exercise.', actionTaken: 'Zero on the seatwork. Parent notification sent.', date: '2026-03-11', loggedBy: 'Mr. Reyes' },
  { id: 16, studentId: 6, type: 'Negative', category: 'Tardiness', description: 'Late to class for the second time this week.', actionTaken: 'Verbal warning. Tardiness slip issued.', date: '2026-03-19', loggedBy: 'Mrs. Gonzales' },
  { id: 17, studentId: 11, type: 'Negative', category: 'Disruptive Behavior', description: 'Playing music without headphones during independent study.', actionTaken: 'Device confiscated for the day. Verbal warning.', date: '2026-03-13', loggedBy: 'Mrs. Lim' },

  // Neutral incidents
  { id: 18, studentId: 3, type: 'Neutral', category: 'Parent Conference', description: 'Parent-teacher conference held to discuss academic performance and recent behavior issues.', actionTaken: 'Behavior contract signed. Weekly progress reports agreed upon.', date: '2026-03-22', loggedBy: 'Mrs. Gonzales' },
  { id: 19, studentId: 5, type: 'Neutral', category: 'Counselor Referral', description: 'Referred to school counselor for anger management support.', actionTaken: 'Weekly counseling sessions scheduled for 4 weeks.', date: '2026-03-21', loggedBy: 'Mrs. Gonzales' },
  { id: 20, studentId: 14, type: 'Neutral', category: 'Transfer Note', description: 'Transfer documents received from previous school. Records being processed.', actionTaken: 'Filed in student records. Section assignment pending.', date: '2026-03-04', loggedBy: 'Admin Office' },
  { id: 21, studentId: 15, type: 'Neutral', category: 'Schedule Change', description: 'Requested schedule change due to conflict with remedial classes.', actionTaken: 'New schedule approved. Updated in system.', date: '2026-03-09', loggedBy: 'Mr. Santos' },
  { id: 22, studentId: 13, type: 'Positive', category: 'Helpfulness', description: 'Assisted a new transfer student with orientation and campus tour.', actionTaken: 'Noted in student record. Verbal praise given.', date: '2026-03-16', loggedBy: 'Mrs. Lim' },

  // Rafael Mendoza - 3 negative (AI alert trigger)
  { id: 23, studentId: 11, type: 'Negative', category: 'Tardiness', description: 'Late arrival to school for the fourth time this month.', actionTaken: 'Parent called. Detention issued.', date: '2026-03-05', loggedBy: 'Mr. Santos' },
  { id: 24, studentId: 11, type: 'Negative', category: 'Defiance', description: 'Refused to participate in group activity, walked out of classroom.', actionTaken: 'Sent to principal. Counselor session mandated.', date: '2026-03-18', loggedBy: 'Mr. Reyes' },
];

// ============================================================
// HELPERS
// ============================================================

const getInitials = (firstName, lastName) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`;

const getStudentName = (student) => `${student.firstName} ${student.lastName}`;

const getStudentById = (id) => STUDENTS.find((s) => s.id === id);

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateShort = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isWithinLast30Days = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diff = now - date;
  return diff <= 30 * 24 * 60 * 60 * 1000;
};

const defaultFormState = {
  studentId: '',
  type: '',
  category: '',
  description: '',
  actionTaken: '',
  date: new Date().toISOString().split('T')[0],
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Behavior() {
  const { sectionLabels: SECTIONS } = useSchoolConfig();
  const { isReadOnly: checkReadOnly } = useAuth();
  const readOnly = checkReadOnly('behavior');
  const [incidents, setIncidents] = useState(initialIncidents);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [formData, setFormData] = useState(defaultFormState);
  const [formErrors, setFormErrors] = useState({});

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

  // ---- Derived data ----

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        const student = getStudentById(inc.studentId);
        if (!student) return false;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          getStudentName(student).toLowerCase().includes(q) ||
          inc.category.toLowerCase().includes(q) ||
          inc.description.toLowerCase().includes(q);
        const matchesType = !filterType || inc.type === filterType;
        const matchesCategory = !filterCategory || inc.category === filterCategory;
        const matchesSection = !filterSection || student.section === filterSection;
        const matchesDateFrom = !filterDateFrom || inc.date >= filterDateFrom;
        const matchesDateTo = !filterDateTo || inc.date <= filterDateTo;
        return matchesSearch && matchesType && matchesCategory && matchesSection && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [incidents, searchQuery, filterType, filterCategory, filterSection, filterDateFrom, filterDateTo]);

  const studentIncidentMap = useMemo(() => {
    const map = {};
    incidents.forEach((inc) => {
      if (!map[inc.studentId]) map[inc.studentId] = [];
      map[inc.studentId].push(inc);
    });
    return map;
  }, [incidents]);

  const flaggedStudents = useMemo(() => {
    return STUDENTS.filter((student) => {
      const studentIncidents = studentIncidentMap[student.id] || [];
      const recentNegative = studentIncidents.filter(
        (inc) => inc.type === 'Negative' && isWithinLast30Days(inc.date)
      );
      return recentNegative.length >= 3;
    });
  }, [studentIncidentMap]);

  const stats = useMemo(() => {
    const total = incidents.length;
    const positive = incidents.filter((i) => i.type === 'Positive').length;
    const negative = incidents.filter((i) => i.type === 'Negative').length;
    const neutral = incidents.filter((i) => i.type === 'Neutral').length;
    return { total, positive, negative, neutral, flagged: flaggedStudents.length };
  }, [incidents, flaggedStudents]);

  const sectionSummary = useMemo(() => {
    return SECTIONS.map((section) => {
      const sectionStudentIds = STUDENTS.filter((s) => s.section === section.id).map((s) => s.id);
      const sectionIncidents = incidents.filter((inc) => sectionStudentIds.includes(inc.studentId));
      const positive = sectionIncidents.filter((i) => i.type === 'Positive').length;
      const negative = sectionIncidents.filter((i) => i.type === 'Negative').length;
      const neutral = sectionIncidents.filter((i) => i.type === 'Neutral').length;
      const total = sectionIncidents.length;
      return { ...section, positive, negative, neutral, total };
    });
  }, [incidents]);

  // Students with incident counts for "By Student" tab
  const studentSummaries = useMemo(() => {
    return STUDENTS.map((student) => {
      const studentIncidents = studentIncidentMap[student.id] || [];
      const positive = studentIncidents.filter((i) => i.type === 'Positive').length;
      const negative = studentIncidents.filter((i) => i.type === 'Negative').length;
      const neutral = studentIncidents.filter((i) => i.type === 'Neutral').length;
      const total = studentIncidents.length;
      const isFlagged = flaggedStudents.some((f) => f.id === student.id);
      const lastIncident = studentIncidents.sort((a, b) => b.date.localeCompare(a.date))[0];
      return { ...student, positive, negative, neutral, total, isFlagged, lastIncident };
    })
      .filter((s) => {
        if (!filterSection || s.section === filterSection) {
          const q = searchQuery.toLowerCase();
          return !q || getStudentName(s).toLowerCase().includes(q);
        }
        return false;
      })
      .sort((a, b) => {
        if (a.isFlagged !== b.isFlagged) return a.isFlagged ? -1 : 1;
        return b.total - a.total;
      });
  }, [studentIncidentMap, flaggedStudents, filterSection, searchQuery]);

  // ---- Handlers ----

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Reset category when type changes
      if (field === 'type') next.category = '';
      return next;
    });
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleLogIncident = useCallback(() => {
    const errors = {};
    if (!formData.studentId) errors.studentId = 'Select a student';
    if (!formData.type) errors.type = 'Select incident type';
    if (!formData.category) errors.category = 'Select a category';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newIncident = {
      id: Date.now(),
      studentId: parseInt(formData.studentId),
      type: formData.type,
      category: formData.category,
      description: formData.description.trim(),
      actionTaken: formData.actionTaken.trim(),
      date: formData.date,
      loggedBy: 'Current User',
    };

    setIncidents((prev) => [...prev, newIncident]);
    setFormData(defaultFormState);
    setFormErrors({});
    setShowLogModal(false);

    const student = getStudentById(parseInt(formData.studentId));
    const typeLabel = formData.type === 'Positive' ? 'Commendation' : 'Incident';
    showToast(`${typeLabel} logged for ${getStudentName(student)}`);
  }, [formData, showToast]);

  const handleOpenLogModal = useCallback((presetType) => {
    setFormData({ ...defaultFormState, type: presetType || '' });
    setFormErrors({});
    setShowLogModal(true);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterType('');
    setFilterCategory('');
    setFilterSection('');
    setFilterDateFrom('');
    setFilterDateTo('');
  }, []);

  const hasActiveFilters = filterType || filterCategory || filterSection || filterDateFrom || filterDateTo;

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
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-80" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // ---- Render ----

  return (
    <div className="space-y-6">
      {/* ============ SUMMARY CARDS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <ThumbsUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Positive</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.positive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <ThumbsDown className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Negative</p>
                <p className="text-2xl font-bold text-rose-600">{stats.negative}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Sparkles className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Alerts</p>
                <p className="text-2xl font-bold text-violet-600">{stats.flagged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============ ACTIONS + FILTERS ============ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students, categories, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {!readOnly && (
            <>
              <Button onClick={() => handleOpenLogModal('Positive')} variant="outline" size="sm" className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <Award className="h-4 w-4" />
                Commend
              </Button>
              <Button onClick={() => handleOpenLogModal()} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Log Incident
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex gap-2 flex-wrap flex-1">
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-[140px]">
            <option value="">All Types</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Neutral">Neutral</option>
          </Select>
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-[180px]">
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          <Select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="w-[180px]">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>
          <Input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="w-[150px]"
            placeholder="From"
          />
          <Input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="w-[150px]"
            placeholder="To"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground shrink-0">
            Clear filters
          </Button>
        )}
      </div>

      {/* ============ MAIN TABS ============ */}
      <Tabs defaultValue="incidents">
        <TabsList>
          <TabsTrigger value="incidents" className="gap-1.5">
            <FileText className="h-4 w-4" /> All Incidents
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-1.5">
            <Users className="h-4 w-4" /> By Student
            {flaggedStudents.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                {flaggedStudents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Section Summary
          </TabsTrigger>
        </TabsList>

        {/* ======== TAB: ALL INCIDENTS ======== */}
        <TabsContent value="incidents" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filteredIncidents.length === 0 ? (
                <div className="py-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No incidents found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Student</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="w-[160px]">Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead className="w-[120px]">Logged By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIncidents.map((inc) => {
                        const student = getStudentById(inc.studentId);
                        if (!student) return null;
                        const typeStyle = INCIDENT_TYPES[inc.type];
                        const isFlagged = flaggedStudents.some((f) => f.id === student.id);
                        return (
                          <TableRow key={inc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewStudent(student)}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[10px] bg-muted">
                                    {getInitials(student.firstName, student.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate flex items-center gap-1.5">
                                    {getStudentName(student)}
                                    {isFlagged && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold animate-pulse">
                                            <Sparkles className="h-3 w-3" />
                                            AI Alert
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          3+ negative incidents in 30 days
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{student.section}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={cn(typeStyle.bg, typeStyle.text, 'border-0')}>
                                {inc.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{inc.category}</span>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-muted-foreground truncate max-w-[300px]">{inc.description}</p>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{formatDateShort(inc.date)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{inc.loggedBy}</span>
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

        {/* ======== TAB: BY STUDENT ======== */}
        <TabsContent value="students" className="space-y-4 mt-4">
          {studentSummaries.filter((s) => s.total > 0).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No students with incidents found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentSummaries
                .filter((s) => s.total > 0)
                .map((student) => (
                  <Card
                    key={student.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      student.isFlagged && 'border-l-4 border-l-violet-500'
                    )}
                    onClick={() => setViewStudent(student)}
                  >
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs bg-muted">
                              {getInitials(student.firstName, student.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm flex items-center gap-1.5">
                              {getStudentName(student)}
                              {student.isFlagged && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold animate-pulse">
                                  <Sparkles className="h-3 w-3" />
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{student.gradeLevel} - {student.section}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                      </div>

                      {/* Incident counts */}
                      <div className="flex gap-3 mb-3">
                        {student.positive > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-muted-foreground">{student.positive} positive</span>
                          </div>
                        )}
                        {student.negative > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="text-xs text-muted-foreground">{student.negative} negative</span>
                          </div>
                        )}
                        {student.neutral > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-sky-500" />
                            <span className="text-xs text-muted-foreground">{student.neutral} neutral</span>
                          </div>
                        )}
                      </div>

                      {/* Distribution bar */}
                      {student.total > 0 && (
                        <div className="flex h-2 rounded-full overflow-hidden">
                          {student.positive > 0 && (
                            <div className="bg-emerald-400 transition-all" style={{ width: `${(student.positive / student.total) * 100}%` }} />
                          )}
                          {student.negative > 0 && (
                            <div className="bg-rose-400 transition-all" style={{ width: `${(student.negative / student.total) * 100}%` }} />
                          )}
                          {student.neutral > 0 && (
                            <div className="bg-sky-400 transition-all" style={{ width: `${(student.neutral / student.total) * 100}%` }} />
                          )}
                        </div>
                      )}

                      {/* Last incident */}
                      {student.lastIncident && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last: {student.lastIncident.category} ({formatDateShort(student.lastIncident.date)})
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* ======== TAB: SECTION SUMMARY ======== */}
        <TabsContent value="sections" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionSummary.map((section) => (
              <Card key={section.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{section.label}</CardTitle>
                  <CardDescription>{section.total} total incident{section.total !== 1 ? 's' : ''}</CardDescription>
                </CardHeader>
                <CardContent>
                  {section.total === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No incidents recorded.</p>
                  ) : (
                    <>
                      {/* Distribution numbers */}
                      <div className="flex gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                          <div>
                            <p className="text-sm font-medium">{section.positive}</p>
                            <p className="text-xs text-muted-foreground">Positive</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-rose-500" />
                          <div>
                            <p className="text-sm font-medium">{section.negative}</p>
                            <p className="text-xs text-muted-foreground">Negative</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-sky-500" />
                          <div>
                            <p className="text-sm font-medium">{section.neutral}</p>
                            <p className="text-xs text-muted-foreground">Neutral</p>
                          </div>
                        </div>
                      </div>

                      {/* Distribution bar */}
                      <div className="flex h-3 rounded-full overflow-hidden">
                        {section.positive > 0 && (
                          <div
                            className="bg-emerald-400 transition-all duration-500"
                            style={{ width: `${(section.positive / section.total) * 100}%` }}
                          />
                        )}
                        {section.negative > 0 && (
                          <div
                            className="bg-rose-400 transition-all duration-500"
                            style={{ width: `${(section.negative / section.total) * 100}%` }}
                          />
                        )}
                        {section.neutral > 0 && (
                          <div
                            className="bg-sky-400 transition-all duration-500"
                            style={{ width: `${(section.neutral / section.total) * 100}%` }}
                          />
                        )}
                      </div>

                      {/* Percentage labels */}
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-emerald-600 font-medium">
                          {Math.round((section.positive / section.total) * 100)}%
                        </span>
                        <span className="text-xs text-rose-600 font-medium">
                          {Math.round((section.negative / section.total) * 100)}%
                        </span>
                        <span className="text-xs text-sky-600 font-medium">
                          {Math.round((section.neutral / section.total) * 100)}%
                        </span>
                      </div>

                      {/* Flagged students in section */}
                      {(() => {
                        const sectionFlagged = flaggedStudents.filter((s) => s.section === section.id);
                        if (sectionFlagged.length === 0) return null;
                        return (
                          <div className="mt-4 pt-3 border-t">
                            <p className="text-xs font-medium text-violet-700 flex items-center gap-1 mb-2">
                              <Sparkles className="h-3 w-3" />
                              AI Pattern Alerts
                            </p>
                            <div className="space-y-1">
                              {sectionFlagged.map((student) => {
                                const negCount = (studentIncidentMap[student.id] || []).filter(
                                  (i) => i.type === 'Negative' && isWithinLast30Days(i.date)
                                ).length;
                                return (
                                  <div key={student.id} className="flex items-center justify-between py-1">
                                    <span className="text-sm">{getStudentName(student)}</span>
                                    <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">
                                      {negCount} negative in 30d
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overall summary card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">School-wide Behavior Overview</CardTitle>
              <CardDescription>Incident distribution across all sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-2">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{stats.positive}</p>
                  <p className="text-sm text-muted-foreground">Commendations</p>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-2">
                    <TrendingDown className="h-6 w-6 text-rose-600" />
                  </div>
                  <p className="text-2xl font-bold text-rose-600">{stats.negative}</p>
                  <p className="text-sm text-muted-foreground">Incidents</p>
                </div>
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 mb-2">
                    <FileText className="h-6 w-6 text-sky-600" />
                  </div>
                  <p className="text-2xl font-bold text-sky-600">{stats.neutral}</p>
                  <p className="text-sm text-muted-foreground">Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============ LOG INCIDENT DIALOG ============ */}
      <Dialog open={showLogModal} onOpenChange={(open) => { if (!open) { setShowLogModal(false); setFormErrors({}); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formData.type === 'Positive' ? 'Log Commendation' : 'Log Behavior Incident'}
            </DialogTitle>
            <DialogDescription>
              {formData.type === 'Positive'
                ? 'Record a positive behavior or achievement for a student.'
                : 'Record a behavior incident and any actions taken.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Student */}
            <div className="space-y-2">
              <Label>Student <span className="text-destructive">*</span></Label>
              <Select value={formData.studentId} onChange={(e) => handleFormChange('studentId', e.target.value)}>
                <option value="">Select a student...</option>
                {STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getStudentName(s)} — {s.gradeLevel} {s.section}
                  </option>
                ))}
              </Select>
              {formErrors.studentId && <p className="text-xs text-destructive">{formErrors.studentId}</p>}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Type <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                {['Positive', 'Negative', 'Neutral'].map((type) => {
                  const style = INCIDENT_TYPES[type];
                  const isSelected = formData.type === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleFormChange('type', type)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-sm font-medium transition-all',
                        isSelected
                          ? `${style.bg} ${style.text} ${style.border}`
                          : 'border-input hover:bg-muted text-muted-foreground'
                      )}
                    >
                      {type === 'Positive' && <ThumbsUp className="h-3.5 w-3.5" />}
                      {type === 'Negative' && <ThumbsDown className="h-3.5 w-3.5" />}
                      {type === 'Neutral' && <Minus className="h-3.5 w-3.5" />}
                      {type}
                    </button>
                  );
                })}
              </div>
              {formErrors.type && <p className="text-xs text-destructive">{formErrors.type}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                disabled={!formData.type}
              >
                <option value="">
                  {formData.type ? 'Select a category...' : 'Select type first...'}
                </option>
                {formData.type &&
                  CATEGORIES[formData.type].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
              </Select>
              {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description <span className="text-destructive">*</span></Label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Describe the incident or behavior in detail..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
            </div>

            {/* Action Taken */}
            <div className="space-y-2">
              <Label>Action Taken</Label>
              <textarea
                value={formData.actionTaken}
                onChange={(e) => handleFormChange('actionTaken', e.target.value)}
                placeholder="What action was taken in response? (optional)"
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
              />
              {formErrors.date && <p className="text-xs text-destructive">{formErrors.date}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowLogModal(false); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button
              onClick={handleLogIncident}
              className={cn(
                formData.type === 'Positive' && 'bg-emerald-600 hover:bg-emerald-700',
                formData.type === 'Negative' && 'bg-rose-600 hover:bg-rose-700'
              )}
            >
              {formData.type === 'Positive' ? 'Log Commendation' : 'Log Incident'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ STUDENT DETAIL SHEET ============ */}
      <Sheet open={!!viewStudent} onOpenChange={(open) => { if (!open) setViewStudent(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
          {viewStudent && (() => {
            const studentIncs = (studentIncidentMap[viewStudent.id] || []).sort(
              (a, b) => b.date.localeCompare(a.date)
            );
            const isFlagged = flaggedStudents.some((f) => f.id === viewStudent.id);
            const posCount = studentIncs.filter((i) => i.type === 'Positive').length;
            const negCount = studentIncs.filter((i) => i.type === 'Negative').length;
            const neuCount = studentIncs.filter((i) => i.type === 'Neutral').length;

            return (
              <>
                {/* Header */}
                <div className={cn(
                  'px-6 py-5 border-b',
                  isFlagged ? 'bg-violet-50' : 'bg-indigo-50'
                )}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-white/80 text-sm font-bold">
                        {getInitials(viewStudent.firstName, viewStudent.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {getStudentName(viewStudent)}
                        {isFlagged && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold animate-pulse">
                            <Sparkles className="h-3 w-3" />
                            AI Alert
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{viewStudent.gradeLevel} - {viewStudent.section}</p>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">{posCount}</span>
                      <span className="text-xs text-muted-foreground">positive</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-sm font-medium">{negCount}</span>
                      <span className="text-xs text-muted-foreground">negative</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <span className="text-sm font-medium">{neuCount}</span>
                      <span className="text-xs text-muted-foreground">neutral</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-6 py-5">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Behavior Timeline
                  </h4>

                  {studentIncs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No incidents recorded for this student.</p>
                  ) : (
                    <div className="space-y-0">
                      {studentIncs.map((inc, idx) => {
                        const typeStyle = INCIDENT_TYPES[inc.type];
                        const isLast = idx === studentIncs.length - 1;
                        return (
                          <div key={inc.id} className="flex gap-3">
                            {/* Timeline line and dot */}
                            <div className="flex flex-col items-center">
                              <div className={cn('w-3 h-3 rounded-full shrink-0 mt-1', typeStyle.dot)} />
                              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                            </div>

                            {/* Content */}
                            <div className={cn('pb-5 min-w-0 flex-1', isLast && 'pb-0')}>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={cn(typeStyle.bg, typeStyle.text, 'border-0 text-[10px] px-1.5 py-0')}>
                                  {inc.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{formatDate(inc.date)}</span>
                              </div>
                              <p className="text-sm font-medium">{inc.category}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">{inc.description}</p>
                              {inc.actionTaken && (
                                <div className="mt-2 px-3 py-2 rounded-md bg-muted/50 border">
                                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Action Taken</p>
                                  <p className="text-sm">{inc.actionTaken}</p>
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground mt-1.5">Logged by {inc.loggedBy}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ============ TOAST ============ */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-in fade-in slide-in-from-bottom-5',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        )}>
          <CheckCircle className="h-4 w-4" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
