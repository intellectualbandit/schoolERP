import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import {
  Star, ClipboardCheck, Calendar, Megaphone, Heart, BookOpen,
} from 'lucide-react';

const myGrades = [
  { subject: 'Filipino', q1: 88, q2: 85, q3: 90, avg: 87.7 },
  { subject: 'English', q1: 82, q2: 80, q3: 78, avg: 80.0 },
  { subject: 'Mathematics', q1: 91, q2: 89, q3: 93, avg: 91.0 },
  { subject: 'Science', q1: 86, q2: 84, q3: 88, avg: 86.0 },
  { subject: 'Araling Panlipunan', q1: 90, q2: 88, q3: 91, avg: 89.7 },
  { subject: 'ESP', q1: 92, q2: 90, q3: 93, avg: 91.7 },
  { subject: 'MAPEH', q1: 89, q2: 87, q3: 90, avg: 88.7 },
  { subject: 'TLE', q1: 85, q2: 83, q3: 87, avg: 85.0 },
];

const schedule = [
  { time: '7:30 - 8:30', subject: 'Filipino', teacher: 'Ms. Dela Rosa' },
  { time: '8:30 - 9:30', subject: 'English', teacher: 'Mr. Bautista' },
  { time: '10:00 - 11:00', subject: 'Mathematics', teacher: 'Ms. Montoya' },
  { time: '11:00 - 12:00', subject: 'Science', teacher: 'Mr. Santos' },
  { time: '1:00 - 2:00', subject: 'Araling Panlipunan', teacher: 'Ms. Villanueva' },
];

const announcements = [
  { id: 1, title: 'Final Examinations Schedule', date: 'Mar 22', type: 'exam' },
  { id: 2, title: 'Foundation Day Celebration', date: 'Mar 20', type: 'event' },
  { id: 3, title: 'Science Fair Registration Open', date: 'Mar 18', type: 'academic' },
];

const generalAvg = (myGrades.reduce((s, g) => s + g.avg, 0) / myGrades.length).toFixed(1);

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome, {user?.firstName}! {user?.gradeLevel} - {user?.section}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="General Average" value={generalAvg} icon={Star} color="text-amber-600" bgColor="bg-amber-50" change="+1.5" changeType="up" subtitle="vs Q2" />
        <StatCard label="Attendance" value="96.2%" icon={ClipboardCheck} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard label="Subjects" value={myGrades.length} icon={BookOpen} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard label="Quarter" value="Q3" icon={Calendar} color="text-blue-600" bgColor="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Grades Table */}
        <Card className="xl:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">My Grades</CardTitle>
            <CardDescription className="text-xs">Current quarter grades by subject</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-4">Subject</th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2 px-2">Q1</th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2 px-2">Q2</th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2 px-2">Q3</th>
                    <th className="text-center text-xs font-medium text-muted-foreground py-2 pl-2">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {myGrades.map(g => (
                    <tr key={g.subject} className="border-b last:border-0">
                      <td className="py-2.5 pr-4 text-sm font-medium">{g.subject}</td>
                      <td className="py-2.5 px-2 text-center text-xs">{g.q1}</td>
                      <td className="py-2.5 px-2 text-center text-xs">{g.q2}</td>
                      <td className="py-2.5 px-2 text-center text-xs font-semibold">{g.q3}</td>
                      <td className="py-2.5 pl-2 text-center">
                        <span className={`text-xs font-bold ${g.avg >= 90 ? 'text-emerald-600' : g.avg >= 80 ? 'text-blue-600' : g.avg >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                          {g.avg}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td className="py-2.5 font-bold text-sm">General Average</td>
                    <td colSpan={3} />
                    <td className="py-2.5 text-center font-bold text-indigo-600">{generalAvg}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Schedule + Announcements */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1.5">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="text-[11px] font-medium text-muted-foreground min-w-[75px]">{s.time}</div>
                  <div>
                    <p className="text-xs font-semibold">{s.subject}</p>
                    <p className="text-[11px] text-muted-foreground">{s.teacher}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Announcements</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {announcements.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Wellness Check-in */}
          <Card className="border-0 shadow-sm border-pink-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-semibold">How are you feeling today?</span>
              </div>
              <div className="flex gap-2">
                {['😊', '😐', '😢', '😰', '😠'].map(emoji => (
                  <button key={emoji} className="h-10 w-10 rounded-lg hover:bg-gray-100 text-lg transition-colors">
                    {emoji}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
