import { Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';

function PrivateRoute({ children }) {
  const { token, isTokenValid, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !isTokenValid()) {
      logout();
      navigate('/login', { replace: true });
    }
  }, [token, isTokenValid, logout, navigate]);

  if (!token || !isTokenValid()) {
    return null; // Retorna null temporariamente enquanto o useEffect redireciona
  }

  return children;
}

export default PrivateRoute;