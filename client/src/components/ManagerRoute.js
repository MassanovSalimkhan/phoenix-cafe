import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ManagerRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'manager' && user?.role !== 'admin') return <Navigate to="/" />;
  return children;
};