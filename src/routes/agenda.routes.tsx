import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import Schedule from '@pages/Schedule';
import { useAuth } from '@contexts/Auth';

const ScheduleRoutes = (): JSX.Element => {
  const { sideBarExpanded } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <SideBar />
            <div
              style={
                sideBarExpanded
                  ? {
                      minWidth: 'calc(100% - 250px)',
                      maxWidth: 'calc(100% - 250px)',
                      display: 'flex',
                      overflow: 'hidden',
                    }
                  : {
                      minWidth: 'calc(100% - 70px)',
                      maxWidth: 'calc(100% - 70px)',
                      display: 'flex',
                      overflow: 'hidden',
                    }
              }
            >
              <Schedule />
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default ScheduleRoutes;
