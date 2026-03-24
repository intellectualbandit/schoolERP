import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart, AlertTriangle, TrendingUp, MessageSquare,
  Search, ChevronDown, ChevronRight, Clock,
  Send, Smile, Users, Activity, BarChart3,
  Shield, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';

// ============================================================
// CONSTANTS
// ============================================================

const MOODS = {
  happy:    { emoji: '\u{1F60A}', label: 'Happy',    level: 5, bg: 'bg-emerald-400', bgLight: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  okay:     { emoji: '\u{1F610}', label: 'Okay',     level: 4, bg: 'bg-amber-400',   bgLight: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200' },
  sad:      { emoji: '\u{1F622}', label: 'Sad',      level: 3, bg: 'bg-sky-400',     bgLight: 'bg-sky-50',      text: 'text-sky-700',     border: 'border-sky-200' },
  stressed: { emoji: '\u{1F630}', label: 'Stressed', level: 2, bg: 'bg-violet-400',  bgLight: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200' },
  angry:    { emoji: '\u{1F620}', label: 'Angry',    level: 1, bg: 'bg-rose-400',    bgLight: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-200' },
};

const MOOD_KEYS = ['happy', 'okay', 'sad', 'stressed', 'angry'];
const NEGATIVE_MOODS = ['sad', 'stressed', 'angry'];
const SECTIONS = ['Grade 7 - Sampaguita', 'Grade 7 - Rosal', 'Grade 8 - Narra'];
const MOOD_HEIGHT = { happy: 100, okay: 75, sad: 50, stressed: 35, angry: 20 };

// ============================================================
// DATE UTILITIES
// ============================================================

const generateDates = (days = 14) => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const formatDateShort = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDayLetter = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
};

const DATES = generateDates(14);
const TODAY = DATES[DATES.length - 1];

// ============================================================
// SEEDED RANDOM (consistent mock data across renders)
// ============================================================

const seededRandom = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// ============================================================
// STUDENT DATA
// ============================================================

const generateMoods = (seed, overrides = {}) => {
  const moods = {};
  DATES.forEach((date, i) => {
    if (overrides[date]) {
      moods[date] = overrides[date];
    } else {
      const r = seededRandom(seed + i);
      if (r < 0.4) moods[date] = 'happy';
      else if (r < 0.7) moods[date] = 'okay';
      else if (r < 0.82) moods[date] = 'sad';
      else if (r < 0.92) moods[date] = 'stressed';
      else moods[date] = 'angry';
    }
  });
  return moods;
};

const negativeStreak = (startIdx, length, pattern) => {
  const overrides = {};
  for (let i = 0; i < length; i++) {
    if (DATES[startIdx + i]) {
      overrides[DATES[startIdx + i]] = pattern[i % pattern.length];
    }
  }
  return overrides;
};

const STUDENTS = [
  // Grade 7 - Sampaguita
  { id: 's1',  name: 'Maria Clara Santos',     section: 'Grade 7 - Sampaguita', moods: generateMoods(101, negativeStreak(9, 5, ['sad', 'stressed', 'sad', 'stressed', 'sad'])) },
  { id: 's2',  name: 'Juan Miguel dela Cruz',  section: 'Grade 7 - Sampaguita', moods: generateMoods(102, negativeStreak(10, 4, ['angry', 'stressed', 'angry', 'angry'])) },
  { id: 's3',  name: 'Sofia Isabelle Garcia',  section: 'Grade 7 - Sampaguita', moods: generateMoods(103) },
  { id: 's4',  name: 'Carlos Andrei Reyes',    section: 'Grade 7 - Sampaguita', moods: generateMoods(104) },
  { id: 's5',  name: 'Angela Joy Fernandez',   section: 'Grade 7 - Sampaguita', moods: generateMoods(105, negativeStreak(8, 5, ['stressed', 'stressed', 'sad', 'stressed', 'angry'])) },
  { id: 's6',  name: 'Miguel Antonio Ramos',   section: 'Grade 7 - Sampaguita', moods: generateMoods(106) },
  { id: 's7',  name: 'Francesca Rose Torres',  section: 'Grade 7 - Sampaguita', moods: generateMoods(107) },
  { id: 's8',  name: 'Adrian James Cruz',      section: 'Grade 7 - Sampaguita', moods: generateMoods(108) },
  // Grade 7 - Rosal
  { id: 's9',  name: 'Patricia Ann Villanueva', section: 'Grade 7 - Rosal', moods: generateMoods(109) },
  { id: 's10', name: 'Marco Luis Bautista',     section: 'Grade 7 - Rosal', moods: generateMoods(110, negativeStreak(10, 4, ['sad', 'sad', 'sad', 'stressed'])) },
  { id: 's11', name: 'Isabelle Marie Morales',  section: 'Grade 7 - Rosal', moods: generateMoods(111) },
  { id: 's12', name: 'Gabriel Jose Navarro',    section: 'Grade 7 - Rosal', moods: generateMoods(112) },
  { id: 's13', name: 'Camille Nicole Aquino',   section: 'Grade 7 - Rosal', moods: generateMoods(113) },
  { id: 's14', name: 'Rafael David Mendoza',    section: 'Grade 7 - Rosal', moods: generateMoods(114, negativeStreak(9, 5, ['stressed', 'angry', 'stressed', 'angry', 'stressed'])) },
  { id: 's15', name: 'Hannah Grace Lim',        section: 'Grade 7 - Rosal', moods: generateMoods(115) },
  // Grade 8 - Narra
  { id: 's16', name: 'Andrea Nicole Tan',       section: 'Grade 8 - Narra', moods: generateMoods(116) },
  { id: 's17', name: 'Jerico Paulo Santos',     section: 'Grade 8 - Narra', moods: generateMoods(117) },
  { id: 's18', name: 'Samantha Joy Cruz',       section: 'Grade 8 - Narra', moods: generateMoods(118, negativeStreak(8, 6, ['sad', 'stressed', 'sad', 'angry', 'sad', 'stressed'])) },
  { id: 's19', name: 'Ethan Luis Rivera',       section: 'Grade 8 - Narra', moods: generateMoods(119) },
  { id: 's20', name: 'Christina Mae Domingo',   section: 'Grade 8 - Narra', moods: generateMoods(120) },
  { id: 's21', name: 'Nathan James Ocampo',     section: 'Grade 8 - Narra', moods: generateMoods(121) },
  { id: 's22', name: 'Bianca Ysabel Flores',    section: 'Grade 8 - Narra', moods: generateMoods(122) },
];

// ============================================================
// INITIAL COUNSELOR NOTES
// ============================================================

const INITIAL_NOTES = {
  s1: [
    { id: 1, text: 'Spoke with Maria after class. She mentioned ongoing difficulties at home \u2014 parents are separating. She was tearful but receptive to talking.', date: DATES[11], counselor: 'Mrs. Gonzales' },
    { id: 2, text: 'Follow-up session. Maria is coping slightly better. Recommended journaling as an outlet. Will check in again Friday.', date: DATES[12], counselor: 'Mrs. Gonzales' },
  ],
  s10: [
    { id: 1, text: 'Marco has been increasingly withdrawn. Peer reports indicate possible bullying during recess. Scheduled parent conference for next week.', date: DATES[11], counselor: 'Mr. Reyes' },
  ],
  s5: [
    { id: 1, text: 'Angela expressed feeling overwhelmed by academic workload. Coordinating with class adviser to review her schedule and reduce extracurricular load.', date: DATES[10], counselor: 'Mrs. Gonzales' },
  ],
};

// ============================================================
// HELPERS
// ============================================================

const getConsecutiveNegativeStreak = (moods) => {
  let maxStreak = 0;
  let currentStreak = 0;
  let ongoingStreak = 0;

  DATES.forEach((date) => {
    if (NEGATIVE_MOODS.includes(moods[date])) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  });

  for (let i = DATES.length - 1; i >= 0; i--) {
    if (NEGATIVE_MOODS.includes(moods[DATES[i]])) ongoingStreak++;
    else break;
  }

  return { maxStreak, ongoingStreak };
};

const getInitials = (name) =>
  name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0])
    .join('');

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Wellness() {
  const { isReadOnly: checkReadOnly } = useAuth();
  const readOnly = checkReadOnly('wellness');
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [counselorNotes, setCounselorNotes] = useState(INITIAL_NOTES);
  const [newNoteText, setNewNoteText] = useState('');
  const [checkInMood, setCheckInMood] = useState(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [expandedFlagged, setExpandedFlagged] = useState(null);

  // ---- Derived data ----

  const filteredStudents = useMemo(
    () =>
      STUDENTS.filter((s) => {
        const matchSection = selectedSection === 'all' || s.section === selectedSection;
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSection && matchSearch;
      }),
    [selectedSection, searchQuery]
  );

  const flaggedStudents = useMemo(
    () =>
      filteredStudents
        .map((s) => ({ ...s, ...getConsecutiveNegativeStreak(s.moods) }))
        .filter((s) => s.maxStreak >= 3)
        .sort((a, b) => b.ongoingStreak - a.ongoingStreak || b.maxStreak - a.maxStreak),
    [filteredStudents]
  );

  const todayStats = useMemo(() => {
    const counts = { happy: 0, okay: 0, sad: 0, stressed: 0, angry: 0 };
    let total = 0;
    filteredStudents.forEach((s) => {
      const mood = s.moods[TODAY];
      if (mood) { counts[mood]++; total++; }
    });
    return { counts, total };
  }, [filteredStudents]);

  const wellnessScore = useMemo(() => {
    if (todayStats.total === 0) return 0;
    const totalLevel = Object.entries(todayStats.counts).reduce(
      (sum, [mood, count]) => sum + (MOODS[mood]?.level || 0) * count,
      0
    );
    return Math.round((totalLevel / todayStats.total / 5) * 100);
  }, [todayStats]);

  // ---- Handlers ----

  const handleCheckIn = useCallback((mood) => {
    setCheckInMood(mood);
    setCheckInSubmitted(true);
    setTimeout(() => {
      setCheckInSubmitted(false);
      setCheckInMood(null);
    }, 3000);
  }, []);

  const handleAddNote = useCallback(
    (studentId) => {
      if (!newNoteText.trim()) return;
      setCounselorNotes((prev) => ({
        ...prev,
        [studentId]: [
          ...(prev[studentId] || []),
          { id: Date.now(), text: newNoteText.trim(), date: TODAY, counselor: 'Current User' },
        ],
      }));
      setNewNoteText('');
    },
    [newNoteText]
  );

  // ---- Render ----

  return (
    <div className="space-y-6">
      {/* ============ SUMMARY CARDS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Smile className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wellness Score</p>
                <p className="text-2xl font-bold">{wellnessScore}%</p>
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
                <p className="text-sm text-muted-foreground">Checked In Today</p>
                <p className="text-2xl font-bold">
                  {todayStats.total}
                  <span className="text-sm font-normal text-muted-foreground">/{filteredStudents.length}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flagged Students</p>
                <p className="text-2xl font-bold text-rose-600">{flaggedStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Activity className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Positive Today</p>
                <p className="text-2xl font-bold">
                  {todayStats.total > 0
                    ? Math.round(((todayStats.counts.happy + todayStats.counts.okay) / todayStats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============ FILTERS ============ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...SECTIONS].map((section) => (
            <Button
              key={section}
              variant={selectedSection === section ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSection(section)}
              className="whitespace-nowrap"
            >
              {section === 'all' ? 'All Sections' : section}
            </Button>
          ))}
        </div>
      </div>

      {/* ============ MAIN TABS ============ */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Class Overview
          </TabsTrigger>
          <TabsTrigger value="flagged" className="gap-1.5">
            <Shield className="h-4 w-4" /> Flagged Students
            {flaggedStudents.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                {flaggedStudents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-1.5">
            <TrendingUp className="h-4 w-4" /> Mood Trends
          </TabsTrigger>
          <TabsTrigger value="checkin" className="gap-1.5">
            <Heart className="h-4 w-4" /> Daily Check-in
          </TabsTrigger>
        </TabsList>

        {/* ======== TAB: CLASS OVERVIEW ======== */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Today's mood distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today's Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 flex-wrap">
                {MOOD_KEYS.map((key) => {
                  const mood = MOODS[key];
                  const count = todayStats.counts[key];
                  const pct = todayStats.total > 0 ? Math.round((count / todayStats.total) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-2xl">{mood.emoji}</span>
                      <div>
                        <p className="text-sm font-medium">{mood.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {count} ({pct}%)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Distribution bar */}
              <div className="flex h-3 rounded-full overflow-hidden mt-4">
                {MOOD_KEYS.map((key) => {
                  const pct = todayStats.total > 0 ? (todayStats.counts[key] / todayStats.total) * 100 : 0;
                  return pct > 0 ? (
                    <div
                      key={key}
                      className={`${MOODS[key].bg} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Wellness heatmap */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Class Wellness Heatmap</CardTitle>
                  <CardDescription>Mood check-in data for the past 2 weeks</CardDescription>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {MOOD_KEYS.map((key) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-sm ${MOODS[key].bg}`} />
                      <span className="text-xs text-muted-foreground">{MOODS[key].emoji}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-separate" style={{ borderSpacing: '0 2px' }}>
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-4 sticky left-0 bg-card z-10 min-w-[160px]">
                        Student
                      </th>
                      {DATES.map((date) => (
                        <th key={date} className="text-center text-xs font-medium text-muted-foreground pb-2 px-0.5 min-w-[32px]">
                          <div>{formatDayLetter(date)}</div>
                          <div className="font-normal">{new Date(date + 'T00:00:00').getDate()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const isFlagged = flaggedStudents.some((f) => f.id === student.id);
                      return (
                        <tr key={student.id} className={`group ${isFlagged ? 'bg-rose-50/50' : ''}`}>
                          <td className="py-1 pr-4 sticky left-0 bg-card z-10">
                            <div className="flex items-center gap-2">
                              <span className="text-sm truncate max-w-[140px]">{student.name}</span>
                              {isFlagged && <span className="flex h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />}
                            </div>
                          </td>
                          {DATES.map((date) => {
                            const mood = student.moods[date];
                            const moodData = MOODS[mood];
                            return (
                              <td key={date} className="py-1 px-0.5 text-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`w-7 h-7 rounded-md mx-auto cursor-default transition-transform hover:scale-125 flex items-center justify-center ${
                                        moodData?.bg || 'bg-muted'
                                      }`}
                                    >
                                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity select-none">
                                        {moodData?.emoji}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p className="font-medium">
                                      {moodData?.emoji} {moodData?.label}
                                    </p>
                                    <p className="text-muted-foreground">{formatDateShort(date)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======== TAB: FLAGGED STUDENTS ======== */}
        <TabsContent value="flagged" className="space-y-4 mt-4">
          {flaggedStudents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-lg font-medium">No Flagged Students</p>
                <p className="text-sm text-muted-foreground mt-1">All students are showing positive mood patterns.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Flagged list */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  {flaggedStudents.length} student{flaggedStudents.length !== 1 ? 's' : ''} flagged for attention
                </h3>

                {flaggedStudents.map((student) => {
                  const isExpanded = expandedFlagged === student.id;
                  const notes = counselorNotes[student.id] || [];
                  const latestMood = student.moods[TODAY];

                  return (
                    <Card
                      key={student.id}
                      className={`border-l-4 transition-all ${
                        student.ongoingStreak >= 3 ? 'border-l-rose-500' : 'border-l-amber-400'
                      }`}
                    >
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs bg-muted">{getInitials(student.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.section}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              {student.ongoingStreak >= 3
                                ? `${student.ongoingStreak} days ongoing`
                                : `${student.maxStreak} day streak`}
                            </Badge>
                            <span className="text-lg">{MOODS[latestMood]?.emoji}</span>
                          </div>
                        </div>

                        {/* Last 7 days mood strip */}
                        <div className="flex gap-1 mt-3">
                          {DATES.slice(-7).map((date) => {
                            const mood = student.moods[date];
                            return <div key={date} className={`flex-1 h-2 rounded-full ${MOODS[mood]?.bg || 'bg-muted'}`} />;
                          })}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">7 days ago</span>
                          <span className="text-[10px] text-muted-foreground">Today</span>
                        </div>

                        {/* Expand toggle */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-xs"
                          onClick={() => {
                            setExpandedFlagged(isExpanded ? null : student.id);
                            setSelectedStudent(student);
                            setNewNoteText('');
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3 mr-1" />
                          ) : (
                            <ChevronRight className="h-3 w-3 mr-1" />
                          )}
                          {notes.length > 0
                            ? `${notes.length} counselor note${notes.length !== 1 ? 's' : ''}`
                            : 'Add counselor note'}
                        </Button>

                        {/* Expanded notes panel */}
                        {isExpanded && (
                          <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Separator />

                            {notes.map((note) => (
                              <div key={note.id} className="bg-muted/50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium">{note.counselor}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDateShort(note.date)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{note.text}</p>
                              </div>
                            ))}

                            {!readOnly && (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add intervention note..."
                                  value={selectedStudent?.id === student.id ? newNoteText : ''}
                                  onChange={(e) => {
                                    setSelectedStudent(student);
                                    setNewNoteText(e.target.value);
                                  }}
                                  className="text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAddNote(student.id);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddNote(student.id)}
                                  disabled={!newNoteText.trim() || selectedStudent?.id !== student.id}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Counselor notes log */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Counselor Notes Log
                  </CardTitle>
                  <CardDescription>All intervention notes across flagged students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const allNotes = Object.entries(counselorNotes)
                        .flatMap(([studentId, notes]) => {
                          const student = STUDENTS.find((s) => s.id === studentId);
                          return notes.map((note) => ({ ...note, student }));
                        })
                        .sort((a, b) => b.date.localeCompare(a.date));

                      if (allNotes.length === 0) {
                        return <p className="text-sm text-muted-foreground text-center py-6">No counselor notes yet.</p>;
                      }

                      return allNotes.map((note, idx) => (
                        <div key={`${note.student?.id}-${note.id}`} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px] bg-muted">
                                {note.student ? getInitials(note.student.name) : '?'}
                              </AvatarFallback>
                            </Avatar>
                            {idx < allNotes.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                          </div>
                          <div className="pb-4 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium truncate">{note.student?.name || 'Unknown'}</span>
                              <span className="text-xs text-muted-foreground shrink-0">{formatDateShort(note.date)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{note.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">&mdash; {note.counselor}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ======== TAB: MOOD TRENDS ======== */}
        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Student selector */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Student</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 max-h-[500px] overflow-y-auto">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.id === student.id;
                  const latestMood = student.moods[TODAY];
                  const isFlagged = flaggedStudents.some((f) => f.id === student.id);

                  return (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback
                          className={`text-[10px] ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted'}`}
                        >
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className={`text-xs ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {student.section}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {isFlagged && <span className="flex h-2 w-2 rounded-full bg-rose-500" />}
                        <span className="text-lg">{MOODS[latestMood]?.emoji}</span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trend chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedStudent ? `${selectedStudent.name}'s Mood Trend` : 'Select a student to view trends'}
                </CardTitle>
                {selectedStudent && <CardDescription>{selectedStudent.section}</CardDescription>}
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  <div>
                    {/* Bar chart */}
                    <div className="flex items-end gap-1.5 h-48 mb-2">
                      {DATES.map((date) => {
                        const mood = selectedStudent.moods[date];
                        const moodData = MOODS[mood];
                        const height = MOOD_HEIGHT[mood] || 0;

                        return (
                          <Tooltip key={date}>
                            <TooltipTrigger asChild>
                              <div className="flex-1 flex flex-col items-center cursor-default">
                                <div
                                  className={`w-full rounded-t-md transition-all duration-500 hover:opacity-80 ${
                                    moodData?.bg || 'bg-muted'
                                  }`}
                                  style={{ height: `${height}%` }}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {moodData?.emoji} {moodData?.label}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatDateShort(date)}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>

                    {/* Date labels */}
                    <div className="flex gap-1.5">
                      {DATES.map((date) => (
                        <div key={date} className="flex-1 text-center">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(date + 'T00:00:00').getDate()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                      {MOOD_KEYS.map((key) => (
                        <div key={key} className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-sm ${MOODS[key].bg}`} />
                          <span className="text-xs text-muted-foreground">
                            {MOODS[key].emoji} {MOODS[key].label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Summary stats */}
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Most Common</p>
                        <p className="text-lg mt-1">
                          {(() => {
                            const counts = {};
                            DATES.forEach((d) => {
                              const m = selectedStudent.moods[d];
                              counts[m] = (counts[m] || 0) + 1;
                            });
                            const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                            return top ? `${MOODS[top[0]].emoji} ${MOODS[top[0]].label}` : '-';
                          })()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Positive Days</p>
                        <p className="text-lg mt-1 font-medium">
                          {DATES.filter((d) => ['happy', 'okay'].includes(selectedStudent.moods[d])).length}/14
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Current Streak</p>
                        <p className="text-lg mt-1">
                          {(() => {
                            const { ongoingStreak } = getConsecutiveNegativeStreak(selectedStudent.moods);
                            if (ongoingStreak >= 3) return `\u26A0\uFE0F ${ongoingStreak}d negative`;
                            let posStreak = 0;
                            for (let i = DATES.length - 1; i >= 0; i--) {
                              if (!NEGATIVE_MOODS.includes(selectedStudent.moods[DATES[i]])) posStreak++;
                              else break;
                            }
                            return posStreak > 0 ? `\u2713 ${posStreak}d positive` : '-';
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Click on a student to view their mood trend</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ======== TAB: DAILY CHECK-IN ======== */}
        <TabsContent value="checkin" className="mt-4">
          <Card className="max-w-lg mx-auto overflow-hidden">
            <CardContent className="py-12">
              {!checkInSubmitted ? (
                <div className="text-center space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">How are you feeling today?</h2>
                    <p className="text-muted-foreground mt-2">Tap the emoji that best describes your mood right now.</p>
                  </div>

                  <div className="flex justify-center gap-4">
                    {MOOD_KEYS.map((key) => {
                      const mood = MOODS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => handleCheckIn(key)}
                          className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 hover:bg-muted hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <span className="text-5xl transition-transform duration-200 group-hover:scale-110">
                            {mood.emoji}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {mood.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Your response is confidential and helps us support your wellbeing.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <span className="text-7xl block">{MOODS[checkInMood]?.emoji}</span>
                  <div>
                    <h2 className="text-xl font-semibold">Thank you!</h2>
                    <p className="text-muted-foreground mt-1">Your check-in has been recorded.</p>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${MOODS[checkInMood]?.bgLight} ${MOODS[checkInMood]?.text}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Feeling {MOODS[checkInMood]?.label}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
