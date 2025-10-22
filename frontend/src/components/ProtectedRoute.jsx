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

  console.log(userAccessibleRoles, allowedRoles)

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};