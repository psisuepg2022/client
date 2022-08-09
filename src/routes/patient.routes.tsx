import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import Patients from '@pages/Patients';
import PatientsForm from '@pages/PatientsForm';
import ProtectedRoute from './ProtectedRoute';

const PatientRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute requiredPermissions={['READ_PATIENT']} />}
      >
        <Route
          path="/"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <Patients />
            </div>
          }
        />
      </Route>

      <Route
        element={<ProtectedRoute requiredPermissions={['CREATE_PATIENT']} />}
      >
        <Route
          path="/form"
          element={
            <div
              style={{
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <SideBar />
              <PatientsForm />
            </div>
          }
        />
      </Route>

      <Route
        element={<ProtectedRoute requiredPermissions={['UPDATE_PATIENT']} />}
      >
        <Route
          path="/form/:id"
          element={
            <div
              style={{
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <SideBar />
              <PatientsForm />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default PatientRoutes;
