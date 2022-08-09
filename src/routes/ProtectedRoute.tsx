import React from 'react';
import { useAuth } from '@contexts/Auth';
import { Permissions } from '@interfaces/Permissions';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  requiredPermissions: Permissions[];
};

const ProtectedRoute = ({
  requiredPermissions,
}: ProtectedRouteProps): JSX.Element => {
  const {
    user: { permissions },
    isAuthenticated,
  } = useAuth();

  if (isAuthenticated) {
    return requiredPermissions.every((permission) =>
      permissions.includes(permission)
    ) ? (
      <Outlet />
    ) : (
      <Navigate to="/not-found" />
    );
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
