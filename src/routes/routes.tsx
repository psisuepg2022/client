import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';
import { PatientsProvider } from '@contexts/Patients';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import NotFound from '@pages/NotFound';
import PatientRoutes from './patient.routes';
import EmployeeRoutes from './employee.routes';
import ProfessionalRoutes from './professional.routes';
import AgendaRoutes from './agenda.routes';

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
        {/* AGENDA PAGES */}
        <Route path="/agenda/*" element={<AgendaRoutes />} />

        {/* PROFESSIONAL PAGES */}
        <Route path="/professionals/*" element={<ProfessionalRoutes />} />

        {/* EMPLOYEE PAGES */}
        <Route path="/employees/*" element={<EmployeeRoutes />} />

        {/* PATIENTS PAGES */}
        <Route path="/patients/*" element={<PatientRoutes />} />

        {/* PROFILE */}

        <Route path="/profile" element={<Profile />} />

        {/* REDIRECT */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PatientsProvider>
  );
};

export default AppRoutes;
