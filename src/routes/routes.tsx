import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import SideBar from '../components/SideBar';
import { AuthProvider } from '../contexts/Auth';
import Agenda from '../pages/Agenda';
import Login from '../pages/Login';
import Patients from '../pages/Patients';
import PatientsForm from '../pages/PatientsForm';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* PRE-AUTH */}
        <Route>
          <Route>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

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
            path="/collaborators"
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
        <Route path="*" element={<Navigate to="/agenda" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
