import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerProfile from '@pages/OwnerProfile';
import { useAuth } from '@contexts/Auth';

const ProfileRoutes = (): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={permissions.includes('USER_TYPE_OWNER') && <OwnerProfile />}
      />
    </Routes>
  );
};

export default ProfileRoutes;
