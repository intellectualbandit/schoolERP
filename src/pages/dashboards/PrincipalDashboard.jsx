import { useMemo } from 'react';
import {
  Users, GraduationCap, ClipboardCheck, Star, TrendingUp, CalendarDays, Award, Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import StatCard from '../../components/dashboard/StatCard';
import CustomTooltip from '../../components/dashboard/CustomTooltip';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ComposedChart, Line, RadialBarChart, RadialBar,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const enrollmentTrend = [
  { month: 'Jun', enrolled: 980, target: 1200 }, { month: 'Jul', enrolled: 1050, target: 1200 },
  { month: 'Aug', enrolled: 1120, target: 1200 }, { month: 'Sep', enrolled: 1180, target: 1200 },
  { month: 'Oct', enrolled: 1210, target: 1200 }, { month: 'Nov', enrolled: 1230, target: 1200 },
  { month: 'Dec', enrolled: 1235, target: 1200 }, { month: 'Jan', enrolled: 1240, target: 1250 },
  { month: 'Feb', enrolled: 1245, target: 1250 }, { month: 'Mar', enrolled: 1248, target: 1250 },
];

const gradeComparison = [
  { grade: 'Grade 7', q2: 85.4, q3: 87.2 },
  { grade: 'Grade 8', q2: 82.8, q3: 84.5 },
  { grade: 'Grade 9', q2: 86.3, q3: 88.1 },
  { grade: 'Grade 10', q2: 84.1, q3: 85.8 },
];

const performanceGauge = [{ name: 'Score', value: 86.4, fill: '#6366f1' }];

export default function PrincipalDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">School Overview</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Good morning, {user?.firstName}. Read-only executive view for <span className="font-medium text-foreground">March 24, 2026</span>
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="1,248" icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" change="+3.2%" changeType="up" subtitle="vs last SY" />
        <StatCard label="Teachers" value="86" icon={GraduationCap} color="text-teal-600" bgColor="bg-teal-50" change="+5" changeType="up" subtitle="new hires" />
        <StatCard label="Attendance Today" value="94.2%" icon={ClipboardCheck} color="text-emerald-600" bgColor="bg-emerald-50" change="+0.8%" changeType="up" />
        <StatCard label="School Avg. GPA" value="86.4" icon={Star} color="text-amber-600" bgColor="bg-amber-50" change="+1.2" changeType="up" subtitle="vs Q2" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Enrollment Trend */}
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Enrollment Trend</CardTitle>
            <CardDescription className="text-xs">Monthly enrollment vs target</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={enrollmentTrend}>
                <defs>
                  <linearGradient id="princEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[900, 1300]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="enrolled" stroke="#6366f1" fill="url(#princEnroll)" strokeWidth={2.5} name="Enrolled" dot={{ r: 3, fill: '#6366f1' }} />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="6 4" name="Target" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* School Performance Gauge */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">School Performance</CardTitle>
            <CardDescription className="text-xs">Overall academic score</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center">
            <ResponsiveContainer width={200} height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={performanceGauge} startAngle={180} endAngle={0}>
                <RadialBar background dataKey="value" cornerRadius={10} fill="#6366f1" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-16 text-center">
              <p className="text-3xl font-bold">86.4</p>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </div>
            <div className="mt-4 flex gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-emerald-600">+1.2</p>
                <p className="text-[10px] text-muted-foreground">vs Q2</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-sm font-bold text-indigo-600">Top 15%</p>
                <p className="text-[10px] text-muted-foreground">Division Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Comparison */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Grade Level Comparison: Q2 vs Q3</CardTitle>
          <CardDescription className="text-xs">Average scores by grade level</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeComparison} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[75, 95]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="q2" fill="#c4b5fd" name="Q2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="q3" fill="#6366f1" name="Q3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
