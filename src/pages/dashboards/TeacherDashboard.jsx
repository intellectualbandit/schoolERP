import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import {
  Clock, Users, BookOpen, ClipboardCheck, AlertTriangle, Star, CheckCircle2,
} from 'lucide-react';

const todaySchedule = [
  { time: '7:30 - 8:30', subject: 'Math 7', section: 'Grade 7 - Rizal', room: 'Room 201', status: 'done' },
  { time: '9:00 - 10:00', subject: 'Math 8', section: 'Grade 8 - Bonifacio', room: 'Room 203', status: 'current' },
  { time: '10:30 - 11:30', subject: 'Math 9', section: 'Grade 9 - Mabini', room: 'Room 205', status: 'upcoming' },
  { time: '1:00 - 2:00', subject: 'Math 7', section: 'Grade 7 - Rizal', room: 'Room 201', status: 'upcoming' },
];

const mySections = [
  { section: 'Grade 7 - Rizal', students: 38, avgGrade: 87.2, attendance: 95.1 },
  { section: 'Grade 8 - Bonifacio', students: 36, avgGrade: 84.5, attendance: 93.8 },
  { section: 'Grade 9 - Mabini', students: 35, avgGrade: 88.1, attendance: 96.2 },
];

const pendingGrades = [
  { section: 'Grade 7 - Rizal', subject: 'Math 7', quarter: 'Q3', due: 'Mar 28' },
  { section: 'Grade 8 - Bonifacio', subject: 'Math 8', quarter: 'Q3', due: 'Mar 28' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Good morning, {user?.firstName}. Here's your teaching overview for today.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Sections" value={mySections.length} icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard label="Total Students" value={mySections.reduce((s, c) => s + c.students, 0)} icon={Users} color="text-teal-600" bgColor="bg-teal-50" />
        <StatCard label="Classes Today" value={todaySchedule.length} icon={Clock} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard label="Pending Grades" value={pendingGrades.length} icon={AlertTriangle} color="text-red-600" bgColor="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Today's Schedule</CardTitle>
                <CardDescription className="text-xs">Monday, March 24, 2026</CardDescription>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {todaySchedule.map((cls, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${cls.status === 'current' ? 'border-indigo-200 bg-indigo-50/50' : cls.status === 'done' ? 'border-border/60 bg-gray-50/50 opacity-60' : 'border-border/60'}`}>
                <div className="text-center min-w-[70px]">
                  <p className="text-xs font-semibold">{cls.time}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{cls.subject}</p>
                  <p className="text-xs text-muted-foreground">{cls.section} · {cls.room}</p>
                </div>
                {cls.status === 'current' && <Badge className="bg-indigo-100 text-indigo-700 text-xs">Now</Badge>}
                {cls.status === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Sections Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">My Sections Overview</CardTitle>
            <CardDescription className="text-xs">Performance across assigned sections</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {mySections.map(sec => (
              <div key={sec.section} className="p-3 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{sec.section}</p>
                  <Badge variant="outline" className="text-xs">{sec.students} students</Badge>
                </div>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Avg Grade: </span>
                    <span className="font-semibold">{sec.avgGrade}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Attendance: </span>
                    <span className="font-semibold">{sec.attendance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Grades + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Pending Grade Submissions</CardTitle>
            <CardDescription className="text-xs">Grades that need to be submitted</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {pendingGrades.map((pg, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50/30">
                <div>
                  <p className="text-sm font-semibold">{pg.subject} — {pg.section}</p>
                  <p className="text-xs text-muted-foreground">{pg.quarter} · Due: {pg.due}</p>
                </div>
                <Badge variant="outline" className="text-amber-700 border-amber-200 text-xs">Pending</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-xs">Mark Attendance</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5">
              <Star className="h-5 w-5 text-amber-600" />
              <span className="text-xs">Enter Grades</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <span className="text-xs">View Sections</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-xs">Log Incident</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
