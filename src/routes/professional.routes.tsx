import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import App from 'src/App';

const ProfessionalRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <SideBar />
            <App />
          </div>
        }
      />
    </Routes>
  );
};

export default ProfessionalRoutes;
