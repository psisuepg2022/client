import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
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
        <Route path="/" element={<App />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
