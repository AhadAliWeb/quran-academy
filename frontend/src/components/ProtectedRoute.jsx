// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

// Define role hierarchy
const ROLE_HIERARCHY = {
  admin: ['admin', 'teacher', 'student'],
  teacher: ['teacher', 'student'],
  student: ['student'],
};

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { email, isApproved, role } = useSelector((state) => state.user);
  const location = useLocation();

  // Check if user is logged in
  if (!email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is approved
  if (!isApproved) {
    return <Navigate to="/confirmation" replace />;
  }

  // If no roles specified, allow any authenticated user
  if (allowedRoles.length === 0) {
    return children;
  }

  // Get all roles the current user can access
  const userAccessibleRoles = ROLE_HIERARCHY[role] || [role];

  // Check if user has permission to access this route
  const hasAccess = allowedRoles.some(allowedRole => 
    userAccessibleRoles.includes(allowedRole)
  );

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};