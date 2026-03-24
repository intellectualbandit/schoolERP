import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
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

function App() {
  const [active, setActive] = useState('dashboard');

  const renderPage = () => {
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

export default App;
