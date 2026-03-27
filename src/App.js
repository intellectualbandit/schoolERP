import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SchoolConfigProvider, useSchoolConfig } from './contexts/SchoolConfigContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TimeLogProvider } from './contexts/TimeLogContext';
import ROLE_CONFIG from './data/roleConfig';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Fees from './pages/Fees';
import Wellness from './pages/Wellness';
import Behavior from './pages/Behavior';
import Reports from './pages/Reports';
import Alumni from './pages/Alumni';
import Announcements from './pages/Announcements';
import Settings from './pages/Settings';
import TimeLogs from './pages/TimeLogs';
import Payroll from './pages/Payroll';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading SchoolERP...</p>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  const { user, isAuthenticated, loading: authLoading, hasAccess } = useAuth();
  const { configLoading } = useSchoolConfig();
  const [active, setActive] = useState('dashboard');

  // Reset to dashboard on login/logout
  useEffect(() => {
    if (isAuthenticated) {
      setActive('dashboard');
    }
  }, [isAuthenticated]);

  // Guard: redirect to allowed page if current page is not accessible
  useEffect(() => {
    if (user && !hasAccess(active)) {
      setActive('dashboard');
    }
  }, [active, user, hasAccess]);

  // Show loading while auth or config is initializing
  if (authLoading || configLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    if (!hasAccess(active)) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p className="text-lg">You don't have access to this module.</p>
        </div>
      );
    }

    switch (active) {
      case 'dashboard': return <Dashboard />;
      case 'students': return <Students />;
      case 'teachers': return <Teachers />;
      case 'attendance': return <Attendance />;
      case 'grades': return <Grades />;
      case 'fees': return <Fees />;
      case 'announcements': return <Announcements />;
      case 'wellness': return <Wellness />;
      case 'behavior': return <Behavior />;
      case 'alumni': return <Alumni />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'timelogs': return <TimeLogs />;
      case 'payroll': return <Payroll />;
      default: return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p className="text-lg">This module is coming soon.</p>
        </div>
      );
    }
  };

  return (
    <MainLayout active={active} setActive={setActive}>
      {renderPage()}
    </MainLayout>
  );
}

function App() {
  return (
    <SchoolConfigProvider>
      <NotificationProvider>
        <TimeLogProvider>
          <AuthProvider>
            <AuthenticatedApp />
          </AuthProvider>
        </TimeLogProvider>
      </NotificationProvider>
    </SchoolConfigProvider>
  );
}

export default App;
