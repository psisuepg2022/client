import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import ProtectedRoute from './ProtectedRoute';
import ProfessionalInitialConfig from '@pages/ProfessionalInitialConfig';

const ProfessionalConfigRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute
            requiredPermissions={['USER_TYPE_PROFESSIONAL_UNCONFIGURED']}
          />
        }
      >
        <Route
          path="/"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <ProfessionalInitialConfig />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default ProfessionalConfigRoutes;
