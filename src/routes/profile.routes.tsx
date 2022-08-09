import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '@pages/Profile';

const ProfileRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Profile />} />
    </Routes>
  );
};

export default ProfileRoutes;
