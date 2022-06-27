import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import SideBar from '../components/SideBar';
import Login from '../pages/Login';

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
              <App />
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
              <App />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
