import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';
import { PatientsProvider } from '@contexts/Patients';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import PatientRoutes from './patient.routes';
import EmployeeRoutes from './employee.routes';
import ProfessionalRoutes from './professional.routes';
import ScheduleRoutes from './schedule.routes';
import ProfileRoutes from './profile.routes';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <PatientsProvider>
      <Routes>
        {/* SCHEDULE PAGES */}
        <Route path="/schedule/*" element={<ScheduleRoutes />} />

        {/* PROFESSIONAL PAGES */}
        <Route path="/professionals/*" element={<ProfessionalRoutes />} />

        {/* EMPLOYEE PAGES */}
        <Route path="/employees/*" element={<EmployeeRoutes />} />

        {/* PATIENTS PAGES */}
        <Route path="/patients/*" element={<PatientRoutes />} />

        {/* PROFILE PAGES */}
        <Route path="/profile/*" element={<ProfileRoutes />} />

        {/* REDIRECT */}
        <Route path="/" element={<Navigate to="/agenda" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PatientsProvider>
  );
};

export default AppRoutes;
