import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import ProtectedRoute from './ProtectedRoute';
import Employees from '@pages/Employees';
import EmployeesForm from '@pages/EmployeesForm';

const EmployeeRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute requiredPermissions={['READ_EMPLOYEE']} />}
      >
        <Route
          path="/"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <Employees />
            </div>
          }
        />
      </Route>
      <Route
        element={<ProtectedRoute requiredPermissions={['CREATE_EMPLOYEE']} />}
      >
        <Route
          path="/form"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <EmployeesForm />
            </div>
          }
        />
      </Route>
      <Route
        element={<ProtectedRoute requiredPermissions={['UPDATE_EMPLOYEE']} />}
      >
        <Route
          path="/form/:id"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <EmployeesForm />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default EmployeeRoutes;
