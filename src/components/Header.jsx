import { Menu, Bell, LogOut, ChevronRight, Check, BellOff } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import ROLE_CONFIG from '../data/roleConfig';

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
  settings: 'Settings',
  timelogs: 'Time Logs',
  payroll: 'Payroll',
};

export default function Header({ active, setIsOpen }) {
  const { user, logout } = useAuth();
  const { getNotificationsForUser, getUnreadCount, markAsRead, markAllRead } = useNotifications();
  const roleConfig = user ? ROLE_CONFIG[user.role] : null;
  const recipientKey = user ? `${user.role}_${user.id}` : '';
  const userNotifications = getNotificationsForUser(recipientKey).slice(0, 10);
  const unreadCount = getUnreadCount(recipientKey);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <header className="bg-background/80 backdrop-blur-md border-b px-4 lg:px-6 py-2.5 flex items-center gap-3 sticky top-0 z-10">
      {/* Hamburger - mobile only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(prev => !prev)}
        className="md:hidden h-8 w-8 text-muted-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-foreground truncate">
          {labels[active] || 'Dashboard'}
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {roleConfig && (
          <Badge variant="outline" className={`text-[11px] px-2 py-0.5 hidden sm:inline-flex font-medium ${roleConfig.color}`}>
            {roleConfig.shortLabel}
          </Badge>
        )}

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[420px] overflow-y-auto">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); markAllRead(recipientKey); }}
                  className="text-xs text-primary hover:underline font-normal"
                >
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <BellOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              userNotifications.map(notif => (
                <DropdownMenuItem
                  key={notif.id}
                  className={`flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-2 w-full">
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!notif.read ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
