import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerProfile from '@pages/OwnerProfile';
import { useAuth } from '@contexts/Auth';
import ProfessionalProfile from '@pages/ProfessionalProfile';

const ProfileRoutes = (): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          permissions.includes('USER_TYPE_OWNER') ? (
            <OwnerProfile />
          ) : permissions.includes('USER_TYPE_PROFESSIONAL') ? (
            <ProfessionalProfile />
          ) : (
            <OwnerProfile />
          )
        }
      />
    </Routes>
  );
};

export default ProfileRoutes;
