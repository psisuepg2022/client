import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import CommentCreation from '@pages/CommentCreation';
import ProtectedRoute from './ProtectedRoute';
import Comment from '@pages/Comment';
import ConcludedAppointments from '@pages/ConcludedAppointments';

const CommentRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute
            requiredPermissions={['READ_COMMENTS', 'USER_TYPE_PROFESSIONAL']}
          />
        }
      >
        <Route
          path="/"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <Comment />
            </div>
          }
        />
      </Route>
      <Route
        element={
          <ProtectedRoute
            requiredPermissions={['CREATE_COMMENTS', 'USER_TYPE_PROFESSIONAL']}
          />
        }
      >
        <Route
          path="/creation"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <CommentCreation />
            </div>
          }
        />
      </Route>
      <Route
        element={
          <ProtectedRoute
            requiredPermissions={['READ_COMMENTS', 'USER_TYPE_PROFESSIONAL']}
          />
        }
      >
        <Route
          path="/list"
          element={
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <SideBar />
              <ConcludedAppointments />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default CommentRoutes;
