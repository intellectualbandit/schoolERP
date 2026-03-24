import { useState, useMemo } from 'react';
import {
  Users, GraduationCap, School, ClipboardCheck, Wallet, TrendingUp,
  ArrowUpRight, ArrowDownRight, CalendarDays, AlertTriangle, UserCheck, BookOpen,
  Activity, Star, Award, Zap, FileText, ShieldAlert, Heart, Megaphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import StatCard from '../../components/dashboard/StatCard';
import CustomTooltip from '../../components/dashboard/CustomTooltip';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

// ─── Mock Data ───────────────────────────────────────────────
const enrollmentTrend = [
  { month: 'Jun', enrolled: 980, target: 1200 },
  { month: 'Jul', enrolled: 1050, target: 1200 },
  { month: 'Aug', enrolled: 1120, target: 1200 },
  { month: 'Sep', enrolled: 1180, target: 1200 },
  { month: 'Oct', enrolled: 1210, target: 1200 },
  { month: 'Nov', enrolled: 1230, target: 1200 },
  { month: 'Dec', enrolled: 1235, target: 1200 },
  { month: 'Jan', enrolled: 1240, target: 1250 },
  { month: 'Feb', enrolled: 1245, target: 1250 },
  { month: 'Mar', enrolled: 1248, target: 1250 },
];

const attendanceTrend = [
  { day: 'Mon', present: 94.2, late: 3.1, absent: 2.7 },
  { day: 'Tue', present: 95.1, late: 2.8, absent: 2.1 },
  { day: 'Wed', present: 93.8, late: 3.5, absent: 2.7 },
  { day: 'Thu', present: 96.0, late: 2.2, absent: 1.8 },
  { day: 'Fri', present: 91.5, late: 4.0, absent: 4.5 },
];

const weeklyAttendance = [
  { week: 'W1', rate: 94.2 }, { week: 'W2', rate: 95.1 },
  { week: 'W3', rate: 93.5 }, { week: 'W4', rate: 94.8 },
  { week: 'W5', rate: 95.3 }, { week: 'W6', rate: 93.9 },
  { week: 'W7', rate: 94.6 }, { week: 'W8', rate: 95.0 },
];

const feeCollection = [
  { month: 'Oct', collected: 285000, outstanding: 65000 },
  { month: 'Nov', collected: 310000, outstanding: 52000 },
  { month: 'Dec', collected: 295000, outstanding: 48000 },
  { month: 'Jan', collected: 340000, outstanding: 35000 },
  { month: 'Feb', collected: 325000, outstanding: 42000 },
  { month: 'Mar', collected: 298000, outstanding: 58000 },
];

const gradeDistribution = [
  { grade: 'Grade 7', outstanding: 32, satisfactory: 45, didNotMeet: 8, average: 87.2 },
  { grade: 'Grade 8', outstanding: 28, satisfactory: 48, didNotMeet: 12, average: 84.5 },
  { grade: 'Grade 9', outstanding: 35, satisfactory: 42, didNotMeet: 6, average: 88.1 },
  { grade: 'Grade 10', outstanding: 30, satisfactory: 44, didNotMeet: 10, average: 85.8 },
];

const genderData = [
  { name: 'Male', value: 648, fill: '#6366f1' },
  { name: 'Female', value: 600, fill: '#ec4899' },
];

const gradeLevelData = [
  { name: 'Grade 7', value: 325, fill: '#6366f1' },
  { name: 'Grade 8', value: 312, fill: '#8b5cf6' },
  { name: 'Grade 9', value: 308, fill: '#a78bfa' },
  { name: 'Grade 10', value: 303, fill: '#c4b5fd' },
];

const topSections = [
  { section: '9-Mabini', grade: 'Grade 9', avg: 92.4, attendance: 97.1, trend: 'up' },
  { section: '7-Rizal', grade: 'Grade 7', avg: 91.8, attendance: 96.5, trend: 'up' },
  { section: '10-Aguinaldo', grade: 'Grade 10', avg: 90.2, attendance: 95.8, trend: 'up' },
  { section: '8-Bonifacio', grade: 'Grade 8', avg: 88.5, attendance: 94.2, trend: 'down' },
];

const recentActivity = [
  { id: 1, type: 'enrollment', message: 'New student enrolled: Maria Santos (Grade 7)', time: '10 min ago', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
  { id: 2, type: 'fee', message: 'Fee payment received: ₱12,500 from Juan Dela Cruz', time: '25 min ago', icon: Wallet, color: 'text-blue-600 bg-blue-50' },
  { id: 3, type: 'alert', message: 'Low attendance alert: Grade 8 Bonifacio (below 90%)', time: '1 hr ago', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
  { id: 4, type: 'announcement', message: 'New announcement posted: Quarterly Exam Schedule', time: '2 hrs ago', icon: Megaphone, color: 'text-purple-600 bg-purple-50' },
  { id: 5, type: 'grade', message: 'Grades submitted: Science Q3 by Ms. Reyes', time: '3 hrs ago', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
  { id: 6, type: 'behavior', message: 'Behavior incident logged: Classroom disruption', time: '4 hrs ago', icon: ShieldAlert, color: 'text-red-600 bg-red-50' },
  { id: 7, type: 'wellness', message: 'Wellness check completed for Grade 9 batch', time: '5 hrs ago', icon: Heart, color: 'text-pink-600 bg-pink-50' },
];

const criticalAlerts = [
  { id: 1, title: '12 students with 3+ consecutive absences', severity: 'high', action: 'Review' },
  { id: 2, title: '₱358,000 in overdue fee payments', severity: 'high', action: 'View' },
  { id: 3, title: '5 teacher positions unfilled for Q4', severity: 'medium', action: 'Review' },
  { id: 4, title: 'Grade 8 Science scores below target', severity: 'medium', action: 'Analyze' },
];

const upcomingEvents = [
  { id: 1, title: 'Quarterly Examination', date: 'Mar 28-30', type: 'exam' },
  { id: 2, title: 'Parent-Teacher Conference', date: 'Apr 2', type: 'meeting' },
  { id: 3, title: 'Foundation Day Celebration', date: 'Apr 10', type: 'event' },
  { id: 4, title: 'DepEd Division Review', date: 'Apr 15', type: 'compliance' },
];

const departmentPerformance = [
  { dept: 'Science', teachers: 12, avgScore: 88.5, satisfaction: 92 },
  { dept: 'Mathematics', teachers: 10, avgScore: 85.2, satisfaction: 88 },
  { dept: 'English', teachers: 11, avgScore: 90.1, satisfaction: 94 },
  { dept: 'Filipino', teachers: 8, avgScore: 91.3, satisfaction: 91 },
  { dept: 'Social Studies', teachers: 9, avgScore: 87.8, satisfaction: 89 },
  { dept: 'MAPEH', teachers: 8, avgScore: 93.2, satisfaction: 95 },
  { dept: 'TLE', teachers: 7, avgScore: 89.4, satisfaction: 90 },
  { dept: 'ESP', teachers: 6, avgScore: 90.8, satisfaction: 93 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [attendanceView, setAttendanceView] = useState('daily');

  const totalCollected = useMemo(() => feeCollection.reduce((sum, m) => sum + m.collected, 0), []);
  const totalOutstanding = useMemo(() => feeCollection.reduce((sum, m) => sum + m.outstanding, 0), []);
  const collectionRate = useMemo(() => ((totalCollected / (totalCollected + totalOutstanding)) * 100).toFixed(1), [totalCollected, totalOutstanding]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {user?.firstName}. Here's your school overview for <span className="font-medium text-foreground">March 24, 2026</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SY 2025-2026
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
            <CalendarDays className="h-3 w-3" />
            Q3 · Week 12
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Students" value="1,248" icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" change="+3.2%" changeType="up" subtitle="vs last SY" />
        <StatCard label="Teachers" value="86" icon={GraduationCap} color="text-teal-600" bgColor="bg-teal-50" change="+5" changeType="up" subtitle="new hires" />
        <StatCard label="Attendance Today" value="94.2%" icon={ClipboardCheck} color="text-emerald-600" bgColor="bg-emerald-50" change="+0.8%" changeType="up" subtitle="vs yesterday" />
        <StatCard label="Avg. GPA" value="86.4" icon={Star} color="text-amber-600" bgColor="bg-amber-50" change="+1.2" changeType="up" subtitle="vs Q2" />
        <StatCard label="Fee Collection" value={`${collectionRate}%`} icon={Wallet} color="text-blue-600" bgColor="bg-blue-50" change="₱358K" changeType="down" subtitle="outstanding" />
        <StatCard label="Active Classes" value="42" icon={School} color="text-purple-600" bgColor="bg-purple-50" change="100%" changeType="up" subtitle="operational" />
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">Action Required ({criticalAlerts.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
              {criticalAlerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-amber-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <span className="text-xs text-foreground/90 truncate">{alert.title}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 flex-shrink-0 ml-2">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollment Trend + Demographics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Enrollment Trend</CardTitle>
                <CardDescription className="text-xs">Monthly enrollment vs target capacity</CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />On Track
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={enrollmentTrend}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[900, 1300]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="enrolled" stroke="#6366f1" fill="url(#enrollGrad)" strokeWidth={2.5} name="Enrolled" dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="6 4" name="Target" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Student Demographics</CardTitle>
            <CardDescription className="text-xs">Distribution by gender & grade level</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Gender</p>
                <div className="flex items-center gap-3">
                  <ResponsiveContainer width={90} height={90}>
                    <PieChart>
                      <Pie data={genderData} innerRadius={28} outerRadius={40} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {genderData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 flex-1">
                    {genderData.map(g => (
                      <div key={g.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.fill }} />
                          <span className="text-xs text-muted-foreground">{g.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold">{g.value}</span>
                          <span className="text-xs text-muted-foreground ml-1">({((g.value / 1248) * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">By Grade Level</p>
                <div className="space-y-2.5">
                  {gradeLevelData.map(g => (
                    <div key={g.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{g.name}</span>
                        <span className="font-semibold">{g.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${(g.value / 325) * 100}%`, backgroundColor: g.fill }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance + Fee Collection */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Attendance Overview</CardTitle>
                <CardDescription className="text-xs">This week's attendance breakdown</CardDescription>
              </div>
              <Tabs value={attendanceView} onValueChange={setAttendanceView} className="h-7">
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="daily" className="text-xs h-6 px-2.5">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs h-6 px-2.5">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {attendanceView === 'daily' ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={attendanceTrend} barGap={0} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
                  <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={weeklyAttendance}>
                  <defs>
                    <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[90, 98]} />
                  <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" fill="url(#weeklyGrad)" strokeWidth={2.5} name="Attendance Rate" dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Fee Collection</CardTitle>
                <CardDescription className="text-xs">Monthly collected vs outstanding</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">₱{(totalCollected / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Total Collected</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={feeCollection} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip content={<CustomTooltip formatter={(v) => `₱${(v).toLocaleString()}`} />} />
                <Bar dataKey="collected" fill="#6366f1" name="Collected" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outstanding" fill="#e2e8f0" name="Outstanding" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-muted-foreground">Collection Rate</span>
                <span className="text-xs font-bold text-indigo-600">{collectionRate}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all" style={{ width: `${collectionRate}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance + Top Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Academic Performance by Grade Level</CardTitle>
            <CardDescription className="text-xs">Q3 performance breakdown (% of students)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left text-xs font-medium text-muted-foreground py-2.5 pr-4">Grade Level</th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2.5 px-3">
                      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Outstanding</span>
                    </th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2.5 px-3">
                      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />Satisfactory</span>
                    </th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2.5 px-3">
                      <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Did Not Meet</span>
                    </th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2.5 pl-3">Avg. Score</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-2.5 pl-3">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeDistribution.map((g) => {
                    const total = g.outstanding + g.satisfactory + g.didNotMeet;
                    return (
                      <tr key={g.grade} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                        <td className="py-3 pr-4"><span className="font-medium text-sm">{g.grade}</span></td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center justify-center h-7 w-12 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">{((g.outstanding / total) * 100).toFixed(0)}%</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center justify-center h-7 w-12 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">{((g.satisfactory / total) * 100).toFixed(0)}%</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center justify-center h-7 w-12 rounded-md bg-red-50 text-red-700 text-xs font-semibold">{((g.didNotMeet / total) * 100).toFixed(0)}%</span>
                        </td>
                        <td className="py-3 pl-3 text-center"><span className="text-sm font-bold">{g.average}</span></td>
                        <td className="py-3 pl-3">
                          <div className="flex justify-end">
                            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden flex">
                              <div className="h-full bg-emerald-500" style={{ width: `${(g.outstanding / total) * 100}%` }} />
                              <div className="h-full bg-blue-500" style={{ width: `${(g.satisfactory / total) * 100}%` }} />
                              <div className="h-full bg-red-500" style={{ width: `${(g.didNotMeet / total) * 100}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Top Sections</CardTitle>
                <CardDescription className="text-xs">Ranked by academic average</CardDescription>
              </div>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {topSections.map((s, i) => (
                <div key={s.section} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-muted text-muted-foreground' : i === 2 ? 'bg-orange-50 text-orange-600' : 'bg-muted text-muted-foreground'}`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{s.section}</p>
                    <p className="text-xs text-muted-foreground">{s.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600">{s.avg}</p>
                    <div className="flex items-center gap-0.5 justify-end">
                      {s.trend === 'up' ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                      <span className="text-xs text-muted-foreground">{s.attendance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance + Activity + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Department Performance</CardTitle>
            <CardDescription className="text-xs">Average student scores by department</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={departmentPerformance} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[75, 100]} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgScore" fill="#8b5cf6" name="Avg Score" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Latest school events & updates</CardDescription>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-foreground/90 leading-relaxed">{item.message}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Upcoming Events</CardTitle>
                <CardDescription className="text-xs">Scheduled activities this month</CardDescription>
              </div>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {upcomingEvents.map(event => {
                const typeConfig = {
                  exam: { color: 'bg-red-50 text-red-700 border-red-100', icon: FileText },
                  meeting: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Users },
                  event: { color: 'bg-purple-50 text-purple-700 border-purple-100', icon: Zap },
                  compliance: { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: ShieldAlert },
                }[event.type];
                const EventIcon = typeConfig.icon;
                return (
                  <div key={event.id} className={`flex items-center gap-3 p-3 rounded-lg border ${typeConfig.color}`}>
                    <EventIcon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{event.title}</p>
                      <p className="text-[11px] opacity-75">{event.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2.5 bg-muted rounded-lg">
                <p className="text-lg font-bold text-indigo-600">98.4%</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Retention Rate</p>
              </div>
              <div className="text-center p-2.5 bg-muted rounded-lg">
                <p className="text-lg font-bold text-emerald-600">4.2</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Parent Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
