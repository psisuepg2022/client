import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import Schedule from '@pages/Schedule';

const ScheduleRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <SideBar />
            <Schedule />
          </div>
        }
      />
    </Routes>
  );
};

export default ScheduleRoutes;
