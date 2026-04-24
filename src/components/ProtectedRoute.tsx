import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  allowedRole: 'student' | 'teacher';
}

const ProtectedRoute = ({ allowedRole }: Props) => {
  const { user, role, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;
  if (role !== allowedRole) return <Navigate to={role === 'teacher' ? '/teacher' : '/student'} replace />;

  return <Outlet />;
};

export default ProtectedRoute;