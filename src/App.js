import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

function AuthenticatedApp() {
  const { user, isAuthenticated, hasAccess } = useAuth();
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
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
