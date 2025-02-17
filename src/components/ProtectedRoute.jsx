import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token || token === '') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
} 
