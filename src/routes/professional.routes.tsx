import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import Professionals from '@pages/Professionals';
import ProtectedRoute from './ProtectedRoute';

const ProfessionalRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute requiredPermissions={['READ_PROFESSIONAL']} />}
      >
        <Route
          path="/"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <Professionals />
            </div>
          }
        />
      </Route>
      <Route
        element={
          <ProtectedRoute requiredPermissions={['CREATE_PROFESSIONAL']} />
        }
      >
        <Route
          path="/form"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <Professionals />
            </div>
          }
        />
      </Route>
      <Route
        element={
          <ProtectedRoute requiredPermissions={['UPDATE_PROFESSIONAL']} />
        }
      >
        <Route
          path="/form/:id"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <Professionals />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default ProfessionalRoutes;
