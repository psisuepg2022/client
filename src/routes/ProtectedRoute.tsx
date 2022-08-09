import React from 'react';
import { useAuth } from '@contexts/Auth';
import { Permissions } from '@interfaces/Permissions';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  requiredPermissions: Permissions[];
  authenticated: boolean;
};

const ProtectedRoute = ({
  requiredPermissions,
  authenticated,
}: ProtectedRouteProps): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();

  if (authenticated) {
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
