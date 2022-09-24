import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerProfile from '@pages/OwnerProfile';
import { useAuth } from '@contexts/Auth';
import ProfessionalProfile from '@pages/ProfessionalProfile';
import ProtectedRoute from './ProtectedRoute';
import ProfessionalSchedule from '@pages/ProfessionalSchedule';

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
      <Route
        element={
          <ProtectedRoute
            requiredPermissions={[
              'READ_WEEKLY_SCHEDULE',
              'CREATE_WEEKLY_SCHEDULE',
              'UPDATE_WEEKLY_SCHEDULE',
              'CREATE_WEEKLY_SCHEDULE_LOCK',
              'DELETE_WEEKLY_SCHEDULE_LOCK',
              'READ_WEEKLY_SCHEDULE_LOCK',
              'UPDATE_WEEKLY_SCHEDULE_LOCK',
            ]}
          />
        }
      >
        <Route
          path="/professional_schedule"
          element={<ProfessionalSchedule />}
        />
      </Route>
    </Routes>
  );
};

export default ProfileRoutes;
