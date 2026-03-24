import { Menu, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

const labels = {
  dashboard: 'Dashboard',
  students: 'Students',
  teachers: 'Teachers',
  classes: 'Classes',
  attendance: 'Attendance',
  grades: 'Grades',
  fees: 'Fees',
  announcements: 'Announcements',
  behavior: 'Behavior Log',
  wellness: 'Student Wellness',
  alumni: 'Alumni Tracker',
  reports: 'DepEd Reports',
};

export default function Header({ active, setIsOpen }) {
  return (
    <header className="bg-background border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
      {/* Hamburger - mobile only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(prev => !prev)}
        className="md:hidden h-8 w-8"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <h2 className="text-base font-semibold text-foreground flex-1">
        {labels[active] || 'Dashboard'}
      </h2>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
