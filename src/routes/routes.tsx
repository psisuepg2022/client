import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import SideBar from '@components/SideBar';
import { useAuth } from '@contexts/Auth';
import { PatientsProvider } from '@contexts/Patients';
import Agenda from '@pages/Agenda';
import Login from '@pages/Login';
import Patients from '@pages/Patients';
import PatientsForm from '@pages/PatientsForm';
import Profile from '@pages/Profile';
import NotFound from '@pages/NotFound';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <PatientsProvider>
      <Routes>
        {/* DASHBOARD */}
        <Route>
          <Route
            path="/agenda"
            element={
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                <SideBar />
                <Agenda />
              </div>
            }
          />
          <Route
            path="/professionals"
            element={
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                <SideBar />
                <App />
              </div>
            }
          />
          <Route
            path="/employees"
            element={
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                <SideBar />
                <App />
              </div>
            }
          />
          {/* PATIENTS PAGES */}
          <Route
            path="/patients"
            element={
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                <SideBar />
                <Patients />
              </div>
            }
          />
          <Route
            path="/patients/form"
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
          <Route
            path="/patients/form/:id"
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

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />

        {/* REDIRECT */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PatientsProvider>
  );
};

export default AppRoutes;
