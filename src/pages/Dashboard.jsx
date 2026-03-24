import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import PrincipalDashboard from './dashboards/PrincipalDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import RegistrarDashboard from './dashboards/RegistrarDashboard';
import CashierDashboard from './dashboards/CashierDashboard';
import CounselorDashboard from './dashboards/CounselorDashboard';

const dashboardMap = {
  admin: AdminDashboard,
  principal: PrincipalDashboard,
  teacher: TeacherDashboard,
  student: StudentDashboard,
  parent: ParentDashboard,
  registrar: RegistrarDashboard,
  cashier: CashierDashboard,
  counselor: CounselorDashboard,
};

export default function Dashboard() {
  const { user } = useAuth();
  const DashboardComponent = dashboardMap[user?.role] || AdminDashboard;
  return <DashboardComponent />;
}
