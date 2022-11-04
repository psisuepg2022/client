import React, { useEffect } from 'react';
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
import { OwnerProvider } from '@contexts/Owner';
import { EmployeesProvider } from '@contexts/Employees';
import ProfessionalConfigRoutes from './professional.config.routes';
import ProfessionalInitialConfig from '@pages/ProfessionalInitialConfig';
import { showToast } from '@utils/showToast';

const AppRoutes = () => {
  const {
    isAuthenticated,
    user: { permissions },
  } = useAuth();

  useEffect(() => {
    window.addEventListener('offline', isOffline);
    window.addEventListener('online', isOnline);

    return () => {
      window.removeEventListener('offline', isOffline);
      window.removeEventListener('online', isOnline);
    };
  }, []);

  const isOffline = () => {
    showToast({
      text: 'Você está sem conexão! Reconecte-se para poder utilizar o sistema.',
      icon: 'error',
      width: 450,
    });
  };

  const isOnline = () => {
    showToast({
      text: 'Conectado! Você se recuperou de uma queda na conexão.',
      width: 450,
    });
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (permissions.includes('USER_TYPE_PROFESSIONAL_UNCONFIGURED'))
    return (
      <ProfessionalsProvider>
        <Routes>
          <Route
            path="/professional-config"
            element={<ProfessionalInitialConfig />}
          />
          {/* REDIRECT */}
          <Route path="/" element={<Navigate to="/professional-config" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProfessionalsProvider>
    );

  return (
    <PatientsProvider>
      <ProfessionalsProvider>
        <EmployeesProvider>
          <OwnerProvider>
            <ScheduleProvider>
              <CommentsProvider>
                <Routes>
                  {/* SCHEDULE PAGES */}
                  <Route path="/schedule/*" element={<AgendaRoutes />} />

                  {/* COMMENT PAGES */}
                  <Route path="/comment/*" element={<CommentRoutes />} />

                  {/* PROFESSIONAL PAGES */}
                  <Route
                    path="/professionals/*"
                    element={<ProfessionalRoutes />}
                  />

                  {/* EMPLOYEE PAGES */}
                  <Route path="/employees/*" element={<EmployeeRoutes />} />

                  {/* PATIENTS PAGES */}
                  <Route path="/patients/*" element={<PatientRoutes />} />

                  {/* PROFILE PAGES */}
                  <Route path="/profile/*" element={<ProfileRoutes />} />

                  {/* PROFESSIONAL INITIAL CONFIG PAGES */}
                  <Route
                    path="/professional-config/*"
                    element={<ProfessionalConfigRoutes />}
                  />

                  {/* REDIRECT */}
                  <Route path="/" element={<Navigate to="/schedule" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CommentsProvider>
            </ScheduleProvider>
          </OwnerProvider>
        </EmployeesProvider>
      </ProfessionalsProvider>
    </PatientsProvider>
  );
};

export default AppRoutes;
