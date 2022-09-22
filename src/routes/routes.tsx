import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';
import { PatientsProvider } from '@contexts/Patients';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import PatientRoutes from './patient.routes';
import EmployeeRoutes from './employee.routes';
import ProfessionalRoutes from './professional.routes';
import AgendaRoutes from './agenda.routes';
import ProfileRoutes from './profile.routes';
import { ScheduleProvider } from '@contexts/Schedule';
import { ProfessionalsProvider } from '@contexts/Professionals';
import CommentRoutes from './comment.routes';
import { CommentsProvider } from '@contexts/Comments';

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
      <ProfessionalsProvider>
        <ScheduleProvider>
          <CommentsProvider>
            <Routes>
              {/* SCHEDULE PAGES */}
              <Route path="/schedule/*" element={<AgendaRoutes />} />

              {/* COMMENT PAGES */}
              <Route path="/comment/*" element={<CommentRoutes />} />

              {/* PROFESSIONAL PAGES */}
              <Route path="/professionals/*" element={<ProfessionalRoutes />} />

              {/* EMPLOYEE PAGES */}
              <Route path="/employees/*" element={<EmployeeRoutes />} />

              {/* PATIENTS PAGES */}
              <Route path="/patients/*" element={<PatientRoutes />} />

              {/* PROFILE PAGES */}
              <Route path="/profile/*" element={<ProfileRoutes />} />

              {/* REDIRECT */}
              <Route path="/" element={<Navigate to="/schedule" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CommentsProvider>
        </ScheduleProvider>
      </ProfessionalsProvider>
    </PatientsProvider>
  );
};

export default AppRoutes;
