import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import Agenda from '@pages/Agenda';

const AgendaRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        path="/agenda"
        element={
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <SideBar />
            <Agenda />
          </div>
        }
      />
    </Routes>
  );
};

export default AgendaRoutes;
