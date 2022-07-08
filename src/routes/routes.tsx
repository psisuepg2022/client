import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import SideBar from '../components/SideBar';
import Agenda from '../pages/Agenda';
import Login from '../pages/Login';
import Patients from '../pages/Patients';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
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
            <div style={{ display: 'flex' }}>
              <SideBar />
              <Agenda />
            </div>
          }
        />
        <Route
          path="/professionals"
          element={
            <div style={{ display: 'flex' }}>
              <SideBar />
              <App />
            </div>
          }
        />
        <Route
          path="/collaborators"
          element={
            <div style={{ display: 'flex' }}>
              <SideBar />
              <App />
            </div>
          }
        />
        <Route
          path="/patients"
          element={
            <div style={{ display: 'flex' }}>
              <SideBar />
              <Patients />
            </div>
          }
        />
      </Route>

      {/* PROFILE */}
      <Route path="/profile" element={<Profile />} />

      {/* REDIRECT */}
      <Route path="*" element={<Navigate to="/agenda" replace />} />
    </Routes>
  );
};

export default AppRoutes;
