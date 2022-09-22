import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from '@components/SideBar';
import CommentCreation from '@pages/CommentCreation';
import ProtectedRoute from './ProtectedRoute';

const CommentRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute requiredPermissions={['CREATE_COMMENTS']} />}
      />
      <Route
        path="/creation"
        element={
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <SideBar />
            <CommentCreation />
          </div>
        }
      />
    </Routes>
  );
};

export default CommentRoutes;
